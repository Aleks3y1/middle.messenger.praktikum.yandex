import Block from "../base/Block";
import {Route} from "./Route";

export class Router {
    private static __instance ?: Router;
    private routes: Route[] = [];
    private history: History = window.history;
    private _currentRoute: Route | null = null;
    private _rootQuery: string = "";

    constructor(rootQuery: string) {
        if (Router.__instance) {
            return Router.__instance;
        }

        this.routes = [];
        this.history = window.history;
        this._currentRoute = null;
        this._rootQuery = rootQuery;
        Router.__instance = this;
    }

    use(pathname: string, block: typeof Block) {
        const route = new Route(pathname, block, {rootQuery: this._rootQuery});
        this.routes.push(route);
        return this;
    }

    start() {
        window.addEventListener('popstate', () => {
            this._onRoute(window.location.pathname);
        });
        this._onRoute(window.location.pathname);
    }

    _onRoute(pathname: string) {
        const route = this.getRoute(pathname);

        if (!route) {
            this.go('/notfound')
            return;
        }

        if (this._currentRoute) {
            this._currentRoute.leave();
        }

        this._currentRoute = route;
        route.render();
    }

    go(pathname: string) {
        this.history.pushState({}, "", pathname);
        this._onRoute(pathname);
    }

    back() {
        this.history.back();
        // go(route);
    }

    forward() {
        this.history.forward();
        // go(route);
    }

    getRoute(pathname: string) {
        return this.routes.find(route => route.match(pathname));
    }
}
