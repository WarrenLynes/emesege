import * as authService from './services/auth.js';
import User from './models/user';
import {Chat} from './models/chat';
import jwt from "jsonwebtoken";
import {postMessage} from "./controllers/chat";




export async function _connect(io) {
  const typing = new Set();
  const sockets = new Set();
  const users = new Set();

  const chats = new Set(await Chat.find());




  io.on('connection', async (socket, next) => {
    const token = socket.handshake.auth.token;
    // const io = io;

    if (!token) {
      return new Error('TOKEN REQUIRED');
    }

    const _tok = jwt.decode(token);
    const user = await User.findById(_tok._id);

    if(!user || !_tok) {
      return new Error('NO USER');
    }

    users[user._id] = Object.assign({}, user, { socket: socket.id });
    socket.use(async (_socket, next) => {
      await authenticateRequest(_socket, next)
      // next();
    });

    const listeners = [
      {
        id: 'disconnect', cb: () => {
          return disconnect();
        }
      },
      {
        id: 'PING', cb: (x) => {
          return ping(x);
        }
      },
      {
        id: 'LOGOUT', cb: (x) => {
          return logout();
        }
      },
      {
        id: 'POST_CHAT', cb: (post) => {
          return handlePostMessage(post);
        }
      },
      {
        id: 'JOIN_CHAT', cb: (chatId) => {
          return joinChat(chatId)
        }
      },
      {
        id: 'USER_TYPING', cb: ({user, bool}) => {
          return handleTyping(user, bool);
        }
      }
    ];

    listeners.forEach(({ id, cb }) => socket.on(id, cb));

    async function ping () {
      socket.emit('PING', socket.id);
    }

    async function disconnect() {
      users.delete(user._id);
      socket.disconnect();

      await Promise.all(
        [...sockets].map(async (socketId) => {
          socket.leave(socketId);
        })
      );

      listeners.forEach(({ id, cb }) => socket.off(id, cb));
    }

    async function joinChat(chatId) {
      //create / join socket
      socket.join(chatId);

      if(!sockets.has(chatId)) {
        //add socket to set
        sockets.add(chatId);
      }

      io.sockets.in(chatId).emit('USER_JOINED', socket.id);

      console.log(...sockets);

      return updateChat(chatId);
    }

    async function logout() {
      socket.disconnect();
      users.delete(user._id);
    }

    async function handlePostMessage(post) {

      try {
        console.log(post);
        const newMessage = await postMessage(post);

        return updateChat(post.chat);
      } catch(err) {
        console.error(err);
      }
    }

    async function updateChat(chatId) {
      const chat = await Chat.findById(chatId)
        .populate('chats')
        .exec();

      await Promise.all(
        [...chat.chats].map((x) =>
          User.findById(x.user)
            .then((xx) => {
              x.user = xx;
            })
        )
      );

      io.sockets.emit('UPDATE_CHAT', chat);
    }

    function handleTyping(user, bool) {

      if(!bool){
        typing.delete(user);
      } else if(!typing.has(user)) {
        typing.add(user);
      }

      console.log('USER TYPING : ', [...typing]);

      io.sockets.emit('UPDATE_TYPING', [...typing]);
    }

    async  function authenticateRequest(_socket, next) {
      const token = socket.handshake.auth.token;

      if (!token)
        return next(new Error('TOKEN REQUIRED'));

      authService.authenticate(token)
        .then((user) => {
          if (user._id)
            next();
        })
        .catch((err) => {
          console.error(err);
          return err;
        });

    }

  });
}

