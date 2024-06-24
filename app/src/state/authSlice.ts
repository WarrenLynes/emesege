import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {fetchChats, login} from "../util";

interface initialState {
    authenticated: boolean;
    user: {
        _id: null | string;
        username: null | string;
    };
    token: null | string;
    status: null | string;
}

const initialState : initialState = {
    authenticated: false,
    user: {
        _id: null,
        username: null
    },
    token: null,
    status: null
}


export const loginThunk = createAsyncThunk('auth/login', async userInfo => {
    const response = await login(userInfo);

    return response;
})

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        userJoined(state, action) {
            console.log(action);
        },
        userAuthenticated(state, action) {
            console.log(action);
            const {token, user} = action.payload;
            state.authenticated = true;
            state.user = user;
            state.token = token;
        }
    },
    extraReducers: builder => {
        builder
            .addCase(loginThunk.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(loginThunk.fulfilled, (state, action) => {
                const {token, user} = action.payload;
                state.authenticated = true;
                state.user = user;
                state.token = token;
                state.status = 'done';
            })
    }
})

export const { userAuthenticated, userJoined } = authSlice.actions;
export default authSlice.reducer;