"use client";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 ">
      <div className="p-20 bg-white rounded-lg shadow-lg text-black ">
        <h1 className="text-2xl font-bold mb-5">Admin Login</h1>
        <div className="block mb-2 w-full">
          <span className="block mb-1">Username:</span>
          <input
            type="username"
            placeholder="Enter your username"
            className="w-full px-4 py-2 border rounded"
          />
        </div>
        <div className="block mb-2 w-full">
          <span className="block mb-1">Password:</span>
          <input
            type="password"
            placeholder="Enter your password"
            className="w-full px-4 py-2 border rounded"
          />
        </div>
        <button
          className="mt-5 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => (window.location.href = "/dashboard")}
        >
          Login
        </button>
      </div>
    </div>
  );
}
