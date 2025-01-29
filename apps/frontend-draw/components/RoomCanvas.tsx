"use client";
import { WS_URL } from '@/config';
import React, { useEffect,useState } from 'react'
import Canvas from './Canvas';

const RoomCanvas = ({roomId}: {
    roomId: string
}) => {

    const [socket, setsocket] = useState<WebSocket | null>(null);

    useEffect(()=>{
        const ws = new WebSocket(WS_URL);
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
    <Canvas roomId={roomId} socket={socket}/>
  )
}

export default RoomCanvas