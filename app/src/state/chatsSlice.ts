import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {fetchChats} from "../util";

interface initialState {
    entities: object;
    status: null | string;
    typing: null | object;
}

const initialState : initialState = {
    entities: {},
    status: null,
    typing: null
}


export const fetchChatsThunk = createAsyncThunk('chats/fetch', async () => {
    const response = await fetchChats();
    return response;
})

export function handleFetchChats() {
    return (dispatch/*, getState*/) => {
        dispatch(fetchChatsThunk())
    }
}

const chatsSlice = createSlice({
    name: 'chats',
    initialState,
    reducers: {
        updateChat(state, action) {
            if(!state.entities[action.payload._id]){
                throw Error('NO CHAT')
            }

            state.entities[action.payload._id] = action.payload
        },
        updateTyping(state, action) {
            // state.entities[action.payload.chatId].typing = action.payload.typing;
            state.entities = {
                ...state.entities,
                [action.payload.chatId]: {
                    ...state.entities[action.payload.chatId],
                    typing: action.payload.typing
                }
            }
        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchChatsThunk.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(fetchChatsThunk.fulfilled, (state, action) => {
                const chats = action.payload;
                chats.forEach((chat) => {
                    state.entities[chat._id] = chat;
                })
                state.status = 'done';
            })
    }
})

export const {updateChat, updateTyping} = chatsSlice.actions;
export default chatsSlice.reducer;