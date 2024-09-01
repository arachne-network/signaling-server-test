import { RedisClientType } from "redis";
import { userService } from "../mongodb/user.service";
import { Socket } from "socket.io";
import { roomService } from "../mongodb/room.service";
import { connectionService } from "../mongodb/connection.service";
import { IConnection } from "../../interfaces/IConnection";
import { userCache } from "../redis/user.cache";

export interface IEventHandler {
    create(socket: any, roomId: string): any;
    join(socket: any, roomId: string): any;
    offer(socket: any, toSocketId: string, offer: RTCSessionDescription): any;
    answer(socket: any, toSocketId: string, answer: RTCSessionDescription): any;
    disconnect(socket: any, reason: string): any;
    getCandidate(socket: any, toSocketId: string, candidate: RTCIceCandidate): any;
}

export class EventHandler implements IEventHandler{ 
    async create(socket: Socket, roomId : string){
        console.log("create", socket.id);
        await roomService.addRoom(roomId, socket.id);
        await userCache.saveStreamer(socket.id, roomId);
    }

    async join(socket: Socket, roomId: string) {
        console.log("join", roomId);
        roomService.addUserToRoom(roomId, socket.id);
    }
    offer(socket: Socket, toSocketId: string, offer: RTCSessionDescription) {
        console.log("offer", socket.id, toSocketId);
    }
    answer(socket: Socket, toSocketId: string, answer: RTCSessionDescription) {
        console.log("answer", socket.id, toSocketId);
    }

    async disconnect(socket: Socket, reason: string) {
        // delete room when streamer disconnected
        const room = await roomService.getRoomByStreamerId(socket.id);
        // console.log("streamer : ", streamer);
        if(room){
            roomService.deleteRoom(room.roomId);
        }
        else{
            const connection = await connectionService.getConnectionByfrom(socket.id);
            if(connection){
                connectionService.deleteConnection(connection.from, connection.to);
                // todo : call peerSelection to delete connection
            }
        }
        console.log(`disconnect ${socket.id} : `, reason);
    }
    async getCandidate(socket: Socket, toSocketId: string, candidate: RTCIceCandidate) {
        console.log("getCandidate", socket.id, toSocketId);
        const newConnection : IConnection = {
            from: toSocketId,
            to: socket.id,
        }
        await connectionService.addConnection(newConnection);
    }

}