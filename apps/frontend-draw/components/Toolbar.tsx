import { DrawingShape, drawingShapeTypes } from "@/shapes";
import {
  ArrowRightIcon,
  Circle,
  EraserIcon,
  Minus,
  Pen,
  RectangleHorizontal,
} from "lucide-react";
import React from "react";

interface CanvasProps {
    setselectedShape: (input: drawingShapeTypes)=> void;
}

const Toolbar: React.FC<CanvasProps> = ({setselectedShape}) => {
  const drawRect = () => {
    setselectedShape("Rectangle")
  };

  const drawCircle = () => {
    setselectedShape("Circle")
  };

  const drawPen = () => {
    console.log("Pen tool activated");
  };

  const erase = () => {
    console.log("Eraser tool activated");
  };

  const line = () => {
    console.log("Line tool activated");
  };

  const drawArrow = () => {
    console.log("Arrow drawn");
  };

  return (
    <div className="w-screen absolute flex items-center justify-center">
        <div className="bg-white h-10 w-96 m-4 rounded-md flex justify-around items-center p-1">
          <RectangleHorizontal
            size={"40px"}
            className="rounded-sm cursor-pointer hover:bg-red-400 transition-all duration-400 px-1"
            onClick={drawRect}
          />
          <Circle
            size={"40px"}
            className="rounded-sm cursor-pointer hover:bg-red-400 transition-all duration-400 px-1"
            onClick={drawCircle}
          />
          <Pen
            size={"40px"}
            className="rounded-sm cursor-pointer hover:bg-red-400 transition-all duration-400 px-1"
            onClick={drawPen}
          />
          <EraserIcon
            size={"40px"}
            className="rounded-sm cursor-pointer hover:bg-red-400 transition-all duration-400 px-1"
            onClick={erase}
          />
          <Minus
            size={"40px"}
            className="rounded-sm cursor-pointer hover:bg-red-400 transition-all duration-400 px-1"
            onClick={line}
          />
          <ArrowRightIcon
            size={"40px"}
            className="rounded-sm cursor-pointer hover:bg-red-400 transition-all duration-400 px-1"
            onClick={drawArrow}
          />
        </div>
    </div>
  );
};

export default Toolbar;
