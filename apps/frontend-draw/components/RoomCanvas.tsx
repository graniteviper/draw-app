"use client";
import { WS_URL } from '@/config';
import React, { useEffect,useState } from 'react'
import Canvas from './Canvas';

const RoomCanvas = ({roomId}: {
    roomId: string
}) => {

    const [socket, setsocket] = useState<WebSocket | null>(null);
    const [shapeSelected, setshapeSelected] = useState("");

    useEffect(()=>{
        const ws = new WebSocket(`${WS_URL}?token=${localStorage.getItem('authorization')}`);
        ws.onopen = () => {
            setsocket(ws);
            ws.send(JSON.stringify({
              type: "join_room",
              roomId
            }))
        }
    },[])
    
    // Hot Reloading

    if(!socket){
        return (
            <div className='w-screen h-screen flex justify-center items-center text-4xl text-red-600'>
                Loading...
            </div>
        )
    }

  return (
    <>
    <div className='absolute text-white w-screen flex justify-center top-4'>
        <ul className='flex gap-5'>
          <li onClick={()=>{setshapeSelected("rect")}} className='border-2 border-yellow-400 hover:border-red-400 transition-all duration-200 px-4 py-1 rounded-md cursor-pointer'>Rectangle</li>
          <li onClick={()=>{setshapeSelected("circle")}} className='border-2 border-yellow-400 hover:border-red-400 transition-all duration-200 px-4 py-1 rounded-md cursor-pointer'>Circle</li>
          <li className='border-2 border-yellow-400 hover:border-red-400 transition-all duration-200 px-4 py-1 rounded-md cursor-pointer'>Triangle</li>
          <li className='border-2 border-yellow-400 hover:border-red-400 transition-all duration-200 px-4 py-1 rounded-md cursor-pointer'>Rhombus</li>
          <li className='border-2 border-yellow-400 hover:border-red-400 transition-all duration-200 px-4 py-1 rounded-md cursor-pointer'>Eraser</li>
          <li className='border-2 border-yellow-400 hover:border-red-400 transition-all duration-200 px-4 py-1 rounded-md cursor-pointer'>Pencil</li>
        </ul>
      </div>
    <Canvas roomId={roomId} socket={socket} shapeSelected={shapeSelected}/>
    </>
  )
}

export default RoomCanvas