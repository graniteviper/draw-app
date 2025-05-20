// shapes.ts

// Common properties for all shapes
interface Shape {
    id: string;
    color: string;
    strokeWidth: number;
}

// Rectangle shape
interface Rectangle extends Shape {
    type: 'rectangle';
    x: number;
    y: number;
    width: number;
    height: number;
}

// Circle shape
interface Circle extends Shape {
    type: 'circle';
    cx: number;
    cy: number;
    radius: number;
}

// Line shape
interface Line extends Shape {
    type: 'line';
    startX: number;
    startY: number;
    endX: number;
    endY: number;
}

// Pen tool (freehand drawing)
interface Pen extends Shape {
    type: 'pen';
    points: { x: number; y: number }[];
}

// Union type for all shapes
type DrawingShape = {
    "Rectangle": Rectangle;
    "circle": Circle;
    "Line": Line;
    "Pen": Pen;
}

type drawingShapeTypes = "Rectangle" | "Circle" | "Line" | "Pen";

export type { Shape, Rectangle, Circle, Line, Pen, DrawingShape, drawingShapeTypes };