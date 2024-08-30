import { IConnection } from "../../interfaces/IConnection";
import { connectionModel } from "../../models/connection.schema";

class ConnectionService{
    async addConnection(connection : IConnection){
        connectionModel.create(connection);
    }

    async getConnectionByfrom(userId: string){
        return connectionModel.findOne({userId});
    }

    async updateConnectionStatus(from: string, to: string, status: string){
        connectionModel.updateOne({from, to}, {$set: {status}});
    }

    async deleteConnection(from: string, to: string){
        connectionModel.deleteOne({from, to});
    }
}

export const connectionService : ConnectionService = new ConnectionService();