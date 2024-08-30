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
        await roomService.addRoom(roomId, socket.id);
        await userCache.saveStreamer(socket.id, roomId);
    }

    async join(socket: Socket, roomId: string) {
        roomService.addUserToRoom(roomId, socket.id);
    }
    offer(socket: Socket, toSocketId: string, offer: RTCSessionDescription) {
    
    }
    answer(socket: Socket, toSocketId: string, answer: RTCSessionDescription) {
        
    }
    disconnect(socket: Socket, reason: string) {
        
    }
    async getCandidate(socket: Socket, toSocketId: string, candidate: RTCIceCandidate) {
        const newConnection : IConnection = {
            from: socket.id,
            to: toSocketId,
        }
        await connectionService.addConnection(newConnection);
    }

}