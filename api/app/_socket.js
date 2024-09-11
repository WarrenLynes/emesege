import jwt from "jsonwebtoken";
import generateUniqueId from "generate-unique-id";
import * as authService from './services/auth.js';
import User from './models/user';
import {Chat as ChatModel} from './models/chat';
import {postMessage} from "./controllers/chat";


class ChatClass {

  constructor(doc) {
    this.doc = doc;
    this.users = new Set();
    this.currentChat = new Set();

  }

  addUser = (user) => {
    this.users.add(user)

    console.log('USER ADDED: ', user._id)
  }

  inputMessage = (userId, message) => {
    if(!message.id) {
      this.currentChat.add({
        ...message,
        _id: generateUniqueId({
          length: 32,
          useLetters: false,
        })
      });
    }

    console.log(`NEW MESSAGE: ${userId} : ${message.message}`)
  }
}



export async function _connect(io) {
  const typing = {};
  const sockets = new Set();
  const users = new Set();
  const chats = new Set();

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
        id: 'USER_TYPING', cb: ({chatId, user, bool}) => {
          return handleTyping(chatId, user, bool);
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

      console.log(`JOIN CHAT : ${chatId}`);

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

    async function getChat(chatId) {
      const chat = await ChatModel.findById(chatId)
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
      return chat;
    }

    async function updateChat(chatId) {
      const chat = await getChat(chatId);

      console.log('UPDATE_CHAT ' + chat._id)

      io.sockets.in(chatId).emit('UPDATE_CHAT', chat);
    }

    async function handleTyping(chatId, user, bool) {
      const chat = await ChatModel.findById(chatId)
        .populate('chats')
        .exec();
      let _typing = typing[chatId];



      if(!_typing) {
        _typing = new Set();
        typing[chatId] = _typing;
      }

      if(!bool){
        _typing.delete(user);
      } else if(!_typing.has(user)) {
        _typing.add(user);
      }

      console.log('USER TYPING : ', [..._typing]);

      io.sockets.in(chatId).emit('UPDATE_TYPING', {chatId, typing: [..._typing]});
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

