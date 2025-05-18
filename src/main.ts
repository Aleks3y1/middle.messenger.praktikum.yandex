import {registerHelpers} from "./hooks/helpers";
import "./styles/main.scss";
import {Home} from "./pages/Home/home";
import {SignIn} from "./pages/SignInUp/signIn";
import {SignUp} from "./pages/SignInUp/signUp";
import {Notfound} from "./pages/Notfound/notfound";
import {ServerError} from "./pages/500/serverError";
import {Profile} from "./pages/Profile/profile";
import {router} from "./hooks/routerHook";
import Handlebars from "handlebars";

Handlebars.registerHelper("eq", (a, b) => a === b);
registerHelpers();

router
    .use('/messenger', Home)
    .use('/', SignIn)
    .use('/sign-up', SignUp)
    .use('/notfound', Notfound)
    .use('/500', ServerError)
    .use('/settings', Profile)
    .start();

document.addEventListener("click", (e) => {
    const target = e.target as HTMLAnchorElement;
    if (target.tagName === "A" && target.getAttribute("href")?.startsWith("/")) {
        e.preventDefault();
        router.go(target.getAttribute("href") || "/");
    }
});
