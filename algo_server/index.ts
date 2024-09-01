import app from './app';
import dotenv from "dotenv";
import { Storage } from "./storage";

dotenv.config();

export const port = process.env.PORT || 3001;
export const store = new Storage();

app.listen(port, () => {
    console.log(`[algorithm-server]: Server running at https://localhost:${port}`);
});