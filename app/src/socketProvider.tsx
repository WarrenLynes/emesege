import { createContext, useEffect, useState } from 'react';
import { io } from "socket.io-client";
import {authProvider} from "./auth";
import {userJoined, userAuthenticated} from './state/authSlice';
import {updateChat, updateTyping} from './state/chatsSlice';
import {useDispatch, useSelector} from "react-redux";

export const SocketContext = createContext(null);

export function socketSetup(token) {

  if (!token)
    return;

  return io(
    `http://${window.location.hostname}:1989`,
    {auth:{token: token}}
  );
}

export default function SocketProvider({ children }) {
  const dispatch = useDispatch();
  const [socket, setSocket] = useState(null);
  const auth = useSelector((x) => x.auth);
  const token = auth.token;

  useEffect(() => {
    if(!token)
      return;

    const _socket = io(
      `http://${window.location.hostname}:1989`,
      {auth:{token: token}}
    );
    function onConnect(x) {
      _socket.emit('PING');
      setSocket(_socket);
    }

    function onPing() {
      console.log('PING');
    }

    _socket.on('connect', onConnect);
    _socket.on('PING', onPing);
    _socket.on('UPDATE_CHAT', (x) => dispatch(updateChat(x)));
    _socket.on('UPDATE_TYPING', ({chatId, typing}) => dispatch(updateTyping({typing, chatId})));
    _socket.on('USER_JOINED', (x) => dispatch(userJoined(x)));

    return () => {
      _socket.off('connect', onConnect);
      _socket.off('ping', onPing);
      _socket.off('UPDATE_CHAT');
      _socket.off('UPDATE_TYPING');
      _socket.off('USER_JOINED');

      _socket.close();
      _socket.disconnect();
    }

  }, [token]);

  return <SocketContext.Provider value={socket} >
    {children}
  </SocketContext.Provider>
}
