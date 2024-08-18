export enum ConnectionStatus {
    PENDING = "pending",
    CONNECTED = "connected",
    DISCONNECTED = "disconnected",
  }
  

export interface Connection{
    sender: string;
    receiver: string;
    status: ConnectionStatus;
    timestamp?: number;
    sdp?: RTCSessionDescription;
}