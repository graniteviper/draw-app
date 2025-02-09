"use client";
import axios from "axios";
import React, { useRef } from "react";
import Button from "@repo/ui/button";
import { userSignupSchema, userSigninSchema } from "@repo/commmon/types";
import { useRouter } from "next/navigation";
// import { POST } from "@/app/api/cookie/route";

const AuthPage = ({ isSignIn }: { isSignIn: boolean }) => {
  const router = useRouter();
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  async function signup() {
    if (emailRef.current == null) {
      console.log("nameRef is not defined.");
      return;
    }
    if (nameRef.current == null) {
      console.log("nameRef is not defined.");
      return;
    }
    if (passwordRef.current == null) {
      console.log("nameRef is not defined.");
      return;
    }
    const formData = {
      email: emailRef.current.value,
      name: nameRef.current.value,
      password: passwordRef.current.value,
    };
    const { success } = userSignupSchema.safeParse(formData);
    if (success) {
      const user = await axios.post("http://localhost:8000/signup", formData);
      localStorage.setItem('authorization',user.data.token);
      router.push("/dashboard");
    } else {
      console.log("Data entered is not in valid format.");
    }
  }

  async function signin() {
    if (emailRef.current == null) {
      console.log("nameRef is not defined.");
      return;
    }
    if (passwordRef.current == null) {
      console.log("nameRef is not defined.");
      return;
    }
    const formData = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };
    // console.log(formData);
    const { success } = userSigninSchema.safeParse(formData);
    if (success) {
      const user = await axios.post("http://localhost:8000/signin", formData);
      // console.log(user);
      // const token = await axios.post("http://localhost:3001/api/cookie", {
      //   cookie: user.data.token,
      // });
      // console.log(token);
      localStorage.setItem('authorization',user.data.token);
      router.push("/dashboard");
    } else {
      console.log("Data entered is not in valid format.");
    }
  }

  return (
    <>
      <div className="w-screen h-screen flex items-center justify-center bg-gray-200">
        <div className="py-10 px-8 m-2 flex-col bg-white gap-5 rounded-lg shadow-lg flex">
          {!isSignIn && (
            <input
              className="rounded-lg text-center p-3 mb-4 bg-gray-100 border border-gray-300"
              type="text"
              placeholder="Name"
              ref={nameRef}
            />
          )}
          <input
            className="rounded-lg text-center p-3 mb-4 bg-gray-100 border border-gray-300"
            type="text"
            placeholder="Email"
            ref={emailRef}
          />
          <input
            className="rounded-lg text-center p-3 mb-4 bg-gray-100 border border-gray-300"
            type="password"
            placeholder="Password"
            ref={passwordRef}
          />

          <button
            onClick={isSignIn ? signin : signup}
            className="text-white bg-blue-500 p-3 rounded-lg hover:bg-blue-600"
          >
            {isSignIn ? "Sign In" : "Sign Up"}
          </button>
        </div>
      </div>
    </>
  );
};

export default AuthPage;
