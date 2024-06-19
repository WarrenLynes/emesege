import axios from "axios";

interface User {
    _id: null | string;
    username: null | string;
}

interface AuthProvider {
    isAuthenticated: boolean;
    user: null | User;
    token: null | string;
    signin(username: string): Promise<void>;
    signout(): Promise<void>;
}

export const authProvider: AuthProvider = {
    isAuthenticated: false,
    user: null,
    token: null,
    async signin(userInfo) {
        try{
            const user = await axios.post('/login', userInfo, {
                baseURL: "/api",
                headers: {
                    'Content-Type' : 'application/json'
                }
            });

            authProvider.isAuthenticated = true;
            authProvider.user = {
                username: user.data.user.username,
                _id: user.data.user._id
            };
            authProvider.token = user.data.token;
        } catch (e) {
            console.error(e)
        }
    },
    async signout() {
        await new Promise((r) => setTimeout(r, 500)); // fake delay
        authProvider.isAuthenticated = false;
        authProvider.user = null;
    },
};
