"use client";
import { api } from "@/lib/api";
import { useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);

      if (!username || !password) {
        setError("Username and password are required");
        return;
      }

      console.log("Attempting login with:", { username });
      const response = await api.post("/auth/login", {
        username,
        password,
      });

      console.log("Login response:", response);

      if (response.data?.token) {
        console.log("Login successful, setting token");
        Cookies.set("authToken", response.data.token, {
          path: "/",
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax"
        });
        router.push("/dashboard");
      } else {
        console.error("Invalid response format:", response.data);
        setError("Invalid response from server");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      console.error("Error response:", error.response);
      setError(
        error.response?.data?.message ||
        error.message ||
        "Login failed. Please try again."
      );
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="p-20 bg-white rounded-lg shadow-lg text-black">
        <h1 className="text-2xl font-bold mb-5">Admin Login</h1>
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        <form onSubmit={handleLogin}>
          <div className="block mb-2 w-full">
            <span className="block mb-1">Username:</span>
            <input
              className="w-full border border-gray-300 rounded px-3 py-2"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
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
              required
            />
          </div>
          <button
            className="mt-5 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full"
            type="submit"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
