import '../chat.css';
import '../forms.css';
import ChatControlsComponent from "./ChatControls";
import {authProvider} from "../auth";
import {useContext, useEffect, useState} from "react";
import {socketSetup} from '../socketProvider';
import {io} from "socket.io-client";

import { SocketContext } from "../socketProvider";

function ChatRoomComponent ({chatId}) {
    const socket = useContext(SocketContext);
    const [chat, setChat] = useState(null);
    const [typing, setTyping] = useState(null);


    /*useEffect(() => {
        if(!authProvider.token || !!socket)
            return;

        const _socket = io(
            `http://${window.location.hostname}:1989`,
            {auth:{token: authProvider.token}}
        );

        setSocket(_socket);

        return () => {
            _socket.disconnect();
        }

    }, [authProvider.isAuthenticated]);*/

    useEffect(() => {
        if(!socket)
            return;

        function onUpdate(update) {
            setChat(update);
        }

        function onUpdateTyping(update) {
            setTyping(update);
        }

        function onUserJoined(username) {
            console.log('USER JOINED CHAT : ' + username);
        }

        socket.on('UPDATE_CHAT', onUpdate);
        socket.on('UPDATE_TYPING', onUpdateTyping);
        socket.on('USER_JOINED', onUserJoined)

        socket.emit('JOIN_CHAT', chatId);

        return () => {
            socket.off('UPDATE_CHAT', onUpdate);
            socket.off('UPDATE_TYPING', onUpdateTyping);
            socket.disconnect();
        }
    }, [socket]);


    async function handlePostMessage(messageInfo: string) {
        await handleTyping(false);
        try{
            socket.emit('POST_CHAT', {
                chat: chatId, user: authProvider.user, message: messageInfo
            });
        } catch(e) {
            console.error('ERROR', e);
        }
    }

    async function handleTyping(bool) {
        socket.emit('USER_TYPING', {user: authProvider.user.username, bool});
    }

    return chat && chat.chats && chat.chats.length && (
        <>
            <div id="chat-box">
                <div className="centerup">
                    <div className="inline-label">
                        <h2 style={{'textAlign': 'start'}}>{chat.chats[chat.chats.length - 1].user.username}</h2>

                        <p className="messege" >{chat.chats[chat.chats.length - 1].message}</p>
                    </div>

                    {typing && !!typing.length && typing.map((x) => (<h6>{x} is typing...</h6>))}

                    <ChatControlsComponent
                        onTyping={handleTyping}
                        onPost={handlePostMessage}
                        user={authProvider.user}
                    />
                </div>
            </div>
        </>
    )
}

export default ChatRoomComponent;