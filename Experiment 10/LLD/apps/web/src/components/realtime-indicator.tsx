"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";

interface RealtimeIndicatorProps {
  conversationId: string;
}

export function RealtimeIndicator({ conversationId }: RealtimeIndicatorProps) {
  const [connected, setConnected] = useState(false);
  const [lastEvent, setLastEvent] = useState("Waiting for socket events");

  useEffect(() => {
    const socketUrl = process.env.NEXT_PUBLIC_CHAT_SOCKET_URL ?? "http://localhost:4103";
    const socket = io(socketUrl, {
      transports: ["websocket"],
      autoConnect: true
    });

    socket.on("connect", () => {
      setConnected(true);
      socket.emit("room:join", conversationId);
      socket.emit("presence:update", {
        userId: "user-1",
        availability: "available"
      });
    });

    socket.on("disconnect", () => {
      setConnected(false);
      setLastEvent("Socket disconnected, dashboard stays in graceful-degradation mode");
    });

    socket.on("system:connected", () => {
      setLastEvent("Connected to chat-service realtime stream");
    });

    socket.on("chat.message.created", (payload: { body: string }) => {
      setLastEvent(`New message event: ${payload.body}`);
    });

    socket.on("presence:updated", (payload: { userId: string; availability: string }) => {
      setLastEvent(`Presence update for ${payload.userId}: ${payload.availability}`);
    });

    return () => {
      socket.disconnect();
    };
  }, [conversationId]);

  return (
    <div className="realtime-pill">
      <span className={`status-dot ${connected ? "online" : "offline"}`} />
      <div>
        <strong>{connected ? "Realtime connected" : "Realtime degraded"}</strong>
        <p>{lastEvent}</p>
      </div>
    </div>
  );
}
