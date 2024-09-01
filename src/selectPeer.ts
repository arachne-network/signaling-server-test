import { userCache } from "./services/redis/user.cache";

const url = process.env.ALGORITHM_URL || "http://localhost:3001";

export interface Connection {
    parent_id: string | null,
    child_id: string
}

export const selectPeer = async (roomId : string , newSocketId: string) : Promise<string>=> {
    const streamer = await userCache.getStreamer(roomId);
    // const data = {
    //     "roomId" : roomId
    // };

    // if(streamer){
    //     return streamer;
    // } else {

    // }

    try{
        const response = await fetch(`${url}/peer/${newSocketId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ "roomId" : roomId }),
        });

        if(response.status === 200){
            const result = await response.json();
            console.log("result " , result);
            return result ? result.parent_id :  streamer;
        } else{
            throw Error("selet peer error");
        }
    } catch (e) {
        console.log("error ", e);
        return "";
    }
}
