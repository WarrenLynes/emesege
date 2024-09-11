import React from 'react'
import ReactDOM from 'react-dom/client'
import {Provider} from 'react-redux';

import App from './_APP.tsx'
import './index.css'
import store from "./state/store";
import SocketProvider from "./socketProvider";
import Canvas from "./components/Canvas";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <Provider store={store}>
          <SocketProvider>
            <App />
          </SocketProvider>
      </Provider>
  </React.StrictMode>,
)
