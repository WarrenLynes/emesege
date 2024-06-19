const mongoose = require('mongoose');



const schema = new mongoose.Schema({
  name: {
    type: mongoose.Schema.Types.String,
    required: true,
    unique: true,
  },
  chats: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message'
    }
  ]
});

schema.pre('findById', function(next) {
  this.populate('chats.user');
  next();
});

export const Chat = mongoose.model('Chat', schema);