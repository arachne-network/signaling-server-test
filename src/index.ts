import bodyParser from "body-parser";
import express, { Express, Request, Response } from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import path from "path";

const port = 3000;

interface StreamingRoom {
  roomId: string;
  streamer: string;
}
interface Description {
  roomId: string;
  initializer: string;
  description: RTCSessionDescription;
}

interface Message {
  sender: string;
  receiver: string;
  sdp?: RTCSessionDescription;
}

interface CandidateMessage {
  sender: string;
  candidate: RTCIceCandidate;
}

let streamingRooms: StreamingRoom[] = [];

const app: Express = express();
const server = createServer(app);
const io: Server = new Server(server);

const staticDir = path.join(__dirname, "../static");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(staticDir));

function addStreaming(streamerId: string) {
  const streamingRoom: StreamingRoom = {
    roomId: "room" + streamerId,
    streamer: streamerId,
  };
  streamingRooms.push(streamingRoom);
}

app.get("/", (req: Request, res: Response) => {
  res.sendFile(path.join(staticDir, "index.html"));
});

app.get("/test", (req: Request, res: Response) => {
  res.sendFile(path.join(staticDir, "test.html"));
});

app.get("/streamer", (req: Request, res: Response) => {
  res.sendFile(path.join(staticDir, "streamer.html"));
});
// roomId를 어떻게 가지고 갈 것인가? parameter로 가지고 가면 될 듯

app.get("/viewer", (req: Request, res: Response) => {
  res.sendFile(path.join(staticDir, "viewer.html"));
});

function selectPeer(roomId: string): string {
  // 일단은 streamer에게 쏜다고 하자
  return roomId.substring(4);
}

io.on("connection", (socket: Socket) => {
  socket.on("startStream", () => {
    // 해당 socket을 room에 다 넣어야 한다.
    // 일단 이거는 나중에 하고
    addStreaming(socket.id);
  });

  socket.on("joinRoom", (roomId: string) => {
    // 일단은 streamer와 직접적으로 연결한다.
    // sender와 receiver를 직접 만들어서 메시지에 포함해야 한다.
    const sender: string = selectPeer(roomId);
    const receiver: string = socket.id;

    const msg: Message = {
      sender: sender,
      receiver: receiver,
    };

    io.in(sender).emit("makeOffer", msg);
  });

  socket.on("list", (data: any, callback: Function) => {
    let list = [];
    for (let room of streamingRooms) {
      list.push(room.roomId);
    }
    callback({
      list: list,
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
});

server.listen(port, () => {
  console.log(`[server]: Serves running at <https://localhost>:${port}`);
});
