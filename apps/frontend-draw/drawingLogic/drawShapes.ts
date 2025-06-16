import { drawingShapeTypes } from "@/shapes";
import axios from "axios";

export const drawShapes = (
  shape: drawingShapeTypes,
  canvas: HTMLCanvasElement,
  webSocket: WebSocket,
  roomId: string
) => {
  console.log(shape);    
  drawRectangle(canvas, webSocket, roomId,shape);
  
};

export type rectobject = {
  shape: string;
  startX: number;
  startY: number;
  width: number;
  height: number;
};

export type circleobject = {
  shape: "circle";
  cx: number;
  cy: number;
  radius: number;
};

let mousedownhandler: any;
let mouseuphandler: any;
let mouseleavehandler:any ;
let mousemovehandler: any;

const drawRectangle = (
  canvas: HTMLCanvasElement,
  webSocket: WebSocket,
  roomId: string,
  shape:string
) => {
  const ctx = canvas.getContext("2d");

  if (ctx) {
    let isDone: Boolean = true;
    let startX: number;
    let startY: number;
    let isDrawing = false;
    let centerX: number;
    let centerY: number;

    mousedownhandler = (e: MouseEvent) => {
      if(shape==="Rectangle"){
        startX = e.clientX;
        startY = e.clientY;
      } else if(shape==="Circle"){
        centerX = e.clientX;
        centerY = e.clientY;
      }
      isDrawing = true;
    };

    mousemovehandler= (e: MouseEvent) => {
      if(shape==="Rectangle"){

        if (!isDrawing) return;
        
        const width = e.clientX - startX;
        const height = e.clientY - startY;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
        
        ctx.strokeStyle = "white";
        ctx.strokeRect(startX, startY, width, height);
        const Rectangle: rectobject = {
          shape: "rect",
          startX,
          startY,
          width,
          height,
        };
        // console.log(Rectangle.shape);
        webSocket.send(
          JSON.stringify({
            type: "chat",
            shape: "rect",
            message: JSON.stringify(Rectangle),
            roomId: roomId,
          })
        );
      } else if(shape==="Circle"){
        if (!isDrawing) return;

      const radius: number = getRadius(centerX, centerY, e.clientX, e.clientY);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

      ctx.strokeStyle = "white";
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.stroke();
      const Circle: circleobject = {
        shape: "circle",
        cx: centerX,
        cy: centerY,
        radius: radius,
      };
      // console.log(Rectangle.shape);
      webSocket.send(
        JSON.stringify({
          type: "chat",
          shape: "rect",
          message: JSON.stringify(Circle),
          roomId: roomId,
        })
      );
      }
    };

    mouseuphandler = (e: MouseEvent) => {
      if(shape==="Rectangle"){

        if (!isDrawing) return;
        
        const width = e.clientX - startX;
        const height = e.clientY - startY;
        
        ctx.strokeStyle = "white";
        ctx.strokeRect(startX, startY, width, height);
        isDrawing = false;
      } else if(shape==="Circle"){
        if (!isDrawing) return;

      const radius = getRadius(centerX, centerY, e.clientX, e.clientY);

      ctx.strokeStyle = "white";
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.stroke();
      isDrawing = false;
      }
    };

    mouseleavehandler = () => {
      isDrawing = false;
      isDone = false;
    };

    canvas.addEventListener("mousedown", mousedownhandler);
    canvas.addEventListener("mousemove", mousemovehandler);
    canvas.addEventListener("mouseup", mouseuphandler);
    canvas.addEventListener("mouseleave", mouseleavehandler);
  }
};

const getExistingShapes = async ({ roomId }: { roomId: string }) => {
  const shapes = await axios.get(`http://localhost:8000/chats/:${roomId}`);
  console.log(shapes);
};

function getRadius(x1: number, y1: number, x2: number, y2: number): number {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

export function remove(canvas: HTMLCanvasElement){
  canvas.removeEventListener("mousedown", mousedownhandler);
  canvas.removeEventListener("mousemove", mousemovehandler);
  canvas.removeEventListener("mouseup", mouseuphandler);
  canvas.removeEventListener("mouseleave", mouseleavehandler);
}