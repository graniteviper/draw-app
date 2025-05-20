"use client";
import React,{useState} from "react";
import Canvas from "./Canvas";
import Toolbar from "./Toolbar";
import { DrawingShape, drawingShapeTypes } from "@/shapes";
// import { configureStore } from "@reduxjs/toolkit";

const Roomcanvas = ({roomId}:{
  roomId: string
}) => {
  const [selectedShape, setselectedShape] = useState<drawingShapeTypes | undefined>();
  return (
    <>
      <Toolbar setselectedShape={setselectedShape}/>
      <Canvas selectedShape={selectedShape} roomId={roomId}/>
    </>
  );
};

export default Roomcanvas;
