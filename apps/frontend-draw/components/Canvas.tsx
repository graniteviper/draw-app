"use client";
import { HTTP_BACKEND, WS_URL } from "@/config";
import { drawShapes, rectobject } from "@/DrawingLogic/drawShapes";
import { drawingShapeTypes } from "@/shapes";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";

interface CanvasProps {
  selectedShape: drawingShapeTypes | undefined;
  roomId: string;
}

const Canvas: React.FC<CanvasProps> = ({ selectedShape, roomId }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvasHeight, setcanvasHeight] = useState(0);
  const [canvasWidth, setcanvasWidth] = useState(0);
  const [token, setToken] = useState<string | null>("");
  const socketRef = useRef<WebSocket | null>(null);
  const [existingShapes, setexistingShapes] = useState<string[]>([]);

  const addShape = (newShape: string) => {
    setexistingShapes((prevShapes) => [...prevShapes, newShape]);
  };

  useEffect(() => {
    const connectToWS = async () => {
      try {
        socketRef.current = new WebSocket(
          `${WS_URL}?token=${localStorage.getItem("authorization")}`
        );

        socketRef.current.onopen = () => {
          console.log("WebSocket connection established");
          socketRef.current!.send(
            JSON.stringify({
              type: "join_room",
              roomId,
            })
          );
        };

        socketRef.current.onerror = (error) => {
          console.error("WebSocket error:", error);
        };

        socketRef.current.onclose = () => {
          console.log("WebSocket connection closed");
        };
      } catch (error) {
        console.error("WebSocket connection failed:", error);
      }
    };

    if (localStorage.getItem("authorization")) {
      setToken(localStorage.getItem("authorization"));
      connectToWS();
    } else {
      alert("Not authorized");
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        console.log("WebSocket connection closed during cleanup");
      }
    };
  }, []);

  useEffect(() => {
    const getData = async () => {
      const data = await axios.get(`${HTTP_BACKEND}/chats/${roomId}`);
      const shapes: string[] = data.data.messages;
      shapes.forEach(shape => {
        addShape(shape);
      });
    };
    getData();
  }, []);

  if (socketRef.current) {
    socketRef.current!.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "chat") {
        // console.log(message.shape);

        const ctx = canvasRef.current?.getContext("2d");
        if (!ctx) {
          console.log("canvas not found");
          return;
        } else {
          addShape(message.message);
          // console.log(existingShapes);
          existingShapes.forEach((shape) => {
            //@ts-ignore
            const object = shape.message;
            console.log(object);
            if (object.shape === "rect") {
              // console.log(message.message);
              ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
              ctx.fillStyle = "black";
              ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
              ctx.strokeStyle = "white";
              ctx.strokeRect(
                object.startX,
                object.startY,
                object.width,
                object.height
              );
            }
          });
        }
      }
    };
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      const canvas = canvasRef.current;
      if (canvas) {
        setcanvasHeight(window.innerHeight);
        setcanvasWidth(window.innerWidth);
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
      }

      const handleResize = () => {
        if (canvas) {
          setcanvasHeight(window.innerHeight);
          setcanvasWidth(window.innerWidth);
          canvas.width = canvasWidth;
          canvas.height = canvasHeight;
        }
      };

      window.addEventListener("resize", handleResize);

      const ctx = canvas?.getContext("2d");

      if (ctx) {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      }

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, [canvasHeight, canvasWidth]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (selectedShape && canvas && socketRef.current) {
      drawShapes(selectedShape, canvas, socketRef.current, roomId);
    }
  }, [selectedShape]);

  //   const handleSendMessage = () => {
  //     sendMessage('Hello, WebSocket!');
  // };

  return <canvas ref={canvasRef} />;
};

export default Canvas;
