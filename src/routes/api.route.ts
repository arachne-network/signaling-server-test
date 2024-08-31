import { Router } from "express";
import { roomModel } from "../models/room.schema";

const route = Router();

export default (app: Router) => {
    app.use('/api', route);

    route.get('/list', async (req, res) => {
        console.log("GET /api/list");
        const rooms = await roomModel.find({});
        const roomIdList = rooms.map(room => room.roomId);

        res.json(roomIdList).status(200);
    });
}