"use client";
import { useSocket } from "../content/SocketProvider";
import classes from "./page.module.css";
import { useState } from "react";

export default function Page() {
  const { sendMessage, messages } = useSocket();
  const [message, setMessage] = useState("");

  return (
    <div className={classes["container"]}>
      <div>
        {messages.map((msg) => (
          <p>{msg}</p>
        ))}
        <p>A</p>
      </div>
      <div>
        <input
          className={classes["chat-input"]}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Message..."
          type="text"
        />
        <button
          onClick={() => sendMessage(message)}
          className={classes["send-btn"]}
        >
          send
        </button>
      </div>
    </div>
  );
}
