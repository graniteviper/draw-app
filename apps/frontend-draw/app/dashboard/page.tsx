"use client";
import Button from "@repo/ui/button";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const page = () => {
  // const [token, setToken] = useState<string | null>("");
  const router = useRouter();
  const [name, setName] = useState<string | null>(null);
  const [rooms, setrooms] = useState([]);
  const [matchingRooms,setMatchingRooms] = useState([]);
  const newRoomRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const cookie = localStorage.getItem("authorization");
    const getUser = async (token: string) => {
      const user = await axios.get("http://localhost:8000/user", {
        headers: {
          authorization: token,
        },
      });
      setName(user.data.name);
    };
    if (cookie) {
      getUser(cookie);
      getRooms();
    }
  }, []);

  async function createNewRoom() {
    const token = localStorage.getItem("authorization");
    if (newRoomRef.current == null) {
      console.log("Name can't be empty");
      return;
    }
    const res = await axios.post(
      "http://localhost:8000/createRoom",
      {
        name: newRoomRef.current.value,
      },
      {
        headers: {
          authorization: token,
        },
      }
    );
    // console.log(res);
    getRooms();
  }

  // To get rooms: 
  async function getRooms(){
    const token = localStorage.getItem('authorization');
    const res = await axios.get("http://localhost:8000/getRooms",{
      headers:{
        'authorization': token
      }
    });
    // console.log(res);
    setrooms(res.data.rooms);
  }
  
  //Take to Canvas on clicking the room
  function takeToCanvas(roomId: string | number){
    // alert(roomId);
    const cookie = localStorage.getItem("authorization");
    router.push(`canvas/${roomId}?token=${cookie}`);
  }

  async function joinRoom(slug: string){
    const token = localStorage.getItem('authorization');
    // console.log(token)
    if(slug === ""){
      setMatchingRooms([]);
      return;
    } else{
      const res = await axios.post("http://localhost:8000/getMatchingRooms",{
        headers:{
          'authorization': token
        },
        data:{
          slug
        }
      });
      // console.log("response:",res.data.data);
      setMatchingRooms(res.data.data);
    }
  }
  
  useEffect(() => {
  console.log(matchingRooms);
  setMatchingRooms(matchingRooms);
}, [matchingRooms])

  
  return (
    <div className="w-screen h-screen">
      <div className="text-lg m-10">
        Dashboard for <span className="text-2xl text-orange-600">{name}</span>
      </div>
      {/* Adding new Rooms */}
      <div>
        <input
          ref={newRoomRef}
          type="text"
          placeholder="room name"
          className="m-10 border-2 px-3 py-1 border-black rounded-lg"
        />
        <Button
          label="Create new Room"
          className="border-2 border-black rounded-md m-10 px-3 py-2 hover:bg-gray-100"
          onClick={createNewRoom}
        ></Button>
      </div>
      {/* Displaying rooms created by the user */}
      <div className="m-10">
        {rooms.map((room)=> (
          //@ts-ignore
          <Button key={room.id} className="border-2 border-black m-4 px-3 py-1 rounded-sm" label={room.slug} onClick={()=>takeToCanvas(room.id)}></Button>
        ))}
      </div>
      <div>
        <div>
          <input type="text" placeholder="Search for a room" className="border-2 border-black rounded-sm m-10" onChange={(e) => {joinRoom(e.currentTarget.value)}}/>
        </div>
        <div>
        {matchingRooms.map((room)=> (
          // @ts-ignore
          <Button key={room.id} className="border-2 border-black m-4 px-3 py-1 rounded-sm" label={room.slug} onClick={()=>takeToCanvas(room.id)}></Button>
        ))}
        </div>
      </div>
    </div>
  );
};

export default page;
