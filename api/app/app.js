import ChatController from "./controllers/chat";

require('dotenv').config();
import express from 'express';
import cors from 'cors';
import router from './routes';
import morgan from 'morgan';
import path from "path";
import AuthController from "./controllers/auth";
import UserController from "./controllers/user";

import DB from './config/database';

export default function App(pid) {
  const app = express();
  const apiRouter = new express.Router();

  DB()

  app.set('port', process.env.SERVER_PORT);
  app.set('pid', pid);

  app.use(morgan(
    process.env.NODE_ENV === 'development'
      ? 'dev'
      : 'tiny'
  ));
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb' }));
  app.use(cors({ origin: '*' }));

  app.use('/api', apiRouter);

  router(apiRouter);

  app.use('/', (req, res, next) => {
    console.log(req.path);
    next();
  })

  return app.listen(app.get('port'), function () {
    let pid = app.get('pid');
    console.log('APP LISTENING ON PORT: ', app.get('port'));
    console.log(
      pid ? 'PID: ' + pid + ' ' : '',
    );
  });

  return app;
};
