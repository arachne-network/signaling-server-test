import bodyParser from "body-parser";
import express, { Express, Request, Response } from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import path from "path";
import {selectPeer} from "./selectPeer";
import cache from "./core/db/db";
import { connectRedisAdapter } from "./core/db/redis";

const port = 3000;
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


const getUserToSocketKey = (userId: string, roomId : string) => {
  return `${userId}:${roomId}`;
}

io.on("connection", (socket: Socket) => {
  socket.on("createRoom", async (userId: string, roomId: string) => {
    // join user to room
    // set streamer to room
    // 

    socket.join(roomId);
    if(await cache.sCard(roomId))
    {
      console.log(`[server]: Room ${roomId} already exists`);
      socket.emit("error", {code : 2001, message: "Room already exists"});
      return;
    }

    // socket id to roomId who is streamer
    if(!await cache.get(`streamer:${socket.id}`)){
      cache.set(`streamer:${socket.id}`, roomId);
    }

    // set user to socket id
    if(!await cache.get(getUserToSocketKey(userId, roomId))) {
      cache.set(getUserToSocketKey(userId, roomId), socket.id);
    }

    // set socket id to user
    if(!await cache.get(socket.id)) {
      cache.set(socket.id, userId);
    }

    cache.sSet(roomId, userId);

    // roomId 존재하는지 체크
    // socketId, userId(스트리머) 맵핑
    // room 생성
  });

  socket.on("joinRoom", async (userId: string, roomId: string, networkData? : any) => {
    // room 존재하는지 확인
    // socketId, userId 맵핑
    // peer selection
    //  이건 유저 아이디랑 유저 네트워크 상황 필요
    // connection 추가
    // user send count 추가
    // offer 보내기

    socket.join(roomId);

    if(!await cache.sCard(roomId) || await cache.sCard(roomId) === 0){
      console.log(`[server]: Room ${roomId} does not exist`);
      socket.emit("error", {code : 2002, message: "Room does not exist"});
      return;
    }

    // set user to socket id
    if(!cache.get(getUserToSocketKey(userId, roomId))) {
      cache.set(getUserToSocketKey(userId, roomId), socket.id);
    }

    // set socket id to user
    if(!cache.get(socket.id)) {
      cache.set(socket.id, userId);
    }

    // roomId set에 userId 추가
    cache.sSet(roomId, userId);

    // select Peer 를 하면 User Id가 나온다.
    // userId에서 socketId를 어떻게 알까?
    const sender = await selectPeer(roomId);
    const senderSocketId = await cache.get(getUserToSocketKey(sender, roomId));

    io.in(senderSocketId).emit("makeOffer", socket.id);
  });
  socket.on("offer", (toSocketId: string, offer: RTCSessionDescription) => {
    io.in(toSocketId).emit("makeAnswer", socket.id, offer);
  });
  socket.on("answer", (toSocketId: string, answer: RTCSessionDescription) => {
    io.in(toSocketId).emit("setAnswer", socket.id, answer);
  });
  // socket.on("candidate", (userId: string, candidate: RTCIceCandidate) => {});
  socket.on("disconnect", (reason: string) => {
    // 1. streamer disconnect
    // const roomId = cache.get(`streamer:${socket.id}`);
    // if(roomId) {
    //   io.to(roomId).emit("streamerDisconnect");
    //   cache.del(roomId);
    //   cache.del(`streamer:${socket.id}`);
    // }
    // // 2. viewer disconnect
    // else{
    //   const userId = cache.get(socket.id);
    //   const roomId = cache.sGet(userId);
    //   cache.sRem(roomId, userId);
    // }

    console.log(`disconnect ${socket.id} : `, reason);
  });


  // socket.on("list", (data: any, callback: Function) => {
  //   callback({
  //     rooms: await cache.,
  //   });
  // });

  socket.on("getCandidate", (msg: CandidateMessage) => {
    io.in(msg.sender).emit("setCandidate", msg);
  });
});

// server.listen(port, () => {
//   console.log(`[server]: Serves running at <https://localhost>:${port}`);
// });

async function startServer() {
  try {
    await connectRedisAdapter(io);
    app.listen(port, () => {
      console.log(`[server]: Server running at <https://localhost>:${port}`);
    });
  } catch (e) {
    console.error(e);
  }
}

startServer();