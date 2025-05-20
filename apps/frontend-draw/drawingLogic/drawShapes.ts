import { drawingShapeTypes } from "@/shapes";

export const drawShapes = (shape: drawingShapeTypes, canvas: HTMLCanvasElement, webSocket: WebSocket, roomId: string)=>{
    if(shape === "Rectangle"){
        drawRectangle(canvas,webSocket, roomId);
    }
};

export type rectobject ={
    shape: string
    startX: number,
    startY: number,
    width: number,
    height: number
}

const drawRectangle = (canvas: HTMLCanvasElement, webSocket: WebSocket, roomId: string) => {
    let startX = 0;
    let startY = 0;
    const ctx = canvas.getContext('2d');

    if (ctx) {
        let startX: number;
        let startY: number;
        let isDrawing = false;
    
        canvas.addEventListener("mousedown", (e: MouseEvent) => {
            startX = e.clientX;
            startY = e.clientY;
            isDrawing = true;
        });
    
        canvas.addEventListener("mousemove", (e: MouseEvent) => {
            if (!isDrawing) return;
    
            const width = e.clientX - startX;
            const height = e.clientY - startY;
    
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillRect(0,0,window.innerWidth,window.innerHeight);
            
            ctx.strokeStyle = 'white';
            ctx.strokeRect(startX, startY, width, height);
            const Rectangle: rectobject = {
                shape: 'rect',
                startX,
                startY,
                width,
                height
            };
            // console.log(Rectangle.shape);
            webSocket.send(JSON.stringify({
                type: "chat",
                shape: "rect",
                message: JSON.stringify(Rectangle),
                roomId: roomId
            }))
        });
    
        canvas.addEventListener("mouseup", (e: MouseEvent) => {
            if (!isDrawing) return; 
    
            const width = e.clientX - startX;
            const height = e.clientY - startY;
    
            ctx.strokeStyle = 'white';
            ctx.strokeRect(startX, startY, width, height);
            isDrawing = false; 
        });
    

        canvas.addEventListener("mouseleave", () => {
            isDrawing = false; 
        });
    }
    
}

const getExistingShapes = ()=>{

}

