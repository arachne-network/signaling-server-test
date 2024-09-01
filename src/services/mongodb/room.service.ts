import { IRoom } from '../../interfaces/IRoom';
import { roomModel } from '../../models/room.schema';

class RoomService { 
    async addRoom(roomId: string, userId: string) {
        try {
            // todo : add room to mongodb
            const data : IRoom = {
                roomId,
                users: [],
                streamer: userId,
            }
            await roomModel.create(data);
            console.log(`room ${roomId} added`);
        } catch (error) {
            console.error(error);
            return error;
        }
    }

    async addUserToRoom(roomId: string, userId: string) {
        await roomModel.updateOne({roomId}, {$push: {users: userId}});
    }

    async getRoomByRoomId(roomId: string) {
        return await roomModel.findOne({roomId});
    }

    async getRoomByStreamerId(streamerId: string) {
        return await roomModel.findOne({streamer: streamerId});
    }

    async deleteRoom(roomId : string) {
        return await roomModel.deleteOne({roomId});
    }

    async deleteRoomByStreamer(streamerId: string) {
        return await roomModel.deleteOne({streamer: streamerId});
    }
}

export const roomService : RoomService = new RoomService();