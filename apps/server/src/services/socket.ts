import { Server } from "socket.io";
import Redis from "ioredis";

const pub = new Redis({
  host: "redis-24aa5983-pankajpandey8630-7bf1.a.aivencloud.com",
  port: 12158,
  username: "default",
  password: "AVNS_NlUDJUoEsldl2Gnsqlr",
});
const sub = new Redis({
  host: "redis-24aa5983-pankajpandey8630-7bf1.a.aivencloud.com",
  port: 12158,
  username: "default",
  password: "AVNS_NlUDJUoEsldl2Gnsqlr",
});

class SocketService {
  private _io: Server;
  constructor() {
    console.log("Init Socket Service...");
    this._io = new Server({
      cors: {
        allowedHeaders: ["*"],
        origin: "*",
      },
    });
    sub.subscribe("MESSAGES");
  }

  get io() {
    return this._io;
  }

  public initListeners() {
    const io = this.io;

    console.log("Init socket listeners...");
    io.on("connect", (socket) => {
      console.log("New Socket connected", socket.id);
      socket.on("event:message", async ({ message }: { message: string }) => {
        console.log("New Message received", message);
        // publish this message to redis
        pub.publish("MESSAGES", JSON.stringify({ message }));
      });
    });

    sub.on("message", async (chanel, message) => {
      if (chanel === "MESSAGES") io.emit("message", message);
    });
  }
}

export default SocketService;
