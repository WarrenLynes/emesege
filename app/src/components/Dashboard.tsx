import '../forms.css';
import { useNavigate, } from 'react-router-dom';
import {useContext, useEffect, useState} from "react";
import ChatRoom from "./ChatRoom";
import {SocketContext} from "../socketProvider";
import {useDispatch, useSelector} from "react-redux";
import {fetchChatsThunk, selectChat as selectChatAction} from "../state/chatsSlice";


function ChatsList({chats, onSelectChat}) {
    return (
        Object.keys(chats)
            .map((x) => (
                <button key={chats[x]._id} onClick={() => onSelectChat(chats[x]._id)}> {chats[x].name} </button>
            ))
    )
}


function DashboardComponent() {
    const navigation = useNavigate();
    const dispatch = useDispatch();
    const socket = useContext(SocketContext);
    const chats = useSelector((state) => state.chats);
    const auth = useSelector((state) => state.auth);
    const [chatId, setChatId] = useState(null);

    useEffect(() => {
        dispatch(fetchChatsThunk());
    }, [])

    function selectChat(x) {
        // socket.emit('JOIN_CHAT', x);
        dispatch(selectChatAction(x));
        setChatId(x)
    }

    console.log(chats)

    const entities = chats.entities;
    return (
        <>
            { chatId
                ? <ChatRoom chatId={chatId} user={auth.user} />
                : entities && Object.keys(entities).length
                    ? <ChatsList chats={entities} onSelectChat={(x) => selectChat(x)} />
                    : <h2>no chats</h2>
            }
        </>
    )
}

export default DashboardComponent;
