import '../forms.css';
import {redirect, useActionData, useLocation, useNavigate, useNavigation, useSubmit} from "react-router-dom";
import axios from "axios";
import {authProvider} from "../auth";


function LoginComponent({onLogin}) {
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

            await authProvider.signin({username, password})

            console.log(authProvider);

            return navigation("/");

            // setUser({...user.data.user, token: user.data.token});
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
                        />
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="input-input"
                            placeholder="password"
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
