import type { LoaderFunctionArgs } from "react-router-dom";
import {
    Form,
    Link,
    Outlet,
    RouterProvider,
    createBrowserRouter,
    redirect,
    useActionData,
    useFetcher,
    useLocation,
    useNavigation,
    useRouteLoaderData,
} from "react-router-dom";
import {useSelector} from "react-redux";
import store from './state/store';

function router(auth){
    return createBrowserRouter([
        {
            id: "root",
            path: "/",
            loader() {
                // Our root route always provides the user, if logged in
                return { user: auth.user.username };
            },
            Component: App,
            children: [
                {
                    index: true,
                    Component: PublicPage,
                },
                {
                    path: "login",
                    action: loginAction,
                    loader: loginLoader,
                    Component: LoginPage,
                },
                {
                    path: "protected",
                    loader: protectedLoader,
                    Component: ProtectedPage,
                },
            ],
        },
        {
            path: "/logout",
            async action() {
                // We signout in a "resource route" that we can hit from a fetcher.Form
                // dispatch(logoutThunk())
                return redirect("/");
            },
        },
    ]);
}

export default function App() {
    const auth = useSelector((x) => x.auth);
    return (
        <RouterProvider router={router(auth)} fallbackElement={<p>Initial Load...</p>} />
    );
}

export function Layout() {
    return (
        <div>
            <Outlet />
        </div>
    );
}

export function AuthStatus() {
    // Get our logged in user, if they exist, from the root route loader data
    let { user } = useRouteLoaderData("root") as { user: string | null };
    let fetcher = useFetcher();

    if (!user) {
        return <p>You are not logged in.</p>;
    }

    let isLoggingOut = fetcher.formData != null;

    return (
        <div>
            <p>Welcome {user}!</p>
            <fetcher.Form method="post" action="/logout">
                <button type="submit" disabled={isLoggingOut}>
                    {isLoggingOut ? "Signing out..." : "Sign out"}
                </button>
            </fetcher.Form>
        </div>
    );
}

export async function loginLoader() {
    const {auth} = store.getState();
    if (auth.isAuthenticated) {
        return redirect("/");
    }
    return null;
}

export function PublicPage() {
    return <h3>Public</h3>;
}

export function protectedLoader({ request }: LoaderFunctionArgs) {
    const state = store.getState();
    const auth = state.auth
    console.log(auth);
    if (!auth.authenticated) {
        let params = new URLSearchParams();
        params.set("from", new URL(request.url).pathname);
        return redirect("/login?" + params.toString());
    }
    return null;
}

export function ProtectedPage() {
    return <h3>Protected</h3>;
}
