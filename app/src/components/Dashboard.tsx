import '../forms.css';
import {useState} from "react";
import ChatRoom from "./ChatRoom";
import SocketProvider from "../socketProvider";
import {authProvider} from "../auth";


function DashboardComponent() {
    const [chatId, setChatId] = useState('66671301d6698b9d4fe1850a');

    return (
        <>
            <SocketProvider token={authProvider.token}>
                <ChatRoom chatId={chatId}/>
            </SocketProvider>
        </>
    )
}

export default DashboardComponent;
