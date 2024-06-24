import axios from "axios";

export async function fetchChats(token) {
    try{
        const {data} = await axios.get('/chats', {
            baseURL: "/api",
            headers: {
                'Content-Type' : 'application/json',
                'Authentication': token
            }
        });
        return data;
    } catch (e) {

    }
}


export async function login(userInfo: {username: string, password:string}) {
    try{
        const user = await axios.post('/login', userInfo, {
            baseURL: "/api",
            headers: {
                'Content-Type' : 'application/json'
            }
        });

        return {
            user: {
                username: user.data.user.username,
                _id: user.data.user._id
            },
            token: user.data.token
        }
    } catch (e) {
        console.error(e)
    }
}