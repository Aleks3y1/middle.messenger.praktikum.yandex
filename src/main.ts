import {SignIn} from "./pages/SignInUp/signIn";
import {SignUp} from "./pages/SignInUp/signUp";
import {Home} from "./pages/Home/home";
import {Profile} from "./pages/Profile/profile";
import {Navigator} from "./pages/Navigator/navigator";
import {Notfound} from "./pages/Notfound/notfound";
import {ServerError} from "./pages/500/serverError";
import {registerHelpers} from "./hooks/helpers";
import "./styles/main.scss";

registerHelpers();

if (!globalThis.crypto?.getRandomValues) {
    import("crypto").then((crypto) => {
        globalThis.crypto = crypto.webcrypto as Crypto;
    });
}

type Route = {
    path: string;
    render: () => HTMLElement;
};

const routes: Route[] = [
    {path: "/", render: () => new Navigator().getContent()},
    {path: "/signin", render: () => new SignIn().getContent()},
    {path: "/signup", render: () => new SignUp().getContent()},
    {path: "/home", render: () => new Home().getContent()},
    {path: "/profile", render: () => new Profile().getContent()},
    {path: "/notfound", render: () => new Notfound().getContent()},
    {path: "/500", render: () => new ServerError().getContent()}
];

function handleRoutes(): void {
    const path = window.location.pathname;
    const route = routes.find((route) => route.path === path);

    const app = document.querySelector("#app");
    if (!app) return;

    if (route) {
        const page = route.render();
        if (page instanceof Node) {
            app.replaceChildren(page);
        } else {
            console.error("Ошибка: render", page);
        }
    } else {
        navigate("/notfound");
    }
}

function navigate(path: string): void {
    if (routes.some((route) => route.path === path)) {
        window.history.pushState({}, "", path);
    } else {
        window.history.pushState({}, "", "/notfound");
    }
    handleRoutes();
}

document.addEventListener("click", (e) => {
    const target = e.target as HTMLAnchorElement;
    if (target.tagName === "A" && target.getAttribute("href")?.startsWith("/")) {
        e.preventDefault();
        navigate(target.getAttribute("href") || "/");
    }
});

window.addEventListener("popstate", handleRoutes);

document.addEventListener("DOMContentLoaded", handleRoutes);
