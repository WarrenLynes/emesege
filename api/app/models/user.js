import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  password: { type: String },
  username: {type: String, unique: true}
});

const User = mongoose.model('User', schema);

export default User;
