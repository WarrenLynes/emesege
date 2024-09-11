import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {fetchChats} from "../util";

interface initialState {
    entities: object;
    entity: object | null;
    status: null | string;
    typing: null | object;
}

const initialState : initialState = {
    entities: {},
    entity: null,
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
        selectChat(state, action) {
            state.entity = state.entities[action.payload];
        },
        updateChat(state, action) {
            if(!state.entities[action.payload._id]){
                throw Error('NO CHAT')
            }

            state.entities[action.payload._id] = action.payload
            state.entity = action.payload
        },
        updateTyping(state, action) {
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

export const {selectChat, updateChat, updateTyping} = chatsSlice.actions;
export default chatsSlice.reducer;