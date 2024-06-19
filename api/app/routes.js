import * as chatController from "./controllers/chat";
import * as userController from "./controllers/user";
import * as authController from "./controllers/auth";
import {authenticate} from "./middleware/authenticate";
import jwt from "jsonwebtoken";
import User from "./models/user";
import bcrypt from "bcrypt";

export default function Router(router) {

  router.get('/users', authenticate, handleFetchUsers);
  router.get('/users/:id', authenticate, handleFetchUserById);
  router.get('/chats', handleFetchChats);
  router.get('/chats/:id', handleFetchChat);
  router.post('/chats/:id/messages', handlePostMessage);
  router.post('/chats', handlePostChat);


  router.post('/register', register);
  router.post('/login', login);
  router.get('/logout', logout);

  const updatedToken = (_id, username) => jwt.sign({ _id, username }, process.env.JWT_SECRET, { expiresIn: "2h" });

  async function register(req, res, next) {
    try {
      const { password, username } = req.body;

      if (!(username && password))
        return res.status(400).send('USERNAME & PASSWORD REQUIRED');

      const existingUser = await User.findOne({ username: username.toLowerCase() });

      if (existingUser)
        return res.status(409).send('USER ALREADY EXISTS.');

      const encryptedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        username: username.toLowerCase(),
        password: encryptedPassword
      });

      const token = jwt.sign(
        { _id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "2h" }
      );

      res.status(201).json({ user, token });
    } catch (error) {
      next(error);
    }
  }

  async function login(req, res, next) {
    const { username, password } = req.body;

    if (!(username && password))
      return res.status(400).send('USERNAME & PASSWORD REQUIRED');

    try {
      const user = await User.findOne({ username: username.toLowerCase() });

      if (user && (await bcrypt.compare(password, user.password))) {
        const token = updatedToken(user._id, user.username);

        return res.status(201).json({ user, token });
      }
      return res.status(400).send("Invalid Credentials");
    } catch (error) {
      next(error);
    }
  }

  async function logout(req, res, next) {
    const token = req.headers['authentication'];
    if (token) {
      const user = await authenticate(token);
      if (user && user._id) {
        user.token = null;
        await user.save();
        return res.status(201).send(true);
      }
    }
  }


  async function handleFetchUsers(req, res, next) {
    try {
      const users = await userController.fetchUsers();
      return res.status(200).json(users);
    } catch (error) {
      throw new Error(error);
    }
  }

  async function handleFetchUserById(req, res, next) {
    try {
      const { id } = req.params;
      const user = await userController.findById(id);
      return res.status(200).json(user);
    } catch (error) {
      throw new Error(error);
    }
  }

  async function handlePostMessage(req, res, next) {
    try {
      const {message} = req.body;
      const newMessage = await chatController.postMessage(message);

      return res.status(201).json(newMessage);
    } catch(e) {
      return res.sendStatus(500);
    }
  }

  async function handleFetchChats(req, res, next) {
    try {
      const chats = await chatController.fetchChats();

      return res.status(200).json(chats);
    } catch(e) {
      throw e;
    }
  }

  async function handlePostChat(req, res, next) {
    try {
      const {name} = req.body;
      const chat = await chatController.postChat(name);

      return res.status(201).json(chat);
    } catch(e) {
      throw e;
    }
  }

  async function handleFetchChat(req, res, next) {
    try {

      const {id} = req.params;
      const chat = await chatController.fetchChatById(id);

      return res.status(200).json(chat);
    } catch(e) {
      throw e;
    }
  }

  return router;
};