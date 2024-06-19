import axios from "axios";
import {authProvider} from "./auth";

export async function fetchChats() {

    try{
        const {data} = await axios.get('/chats', {
            baseURL: "/api",
            headers: {
                'Content-Type' : 'application/json',
                'Authentication': authProvider.token
            }
        });
        console.log(data);
        return data;
    } catch (e) {

    }
}