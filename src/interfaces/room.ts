import { User } from './user';
export interface Room {
    roomId: string;
    streamer: User;
    viewers: User[];
  }