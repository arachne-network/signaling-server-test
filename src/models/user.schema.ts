import mongoose, {Schema} from 'mongoose';
import { IUser } from '../interfaces/IUser';

const userSchema : Schema = new Schema({
    socket: {type: [String] , required: true},
    networkStatus: {type: Map, of: String, required: false, default: new Map()},
});


// export default mongoose.model<IUser & mongoose.Document>('User', userSchema, 'users');

const userModel : mongoose.Model<IUser & mongoose.Document> = mongoose.model<IUser & mongoose.Document>('User', userSchema, 'users');
export  {userModel};