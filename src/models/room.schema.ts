import mongoose, {Schema} from 'mongoose';
import { IRoom } from '../interfaces/IRoom';

// const roomSchema : Schema = new Schema({
//     roomId: {type: String, required: true, unique: true},
//     users: {type: [mongoose.Schema.Types.ObjectId], ref: 'User', required: true, default: []},
//     streamer : {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true},
// });

const roomSchema : Schema = new Schema({
    roomId: {type: String, required: true, unique: true},
    users : {type: [String], required: true, default: []},
    streamer : {type: String, required: true, unique: true},
});

// export default mongoose.model<IRoom & mongoose.Document>('Room', roomSchema, 'rooms');
const roomModel : mongoose.Model<IRoom & mongoose.Document> = mongoose.model<IRoom & mongoose.Document>('Room', roomSchema, 'rooms');
export  {roomModel};