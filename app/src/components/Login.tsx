import '../forms.css';
import {useActionData, useLocation, useNavigate} from "react-router-dom";
import {userAuthenticated} from "../state/authSlice";
import {useDispatch} from "react-redux";
import axios from "axios";

import {login} from '../util';
import {useState} from "react";

function LoginComponent({onLogin}) {
    const dispatch = useDispatch();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const from = params.get("from") || "/";
    const navigation = useNavigate();
    const actionData = useActionData() as { error: string } | undefined;

    // const submit = useSubmit();

    async function handleAuthenticateUser(formData) {
        try{

            formData.preventDefault();

            const form = new FormData(formData.currentTarget);

            let username = form.get("username") as string | null;
            let password = form.get("password") as string | null;

            const res = await login({username, password})

            dispatch(userAuthenticated(res));

            return navigation("/");
        } catch (e) {
            console.error(e)
        }

    }


    return (
        <>
            <div className="centerup">
                <form className="inline-form" onSubmit={handleAuthenticateUser}>
                    <div className="input-box">
                        <input
                            type="text"
                            id="username"
                            name="username"
                            className="input-input"
                            placeholder="username"
                            defaultValue="emily"
                        />
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="input-input"
                            placeholder="password"
                            defaultValue="12345"
                        />
                    </div>

                    <button type="submit">
                        Login
                    </button>

                    {actionData && actionData.error ? (
                        <p style={{ color: "red" }}>{actionData.error}</p>
                    ) : null}
                </form>
            </div>
        </>
    )
}

export default LoginComponent;
