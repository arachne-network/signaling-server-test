import { Room, User } from "./interfaces";

export class RoomManager {
  private rooms: Room[] = [];

  createRoom(roomId: string, userId: string) {  
    const room : Room = {
      roomId: roomId,
      streamer: {
        id: userId,
        isHosting : false,
      },
      viewers: []
    }
    this.rooms.push(room);
    return room;  
  }

  removeUser(room: Room, userId: string) {
    const index = room.viewers.findIndex(user => user.id === userId);
    if (index !== -1) {
      room.viewers.splice(index, 1);
    }
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

  addViewer(room: Room, userId: string) {
    const user: User = {
      id: userId,
      isHosting: false,
    }

    room.viewers.push(user);
  }
}