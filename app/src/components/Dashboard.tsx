import '../forms.css';
import {Outlet, useNavigate, useNavigation} from 'react-router-dom';
import {useContext, useEffect, useState} from "react";
import ChatRoom from "./ChatRoom";
import SocketProvider, {SocketContext} from "../socketProvider";
import {authProvider} from "../auth";
import {useDispatch, useSelector} from "react-redux";
import {fetchChatsThunk, handleFetchChats} from "../state/chatsSlice";


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
