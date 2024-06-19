require('dotenv').config();

import mongoose from 'mongoose';
const {MONGO_URI} = process.env;

export default function DB() {
  return mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => {
    console.log('DB CONNECTED');
  }).catch((error) => {
    console.warn('DB NOT CONNECTED');
    console.error(error);

    process.exit(1);
  });
}