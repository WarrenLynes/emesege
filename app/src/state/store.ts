import {configureStore, Tuple} from "@reduxjs/toolkit";
import authReducer from './authSlice';
import chatsReducer from './chatsSlice';
import {thunk} from 'redux-thunk'

const store = configureStore({
    reducer: {
        auth: authReducer,
        chats: chatsReducer
    },
    devTools: true,
    middleware: () => new Tuple(thunk)
})



// const store = createStore(rootReducer, composedEnhancer)
export default store

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch