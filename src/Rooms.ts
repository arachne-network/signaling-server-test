import { Room, User } from "./interfaces";

export class RoomManager {
  private rooms: Room[] = [];

  createRoom(roomId: string, userId: string) {  
    const room : Room = {
      roomId: roomId,
      streamer: {
        id: userId
      },
      viewers: []
    }
    this.rooms.push(room);
    return room;  
  }
  
  getRooms() : Room[] {
      return this.rooms;
  }

  getRoomIds() : string[] {
    return this.rooms.map(room => room.roomId);
  }

  getRoom(roomId: string): Room {
      const room = this.rooms.find(room => room.roomId === roomId);
      if (!room) {
        throw new Error("Room not found");
      }
      return room;
  }
}