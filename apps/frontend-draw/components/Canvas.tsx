import { initDraw } from "@/drawingLogic";
import React, { useEffect, useRef } from "react";

const Canvas = ({roomId,socket}: {
    roomId: string,
    socket: WebSocket
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      initDraw(canvasRef.current, roomId,socket);
    }
  }, [canvasRef]);

  return (
    <div>
      <canvas ref={canvasRef} height={1000} width={2000}></canvas>
    </div>
  );
};

export default Canvas;
