"use client";
import axios from 'axios'
import React, { useEffect, useState } from 'react'

const page = () => {
  // const [token, setToken] = useState<string | null>("");
  const [name, setName] = useState<string | null>(null);
  
  useEffect(() => {
    const cookie = localStorage.getItem('authorization');
    const getUser = async (token: string) => {
      const user = await axios.get("http://localhost:8000/user",{
        headers:{
          'authorization': token
        }
      })
      setName(user.data.name);
    }
    if(cookie){
      getUser(cookie);
    }
  }, [])
  
  

  return (
    <div className='w-screen h-screen'>
      Dashboard for {name}
    </div>
  )
}

export default page