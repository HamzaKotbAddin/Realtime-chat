"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api-client";
import { AUTH_LOGIN, AUTH_SIGNUP } from "@/utils/constants";

const API_BASE = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

export default function AuthForm() {
  /* ---------------- state ---------------- */
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  /* -------------- validation ------------- */
  const validateSignup = () => {
    if (!username.trim()) {
      toast.error("Username is required");
      return false;
    }
    if (!email.trim()) {
      toast.error("Email is required");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      toast.error("Please enter a valid email address");
      return false;
    }
    if (!password) {
      toast.error("Password is required");
      return false;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }
    return true;
  };

  const validateLogin = () => {
    if (!email.trim()) {
      toast.error("Email is required");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      toast.error("Please enter a valid email address");
      return false;
    }
    if (!password) {
      toast.error("Password is required");
      return false;
    }
    return true;
  };

  /* -------------- handlers --------------- */
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateSignup()) return;

    try {
      setIsLoading(true);
      const response = await apiClient.post(AUTH_SIGNUP, {
        username: username.trim(),
        email: email.trim(),
        password,
      });
      console.log("Signup response:", response.data);
      toast.success("Account created successfully");
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.error || err.response?.data?.message || err.message;
      toast.error("Signup failed: " + errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast.error("Email and password are required");
      return;
    }

    try {
      setIsLoading(true);
      const response = await apiClient.post(AUTH_LOGIN, {
        email: email.trim(),
        password,
      });
      console.log("Login response:", response.data);
      toast.success("Login successful");
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.error || err.response?.data?.message || err.message;
      toast.error("Login failed: " + errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------------- view ----------------- */
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-900 px-4">
      <div className="w-[90vw] h-[90vh] max-w-6xl bg-white dark:bg-gray-800 shadow-xl rounded-lg p-10 overflow-y-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white">
            Welcome
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Please log in or sign up to continue
          </p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="mx-auto flex gap-4 border-b mb-6 w-fit">
            <TabsTrigger value="login" className="px-20 pb-2">
              Login
            </TabsTrigger>
            <TabsTrigger value="signup" className="px-20 pb-2">
              Sign Up
            </TabsTrigger>
          </TabsList>

          {/* ------------ LOGIN ------------- */}
          <TabsContent value="login">
            <form
              onSubmit={handleLogin}
              className="max-w-md w-full mx-auto flex flex-col gap-4"
            >
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit" disabled={isLoading} className="mt-4">
                {isLoading ? "Please wait…" : "Login"}
              </Button>
            </form>
          </TabsContent>

          {/* ------------ SIGN UP ----------- */}
          <TabsContent value="signup">
            <form
              onSubmit={handleSignup}
              className="max-w-md w-full mx-auto flex flex-col gap-4"
            >
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
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <Button type="submit" disabled={isLoading} className="mt-4">
                {isLoading ? "Creating…" : "Sign Up"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
