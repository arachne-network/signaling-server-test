export interface Connection{
    sender: string;
    receiver: string;
    sdp?: RTCSessionDescription;
} 