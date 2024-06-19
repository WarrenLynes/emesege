import './App.css'
import LoginComponent from "./components/Login";
import ChatRoomComponent from "./components/ChatRoom";
import {socketSetup} from './socketProvider';
import {useEffect, useState} from "react";
import axios from "axios";
import SocketProvider from './socketProvider';
import {createBrowserRouter, redirect, RouterProvider, useNavigation} from "react-router-dom";
import {authProvider} from "./auth";
import Login from "./components/Login";
import {Layout, loginAction, loginLoader, protectedLoader, ProtectedPage, PublicPage} from "./AuthRouter";
import DashboardComponent from "./components/Dashboard";

type userLoginInfo = {username: string};


const router = createBrowserRouter([
    {
        id: "root",
        path: "/",
        loader() {
            // Our root route always provides the user, if logged in
            return { user: authProvider.username };
        },
        Component: Layout,
        children: [
            {
                path: "login",
                loader: loginLoader,
                Component: Login,
            },
            {
                index: true,
                loader: protectedLoader,
                Component: DashboardComponent,
            },
        ],
    },
    {
        path: "/logout",
        async action() {
            // We signout in a "resource route" that we can hit from a fetcher.Form
            await authProvider.signout();
            return redirect("/");
        },
    },
]);

function App() {

    useEffect(() => {
        console.log(authProvider.token);
    }, [authProvider.token]);

    return <RouterProvider router={router} />


    /*return user && user.token && socket
        ? chat && chatId
            ? (
                <>
                    {
                        chat && chat.chats
                            ? <ChatRoomComponent
                                user={user}
                                chatId={chatId}
                                chat={chat.chats}
                                socket={socket}
                                typing={typing}/>
                            : <h1>loading</h1>
                    }
                </>
            )
            : (
                <>
                    <button onClick={() => {}}> 66671301d6698b9d4fe1850a</button>
                </>
            )
        : (
            <>
                <LoginComponent onLogin={handleAuthenticateUser} />
            </>
        )*/
}

export default App