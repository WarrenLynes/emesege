import { combineReducers } from 'redux'

import authReducer from './authSlice'
import chatsReducer from './chatsSlice'

const rootReducer = combineReducers({
    auth: authReducer,
    chats: chatsReducer,
})

export default rootReducer