"use client";

import React, { useRef, useEffect, useState } from "react";
import { drawShapes, remove } from "@/DrawingLogic/drawShapes";

const Canvas = ({
  selectedShape,
  roomId,
}: {
  selectedShape: any;
  roomId: any;
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [ws, setWs] = useState<WebSocket | null>(null);

  // Create WebSocket on mount
  useEffect(() => {
    const token = localStorage.getItem("authorization")
    const socket = new WebSocket(`ws://localhost:8080/canvas/${roomId}?token=${token}`);
    setWs(socket);

    return () => {
      socket.close();
    };
  }, []);

  // Resize canvas to fit window
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  useEffect(() => {
    if (selectedShape && canvasRef.current && ws) {
      drawShapes(selectedShape, canvasRef.current, ws, roomId);
      return ()=>{
        remove(canvasRef.current!);
      }
    }
  }, [selectedShape, ws, roomId]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
};

export default Canvas;