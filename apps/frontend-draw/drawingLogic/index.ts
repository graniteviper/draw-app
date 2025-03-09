import { HTTP_BACKEND } from "@/config";
import axios from "axios";
import { Shape } from "./Shapes";

export async function initDraw(
  canvas: HTMLCanvasElement,
  roomId: string,
  socket: WebSocket,
  shapeSelected: string
) {
  const ctx = canvas.getContext("2d");
  // console.log(shapeSelected);
  let existingShapes: Shape[] = await getExistingShapes(roomId);
  const height = canvas.height;
  const width = canvas.width;

  if (!ctx) {
    return;
  }

  console.log(existingShapes);

  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    if (message.type == "chat") {
      const parsedShape = JSON.parse(message.message);
      existingShapes.push(parsedShape.shape);
      clearCanvas(existingShapes, canvas, ctx);
    }
  };

  ctx.fillStyle = "rgba(0,0,0)";
  ctx.fillRect(0, 0, width, height);

  clearCanvas(existingShapes, canvas, ctx);

  let clicked = false;
  let startX = 0;
  let startY = 0;

  const handleMouseDown = (e: MouseEvent) => {
    clicked = true;
    startX = e.clientX;
    startY = e.clientY;
  };

  const handleMouseUp = (e: MouseEvent) => {
    clicked = false;
    if (shapeSelected === "rect") {
      drawRectangle(e);
    } else if (shapeSelected === "circle") {
      drawCircle(e);
    }
  };

  const drawRectangle = (e: MouseEvent) => {
    // console.log("rectangle")
    const width = e.clientX - startX;
    const height = e.clientY - startY;
    if (height !== 0) {
      const shape: Shape = {
        type: "rect",
        x: startX,
        y: startY,
        height,
        width,
      };
      existingShapes.push(shape);
      socket.send(
        JSON.stringify({
          type: "chat",
          message: JSON.stringify({
            shape,
          }),
          roomId,
        })
      );
    }
  };

  const drawCircle = (e: MouseEvent) => {
    // console.log("circle")
    const centerX = (e.clientX + startX) / 2;
    const centerY = (e.clientY + startY) / 2;
    const radius = Math.abs(startX - centerX);
    if (radius > 0) {
      const shape: Shape = {
        type: "circle",
        x: centerX,
        y: centerY,
        radius,
      };
      existingShapes.push(shape);
      socket.send(
        JSON.stringify({
          type: "chat",
          message: JSON.stringify({
            shape,
          }),
          roomId,
        })
      );
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (clicked) {
      clearCanvas(existingShapes, canvas, ctx);
      if (shapeSelected === "rect") {
        const width = e.clientX - startX;
        const height = e.clientY - startY;
        ctx.strokeStyle = "rgba(255,255,255)";
        ctx.strokeRect(startX, startY, width, height);
      } else if (shapeSelected === "circle") {
        const centerX = (e.clientX + startX) / 2;
        const centerY = (e.clientY + startY) / 2;
        const radius = Math.abs(startX - centerX);
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
        ctx.lineWidth = 1;
        ctx.strokeStyle = "rgba(255,255,255)";
        ctx.stroke();
      }
    }
  };

  canvas.removeEventListener("mousedown", handleMouseDown);
  canvas.removeEventListener("mouseup", handleMouseUp);
  canvas.removeEventListener("mousemove", handleMouseMove);

  canvas.addEventListener("mousedown", handleMouseDown);
  canvas.addEventListener("mouseup", handleMouseUp);
  canvas.addEventListener("mousemove", handleMouseMove);
}

function clearCanvas(
  existingShapes: Shape[],
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D
) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(0,0,0)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  existingShapes.map((shape) => {
    if (shape.type === "rect") {
      ctx.strokeStyle = "rgba(255,255,255)";
      ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
    }
    if (shape.type === "circle" && shape.radius > 0) {
      ctx.beginPath();
      ctx.arc(shape.x, shape.y, shape.radius, 0, 2 * Math.PI, false);
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(255,255,255)";
      ctx.stroke();
    }
  });
}

async function getExistingShapes(roomId: string) {
  const res = await axios.get(`${HTTP_BACKEND}/chats/${roomId}`);
  const messages = res.data.messages;
  // console.log(messages);
  const shapes = messages.map((x: { message: string }) => {
    const messageData = JSON.parse(x.message);
    return messageData.shape;
  });

  return shapes;
}




