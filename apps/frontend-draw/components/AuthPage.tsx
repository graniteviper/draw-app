"use client";
import React from 'react'
const AuthPage = ({isSignIn}:{
    isSignIn: boolean
}) => {
  return (
    <>
        <div className='w-screen h-screen flex items-center justify-center'>
            <div className='p-2 m-2 bg-white rounded'>
                <input type="text" placeholder='Email'/>
                <input type="password" placeholder='password'/>
                <button className='text-black' onClick={() => {

                }}> {isSignIn ? "Sign In" : "Sign Up"} </button>
            </div>
        </div>
    </>
  )
}

export default AuthPage