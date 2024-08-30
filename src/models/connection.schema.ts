import mongoose, {Schema} from 'mongoose';
import { IConnection } from '../interfaces/IConnection';


const connectionSchem : Schema = new Schema({
    from : {type: String, required: true, index: true},
    to: {type: String, required: true},
    status: {type: Map, of: String, required: false}
});

const connectionModel : mongoose.Model<IConnection & mongoose.Document> = mongoose.model<IConnection & mongoose.Document>('Connection', connectionSchem, 'connections');
export {connectionModel};