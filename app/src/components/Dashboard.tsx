import '../forms.css';
import {useEffect, useState} from "react";
import ChatRoom from "./ChatRoom";
import SocketProvider from "../socketProvider";
import {authProvider} from "../auth";
import {fetchChats} from "../util";


function ChatsList({chats, onSelectChat}) {
    return (
        chats.map((x) => (
            <button key={x._id} onClick={() => onSelectChat(x._id)}> {x.name} </button>
        ))
    )
}


function DashboardComponent() {
    const [chats, setChats] = useState(null);
    const [chatId, setChatId] = useState(null);

    useEffect(() => {
        fetchChats()
            .then((chats) => {
                setChats(chats);
            })
    }, [])

    console.log(chats, chatId);

    return (
        <>
            <SocketProvider token={authProvider.token}>
                { chatId
                    ? <ChatRoom chatId={chatId}/>
                    : chats && chats.length
                        ? <ChatsList chats={chats} onSelectChat={(x) => setChatId(x)} />
                        : <h2>no chats</h2>
                }
            </SocketProvider>
        </>
    )
}

export default DashboardComponent;
