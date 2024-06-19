import './App.css'
import LoginComponent from "./components/Login";
import ChatRoomComponent from "./components/ChatRoom";
import {socketSetup} from './socketProvider';
import {useEffect, useState} from "react";
import axios from "axios";

type userLoginInfo = {username: string, password: string};

function App() {
    const [socket, setSocket] = useState(null);
    const [user, setUser] = useState(null);
    const [chatId/*, setChatId*/] = useState('1');

    async function handleAuthenticateUser(userInfo: userLoginInfo) {
        try{
            const data = await axios.post('/login', userInfo, {
                baseURL: "/api",
                headers: {
                    'Content-Type' : 'application/json'
                }
            });
            setUser({...data.data.user, token: data.data.token});
        } catch (e) {

        }

    }

    useEffect(() => {
        if(!user)
            return;

        socketSetup(user);

        socket.connect();

        function onConnect() {
            console.log('connected to socket');
            socket.emit('PING');
        }

        function onPing() {
            console.log('PING');
        }

        function onUpdate(update) {

        }

        socket.on('connection', onConnect)
        socket.on('ping', onPing);
        socket.on('update', onUpdate);

        return () => {
            socket.disconnect();
        }

    }, [user])

    return user && user.token
        ? (
            <>
                {/*<SocketProvider token={user.token}>
                </SocketProvider>*/}
                <ChatRoomComponent user={user} chatId={chatId} />

            </>
        ) : (
            <>
                <LoginComponent onLogin={handleAuthenticateUser} />
            </>
        )
}

export default App