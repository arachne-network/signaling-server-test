import express, { Express } from "express";
import morgan from 'morgan';
import peerSelectionRouter from "./peerSelection/PeerSelectionRouter";

const app: Express = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(morgan('combined'));

app.use('/peer', peerSelectionRouter);

export default app;