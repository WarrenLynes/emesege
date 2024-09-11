import './App.css'
import {useEffect} from "react";
import {createBrowserRouter, redirect, RouterProvider} from "react-router-dom";
import Login from "./components/Login";
import {Layout, loginLoader, protectedLoader, ProtectedPage, PublicPage} from "./AuthRouter";
import DashboardComponent from "./components/Dashboard";
import {useDispatch, useSelector} from "react-redux";
import ChatRoomComponent from "./components/ChatRoom";
import Chats from "./components/Chats";
import ChatRoom from "./components/ChatRoom";
import SocketProvider from "./socketProvider";
import Canvas from "./components/Canvas";

type userLoginInfo = {username: string};


const router = createBrowserRouter([
    {
        id: "root",
        path: "/"/*,
        loader({request}) {
            console.log(request);
            // Our root route always provides the user, if logged in
            return { user: auth.user.username };
        }*/,
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
                Component: DashboardComponent
            }/*,

                {
                    path: "chats",
                    loader: protectedLoader,
                    Component: Chats,
                    children: [
                        {
                            path: ':id',
                            loader: ({params}) => {
                                return {id: params.id}
                            },
                            Component: ChatRoomComponent
                        }
                    ]
                }*/
        ],
    },
    {
        path: "/logout",
        async action() {
            // dispatch(logoutThunk);
            return redirect("/");
        },
    },
]);

function App() {
    const chat = useSelector(state => state.chats.entity);
    return (
        <>
            <RouterProvider router={router} />
        </>
    )

}

export default App