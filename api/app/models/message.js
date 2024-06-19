import mongoose from "mongoose";

const schema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  chat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat',
    required: true,
  },

  message: {
    type: mongoose.Schema.Types.String,
    required: true
  }
}, { timestamps: true });
export const Message = mongoose.model('Message', schema);