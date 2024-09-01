export interface IConnection{
    roomId: string;
    from : string;
    to: string;
    status?: Map<string, string>;
}