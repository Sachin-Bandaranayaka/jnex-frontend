"use client";
import { useEffect } from "react";
import { requestForToken, onMessageListener } from "@/lib/firebase";

export default function DashboardPage() {
  useEffect(() => {
    requestForToken().then((token) => {
      console.log("FCM Token:", token);
      // Send this token to your backend for future notifications
    });

    onMessageListener().then((payload) => {
      console.log("Message received:", payload);
      // Handle the notification (e.g., show a toast)
    });
  }, []);

  return (
    <div className="p-4 text-black">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p>Welcome to the admin dashboard!</p>
    </div>
  );
}
