import App from './app';
import http from "http";
import {_connect} from "./_socket";
import {Server} from "socket.io";
const app = App();
const io = new Server(app, {cors: {origin: "*", methods: ['GET', 'POST']}});

_connect(io);

export default app;