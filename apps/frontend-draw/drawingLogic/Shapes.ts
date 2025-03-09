export type Shape = {
    type: "rect";
    x: number;
    y: number;
    width: number;
    height: number;
  } | {
    type: "circle",
    x: number,
    y: number,
    radius: number
  };