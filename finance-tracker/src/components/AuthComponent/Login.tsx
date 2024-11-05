"use client";
import React, { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";

import { useRouter } from "next/navigation";
import { AppDispatch } from "@/redux/store";
import { LogUserInfo, User } from "@/redux/AuthSlice/SignUp";


type Props = {};

const Login = (props: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [users, setUser] = useState<Partial<User>>({
    email: "",
    password: "",
  });
  const handleChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleClick = () => {
    router.push("/signup");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user: Partial<User> = {
        email: users.email,
        password: users.password,
      };
      const response = await dispatch(LogUserInfo(user as User)).unwrap();
      if (response) {
        localStorage.setItem("user", JSON.stringify(response));
        router.push("/home");
      }

      setUser({
        email: "",
        password: "",
      });
    } catch (error) {
      console.error("Error logging", error);
    }
  };

  return (
    <div className="mx-[30vw] bg-[#f2f6f9] my-[15vh]">
      <div className="flex justify-center py-[4vh]  text-xl italic">
        Log In
      </div>
      <div className="px-[1vw] py-[2vh]">
        <form onSubmit={handleSubmit}>
          <div className="grid w-full max-w-sm items-center gap-3  mb-[2vh]">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              className="w-[38vw]"
              value={users.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-3  mb-[2vh]">
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              className="w-[38vw]"
              value={users.password}
              onChange={handleChange}
              required
            />
          </div>
          <Button
            type="submit"
            className="bg-[#f2f6f9] border-2 border-[#13c892] text-[#13c892] text-md hover:bg-[#13c892] hover:text-white my-[2vh] w-full shadow-none rounded-md"
          >
            Login
          </Button>
        </form>
        <div className="flex gap-2  ">
          <div>Don't have an account?</div>
          <div
            className="cursor-pointer hover:text-[#13c892]"
            onClick={handleClick}
          >
            Sign Up
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;
