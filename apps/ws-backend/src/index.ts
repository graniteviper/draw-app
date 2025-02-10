import { WebSocket, WebSocketServer } from "ws";
import { JWT_SECRET } from "@repo/backend-common/config";
import jwt from "jsonwebtoken";
import { prismaClient } from "@repo/database/client";
import axios from "axios";

const wss = new WebSocketServer({ port: 8080 });

interface User {
  ws: WebSocket;
  userId: string;
  rooms: string[];
}

const users: User[] = [];

function userCheck(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
  if (typeof decoded == "string") {
    return null;
  }

  if (!decoded || !decoded.id) {
    return null;
  }
  console.log(decoded);
  return decoded.id;
  } catch (error) {
    console.error(error);
    return null;
  }
}

wss.on("connection",async function connection(ws, request) {
  const url = request.url;
  console.log(url);
  if (!url) {
    return;
  }

  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("token") || "";
  const userId = userCheck(token);
  console.log("token");
  console.log(token);
  // console.log(userId);
  if (!userId) {
    ws.close();
    return;
  }

  users.push({
    userId,
    rooms: [],
    ws,
  });

  ws.on("message",async function message(data) {
    let parsedData;
    if (typeof data !== "string"){
      parsedData = JSON.parse(data.toString());
    } else{
      parsedData = JSON.parse(data);
    }
    // console.log("reached");
    if (parsedData.type === "join_room") {
      // console.log("inside join room");
      const user = users.find((x) => x.ws === ws);
      user?.rooms.push(parsedData.roomId);
    }

    // Create checks if the room exists or not and accordingly send message.

    if (parsedData.type === "leave_room") {
      const user = users.find((x) => x.ws === ws);
      if (!user) {
        return;
      }
      user.rooms = user?.rooms.filter((x) => x === parsedData.room);
    }

    if (parsedData.type === "chat") {
      const roomId = parsedData.roomId;
      const message = parsedData.message;
      // console.log("hi i am in chat");
      users.forEach((user) => {
        if (user.rooms.includes(roomId)) {
          user.ws.send(
            JSON.stringify({
              type: "chat",
              message: message,
              roomId: roomId,
            })
          );
        }
      });  // use queue to save to db

      console.log(parsedData);

      await prismaClient.chat.create({
        data:{
          message:parsedData.message,
          roomId: parseInt(parsedData.roomId),
          userId: userId
        }
      })
    }
    // console.log("Data");
    // console.log(parsedData);
  });
});