import bodyParser from "body-parser";
import express, { Express, Request, Response } from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import path from "path";
import {RoomManager} from "./Rooms";
import {selectPeer} from "./selectPeer";
import { Room } from "./interfaces";
import { Connection, ConnectionStatus } from "./interfaces/connection";

const port = 3000;

interface Message {
  sender: string;
  receiver: string;
  sdp?: RTCSessionDescription;
}

interface CandidateMessage {
  sender: string;
  candidate: RTCIceCandidate;
}

const app: Express = express();
const server = createServer(app);
const io: Server = new Server(server);

const staticDir = path.join(__dirname, "../static");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(staticDir));


const roomManager = new RoomManager();
const socketToRoom: Map<string, Room> = new Map();

io.on("connection", (socket: Socket) => {
  const userId = socket.id; // 유저 id로 나눠야 하지만 일단 연결별로 다른 유저

  socket.on("startStream", (roomId: string) => {
    socket.join(roomId);
    const room = roomManager.createRoom(roomId, userId);
    socketToRoom.set(roomId, room);
    console.log(`[server]: ${userId} started streaming in room ${roomId}`);
  });

  socket.on("joinRoom", (roomId: string) => {
    // 일단은 streamer와 직접적으로 연결한다.
    // sender와 receiver를 직접 만들어서 메시지에 포함해야 한다.
    socket.join(roomId);
    const room: Room = roomManager.getRoom(roomId);
    const sender: string = selectPeer(room);
    roomManager.addViewer(room, userId);
    // sender, receiver를 db에 집어넣는다.

    console.log(`[server]: ${userId} joined room ${roomId}`);
    console.log("sender: "+ sender + " receiver: " + userId);

    const connection: Connection = {
      sender: sender,
      receiver: userId,
      status: ConnectionStatus.PENDING,
      timestamp: Date.now(),
    };

    const msg: Message = {
      sender: sender,
      receiver: userId,
    };

    for(const user of room.viewers) {
      if(user.id === sender) {
        user.isHosting = true;
        console.log(`[server]: ${user.id} is now hosting`);
      }
    }
    
    io.in(sender).emit("makeOffer", msg);
  });

  socket.on("list", (data: any, callback: Function) => {
    callback({
      rooms: roomManager.getRoomIds(),
    });
  });

  // callback 함수로 offer를 받았다고 하자. 그럼
  socket.on("getOffer", (msg: Message) => {
    io.in(msg.receiver).emit("makeAnswer", msg);  
  });

  socket.on("getAnswer", (msg: Message) => {
    io.in(msg.sender).emit("setAnswer", msg);
  });

  socket.on("getCandidate", (msg: CandidateMessage) => {
    io.in(msg.sender).emit("setCandidate", msg);
  });

  socket.on("disconnect", () => {
    const room = socketToRoom.get(userId);

    if (room) {
      roomManager.removeUser(room, userId);
      console.log(`[server]: ${userId} disconnected`);
    }
  });
});

server.listen(port, () => {
  console.log(`[server]: Serves running at <https://localhost>:${port}`);
});
