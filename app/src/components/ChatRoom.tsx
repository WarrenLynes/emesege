import '../chat.css';
import '../forms.css';
import {useContext, useEffect, useState} from "react";
import {useSelector} from "react-redux";
import ChatControlsComponent from "./ChatControls";
import { SocketContext } from "../socketProvider";
import Canvas from "./Canvas";



function ChatRoomComponent ({chatId, user}) {
    const socket = useContext(SocketContext);
    //fetch from store
    const chat = useSelector((st) => st.chats.entity);
    // const typing = useSelector(st => st.chats.typing);
    const [renderStatus, setRenderStatus] = useState('html');

    useEffect(() => {
        if(!chatId || !socket)
            return;

        socket.emit('JOIN_CHAT', chatId);

    }, [ chatId ]);

    async function handlePostMessage(messageInfo: string) {
        await handleTyping(false);
        try{
            socket.emit('POST_CHAT', {
                chat: chatId, user: user, message: messageInfo
            });
        } catch(e) {
            console.error('ERROR', e);
        }
    }

    async function handleTyping(bool) {
        //Move to thunk
        socket.emit('USER_TYPING', {chatId, user: user.username, bool});
    }

    return (
        <>
            <Canvas
                id="chatCanvas"
                chat={chat ? chat : null}
                status={{drawChats: renderStatus === 'canvas'}}
            />

            {chat && chat.chats && chat.chats.length && renderStatus === 'html' && <div id="chat-box">
              <>
                <div className="centerup">
                    <div className="inline-label">
                        <h2 style={{'textAlign': 'start'}}>{chat.chats[chat.chats.length - 1].user.username}</h2>

                        <p className="messege">{chat.chats[chat.chats.length - 1].message}</p>
                    </div>

                    {chat.typing && !!chat.typing.length && chat.typing.map((x) => (<h6>{x} is typing...</h6>))}
                </div>
                <ChatControlsComponent
                  onTyping={handleTyping}
                  onPost={handlePostMessage}
                  user={user}
                />
              </>
            </div>}
        </>
    )
}

export default ChatRoomComponent;