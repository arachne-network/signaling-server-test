import app from './app';
import dotenv from "dotenv";
// import { Storage } from "./storage";

dotenv.config();

const port = process.env.PORT;
// const store = new Storage();

app.listen(port);