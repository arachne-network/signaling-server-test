import http, { createServer } from 'http'
import cors from 'cors'
import express, { Express } from 'express'
import { Server } from "socket.io";
import { createClient } from 'redis'
import { createAdapter } from "@socket.io/redis-adapter";
import bodyParser from 'body-parser';
import path from 'path';
import mongoose from 'mongoose';
import {Db} from 'mongodb';
import { SignalingHandler } from './services/signaling/signaling.socket';
import { EventHandler, IEventHandler } from './services/signaling/eventHandler';
import { selectPeer } from './selectPeer';
import apiRoute from './routes/api.route';

// todo : move staticDir to config file
const staticDir = path.join(__dirname, "../static");

export async function setupServer(app: Express){
    await connectMongoDB();

    addExpressMiddleware(app);
    addExpressRoutes(app);
    const server : http.Server = createServer(app);
    const io = await startSocketIO(server);
    setSignalingHandler(io);
    server.listen(process.env.PORT, () => {
        console.log(`Server listening on port ${process.env.PORT}`);
        console.log("http://localhost:" + process.env.PORT);
    });
}

function addExpressMiddleware(app: Express){
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(express.static(staticDir));
    app.use(cors({
        // todo : change for production env
        origin: 'http://localhost:' + process.env.PORT,
        credentials: true,
    }))
}

function addExpressRoutes(app: Express){
    apiRoute(app);
}

async function startSocketIO(app:http.Server) { 
    const io : Server = new Server(app);
    const redisUrl : string = process.env.REDIS_URL || "redis://localhost:6379";

    // client for socketio adapterf
    const pubClient = createClient({ url: redisUrl });
    const subClient = pubClient.duplicate();
    await Promise.all([
        pubClient.connect(),
        subClient.connect()
        ]); 
    io.adapter(createAdapter(pubClient, subClient));
    return io
}

async function connectMongoDB() : Promise<Db>{
    const url : string = process.env.MONGO_URL || "mongodb://localhost:27017";
    const connection = await mongoose.connect(url, {
        // useUnifiedTopology: true,
        // useFindAndModify: false,
        // useCreateIndex: true
    });

    if (!connection.connection.db) {
        throw new Error("Failed to connect to MongoDB");
    }

    // check if connection is successful
    console.log("Connected to MongoDB", connection.connection.db.databaseName);
    return connection.connection.db;
}

async function setSignalingHandler(io: Server){
    const eventHandler : IEventHandler = new EventHandler()
    const signalingHandler : SignalingHandler = new SignalingHandler(io, selectPeer, eventHandler);
    signalingHandler.listen();
}