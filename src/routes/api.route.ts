import { Router } from "express";
import { roomModel } from "../models/room.schema";
import { connectionService } from "../services/mongodb/connection.service";

const route = Router();

export default (app: Router) => {
    app.use('/api', route);

    route.get('/list', async (req, res) => {
        console.log("GET /api/list");
        const rooms = await roomModel.find({});
        const roomIdList = rooms.map(room => room.roomId);

        res.json(roomIdList).status(200);
    });

    route.post("/connectionStatus", async (req, res) => {
        console.log("POST /api/connectionStatus");

        const fromSocketId = req.body.fromSocketId;
        const toSocketId = req.body.toSocketId;
        const networkStatus = req.body.networkStatus;

        await connectionService.updateConnectionStatus(fromSocketId, toSocketId, networkStatus);
    });
}