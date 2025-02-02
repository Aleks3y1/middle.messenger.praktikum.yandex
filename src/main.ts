import {SignIn} from "./pages/SignInUp/signIn.ts";
import {SignUp} from "./pages/SignInUp/signUp.ts";
import {Home} from "./pages/Home/home.ts";
import {Profile} from "./pages/Profile/profile.ts";
import {Navigator} from "./pages/Navigator/navigator.ts";
import { registerHelpers } from './hooks/helpers.ts';
import './styles/main.scss';
import {Notfound} from "./pages/Notfound/notfound.ts";
import {ServerError} from "./pages/500/serverError.ts";

registerHelpers();

type Route = {
    path: string;
    render: () => void;
}

const routes: Route[] = [
    {path: '/', render: Navigator},
    {path: '/signin', render: SignIn},
    {path: '/signup', render: SignUp},
    {path: '/home', render: Home},
    {path: '/profile', render: Profile},
    {path: '/notfound', render: Notfound},
    {path: '/500', render: ServerError},
];

function handleRoutes(): void {
    const path = window.location.pathname;
    const route = routes.find((route) => route.path === path);

    if (route) {
        route.render();
    } else {
        window.history.pushState({}, '', '/');
        Navigator();
    }
}

function navigate(path: string): void {
    window.history.pushState({}, '', path);
    handleRoutes();
}

document.addEventListener('click', (e) => {
    const target = e.target as HTMLAnchorElement;

    if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('/')) {
        e.preventDefault();
        navigate(target.getAttribute('href') || '/');
    }
});

window.addEventListener('popstate', handleRoutes);

handleRoutes();
