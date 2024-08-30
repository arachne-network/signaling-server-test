import express, {Express} from "express";
import { setupServer } from "./setupServer";
import dotenv from "dotenv";

dotenv.config();

async function startServer(){
    try{
        //load configs
        if(process.env.NODE_ENV !== "production"){}

        const app  : Express = express();
        await setupServer(app);
        // server.start();
    } catch (e) {
        console.error(e);
    }
}

startServer();