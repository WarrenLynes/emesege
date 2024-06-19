import { createContext, useEffect, useState } from 'react';
import { io } from "socket.io-client";
import {authProvider} from "./auth";

export const SocketContext = createContext(null);

export function socketSetup(token) {

  if (!token)
    return;

  return io(
    `http://${window.location.hostname}:1989`,
    {auth:{token: token}}
  );
}

export default function SocketProvider({ token, children }) {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    console.log(authProvider, token);
    if(!token || !!socket)
      return;

    const _socket = io(
      `http://${window.location.hostname}:1989`,
      {auth:{token: authProvider.token}}
    );

    setSocket(_socket);

    return () => {
      _socket.disconnect();
    }

  }, [token]);

  useEffect(() => {
    if(!socket)
      return;

    function onConnect() {
      socket.emit('PING');
    }

    function onPing() {
      console.log('PING');
    }

    socket.on('connection', onConnect);
    socket.on('PING', onPing);

    return () => {
      socket.off('connection', onConnect);
      socket.off('ping', onPing);

      socket.disconnect();
    }
  }, [socket]);


  console.log(socket, token)
  return <SocketContext.Provider value={socket} >
    {children}
  </SocketContext.Provider>
}
