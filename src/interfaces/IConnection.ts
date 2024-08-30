export interface IConnection{
    from : string;
    to: string;
    status?: Map<string, string>;
}