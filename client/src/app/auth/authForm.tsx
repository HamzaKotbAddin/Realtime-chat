"use client";

import { useState } from "react";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
export default function AuthForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [handleSignup, setHandleSignup] = useState("");
  const [handleLogin, setHandleLogin] = useState("");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-900 px-4">
      <div className="w-[90vw]  h-[90vh] max-w-6xl bg-white dark:bg-gray-800 shadow-xl rounded-lg p-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white">
            Welcome
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Please login or sign up to continue
          </p>
        </div>

        <Tabs defaultValue="account" className="w-full">
          <TabsList className="mx-auto flex justify-center items-center gap-4 border-b border-gray-300 dark:border-gray-700 mb-6 w-fit ">
            <TabsTrigger
              value="account"
              className="pb-2 px-20 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900 rounded transition-colors duration-200"
            >
              Login
            </TabsTrigger>
            <TabsTrigger
              value="password"
              className="pb-2 px-20 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900 rounded transition-colors duration-200"
            >
              Sign Up
            </TabsTrigger>
          </TabsList>

          <TabsContent value="account">
            <div className="max-w-md w-full mx-auto flex flex-col gap-4">
              <form className="flex flex-col gap-4">
                <Input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  type="password"
                  placeholder="New password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <Button
                  type="submit"
                  className="mt-4 text-white font-semibold py-2 rounded-2xl hover:bg-gray-700 cursor-pointer"
                  value={handleLogin}
                  onClick={(e) => {
                    e.preventDefault();
                    // Handle account update logic here
                    setHandleLogin("login");
                    console.log("Login successful");
                  }}
                >
                  Login
                </Button>
              </form>
            </div>
          </TabsContent>

          <TabsContent value="password">
            <div className="max-w-md w-full mx-auto flex flex-col gap-4">
              <form className="flex flex-col gap-4">
                <Input type="email" placeholder="Email" />
                <Input type="password" placeholder="New password" />
                <Button
                  type="submit"
                  value={handleSignup}
                  className="mt-4 text-white font-semibold py-2 rounded-2xl  hover:bg-gray-700 cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    // Handle password update logic here
                    setHandleSignup("signup");
                    console.log("signup successful");
                  }}
                >
                  Sign Up
                </Button>
              </form>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
