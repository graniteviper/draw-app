import { initDraw } from "@/drawingLogic";
import React, { useEffect, useRef } from "react";

const Canvas = ({roomId,socket,shapeSelected}: {
    roomId: string,
    socket: WebSocket,
    shapeSelected: string
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // console.log("canvas rendered");
    if (canvasRef.current) {
      initDraw(canvasRef.current, roomId,socket,shapeSelected);
    }
  }, [canvasRef,shapeSelected]);

  return (
    <div>
      <canvas ref={canvasRef} height={1000} width={2000}></canvas>
    </div>
  );
};

export default Canvas;
