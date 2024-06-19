import bcrypt from "bcrypt";
import User from '../models/user.js';
import jwt from "jsonwebtoken";
import {authenticate} from "../services/auth";

const updatedToken = (_id, username) => jwt.sign({ _id, username }, process.env.JWT_SECRET, { expiresIn: "2h" });

export async function register({username, password}) {
  if (!(username && password))
    throw Error('BAD LOGIN')

  const existingUser = await User.findOne({ username: username.toLowerCase() });

  if (existingUser)
    return new Error('BAD LOGIN');

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

  return {user, token};
}

export async function login({username, password}) {
  if (!(username && password))
    return new Error('BAD LOGIN');

  const user = await User.findOne({ username: username.toLowerCase() });

  if (user && (await bcrypt.compare(password, user.password))) {
    const token = updatedToken(user._id, user.username);

    return {user, token};
  }
  return new Error('BAD LOGIN');
}

export async function logout(token) {
  if (token) {
    const user = await authenticate(token);
    if (user && user._id) {
      user.token = null;
      await user.save();
      return true;
    }
  }
  return new Error('BAD LOGIN');
}