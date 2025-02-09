"use client";
import axios from "axios";
import React, { useRef } from "react";
// import {Button} from "@repo/ui/button"
import { userSignupSchema, userSigninSchema } from "@repo/commmon/types";
// import setCookie from "@/middlewares/cookies";
import { useRouter } from "next/navigation";

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
      // setCookie(user.data.token);
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
      // setCookie(user.data.token);
      router.push("/dashboard");
    } else {
      console.log("Data entered is not in valid format.");
    }
  }

  return (
    <>
      <div className="w-screen h-screen flex items-center justify-center">
        <div className="py-10 px-4 m-2 flex-col bg-red-600 gap-5 rounded-lg flex">
          {!isSignIn && (
            <input
              className="rounded-sm text-center"
              type="text"
              placeholder="name"
              ref={nameRef}
            />
          )}
          <input
            className="rounded-sm text-center"
            type="text"
            placeholder="Email"
            ref={emailRef}
          />
          <input
            className="rounded-sm text-center"
            type="password"
            placeholder="password"
            ref={passwordRef}
          />

          
        </div>
      </div>
    </>
  );
};

export default AuthPage;
