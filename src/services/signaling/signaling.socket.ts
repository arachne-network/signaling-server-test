import { Server, Socket } from "socket.io";

// set selectPeer function's type as function that use roomId and socket Id to return string
// this function will be used to select peer to connect
// this function will be passed to SignalingHandler
export type SelectPeerFunc = (roomId : string, newSocketId: string) => string | Promise<string>;


export class SignalingHandler{
    private io : Server;

    // todo : change interface
    private eventHandler : any;
    private selectPeer : SelectPeerFunc;

    // selectePeer : (string, string) => string
    constructor(io: Server, selectPeer : SelectPeerFunc, eventHandler: any = null){
        this.io = io;
        this.selectPeer = selectPeer;
        this.eventHandler = eventHandler;
    }

    listen(){
        this.io.on("connection", (socket: Socket) => {
            socket.on("create", async (roomId: string) => {
                socket.join(roomId);
                if(this.eventHandler)
                    this.eventHandler.create(socket, roomId);
            });

            socket.on("join", async (roomId: string) => {
                socket.join(roomId);
                if(this.eventHandler)
                    this.eventHandler.join(socket, roomId);

                const sender = await this.selectPeer(roomId, socket.id);
                this.io.in(sender).emit("makeOffer", socket.id);
            });

            socket.on("offer", (toSocketId: string, offer: RTCSessionDescription) => {
                if(this.eventHandler)
                    this.eventHandler.offer(socket, toSocketId, offer);
                this.io.in(toSocketId).emit("makeAnswer", socket.id, offer);
            });

            socket.on("answer", (toSocketId: string, answer: RTCSessionDescription) => {
                if(this.eventHandler)
                    this.eventHandler.answer(socket, toSocketId, answer);
                this.io.in(toSocketId).emit("setAnswer", socket.id, answer);
            });

            socket.on("disconnect", async (reason: string) => {
                socket.leave(socket.id);

                if(this.eventHandler)
                    this.eventHandler.disconnect(socket, reason);
            });

            socket.on("getCandidate", (toSocketId : string, candidate : RTCIceCandidate) => {
                if(this.eventHandler)
                    this.eventHandler.getCandidate(socket, toSocketId, candidate);
                this.io.in(toSocketId).emit("setCandidate", socket.id, candidate);
            });
        });
    }
}