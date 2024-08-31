import express, { Express } from "express";
import peerSelectionRouter from "./peerSelection/PeerSelectionRouter";
const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/peer', peerSelectionRouter);

export default app;