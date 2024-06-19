import {readFile, writeFile} from "../util";
import User from "../models/user";
import {Chat} from "../models/chat";
import {Message} from "../models/message";


export async function postMessage(message) {
  try{
    const chat = await Chat.findById(message.chat);
    const newMessage = new Message(message);

    await newMessage.save();

    chat.chats.push(newMessage);

    await chat.save();

    return newMessage;
  } catch(e) {
    console.error(e);
    throw e;
  }
}

export async function fetchChats() {
  try {
    const chats = await Chat.find().populate('chats');

    return chats;
  } catch(e) {
    throw e;
  }
}

export async function postChat(name) {
  try {
    const chat = await Chat.create({name});

    return chat;
  } catch(e) {
    throw e;
  }
}

export async function fetchChatById(id) {
  try {
    const chat = await Chat.findById(id)
      .populate('chats')
      .exec();

    return chat;
  } catch(e) {
    throw e;
  }
}
