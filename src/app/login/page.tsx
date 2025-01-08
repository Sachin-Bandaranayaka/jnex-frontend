"use client";
import api from "@/lib/api";
import { useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await api.post("/auth/login", {
        username,
        password,
      });

      if (response.status === 200) {
        console.log("Login successful", response.data);
        const { token, user } = response.data;
        const authToken = JSON.stringify({
          token,
          username: user.username,
          role: user.role,
        });
        Cookies.set("authToken", authToken, { path: "/" });
        router.push("/dashboard");
      } else {
        alert("Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 ">
      <div className="p-20 bg-white rounded-lg shadow-lg text-black ">
        <h1 className="text-2xl font-bold mb-5">Admin Login</h1>
        <div className="block mb-2 w-full">
          <span className="block mb-1">Username:</span>
          <input
            className="w-full border border-gray-300 rounded px-3 py-2"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="block mb-2 w-full">
          <span className="block mb-1">Password:</span>
          <input
            className="w-full border border-gray-300 rounded px-3 py-2"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          className="mt-5 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={handleLogin}
        >
          Login
        </button>
      </div>
    </div>
  );
}
