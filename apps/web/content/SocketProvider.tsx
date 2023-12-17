"use client";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";

interface SocketProviderProps {
  children?: React.ReactNode;
}

interface ISocketContext {
  sendMessage: (msg: string) => any;
  onMessageReceive?: (msg: string) => any;
  messages: string[];
}

const SocketContext = React.createContext<ISocketContext | null>(null);

// custom hook
export const useSocket = () => {
  const state = useContext(SocketContext);
  if (!state) {
    throw new Error("State is undefined");
  }
  return state;
};

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket>();
  const [messages, setMessages] = useState<string[]>([]);

  const sendMessage: ISocketContext["sendMessage"] = useCallback(
    (msg: string) => {
      console.log(" Send Message::::::", { message: msg });
      if (socket) {
        socket.emit("event:message", { message: msg });
      }
    },
    [socket]
  );

  const onMessageReceive: ISocketContext["onMessageReceive"] = useCallback(
    (msg: string) => {
      console.log("Message received from server", msg);
      setMessages((prev) => [...prev, msg]);
    },
    []
  );

  useEffect(() => {
    const _socket = io("http://localhost:8000");
    setSocket(_socket);
    _socket.on("message", onMessageReceive);
    return () => {
      _socket.disconnect();
      _socket.off("message", onMessageReceive);
      setSocket(undefined);
    };
  }, []);
  return (
    <SocketContext.Provider value={{ sendMessage, messages }}>
      {children}
    </SocketContext.Provider>
  );
};
