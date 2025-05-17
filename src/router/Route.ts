import Block from "../base/Block";
import {isEqual} from "lodash-es";
import {render} from "../hooks/render"

export class Route {
    private _pathname: string;
    private _blockClass: typeof Block;
    private _block: Block | null = null;
    private _props: { rootQuery: string };

    constructor(pathname: string, view: typeof Block, props: { rootQuery: string }) {
        this._pathname = pathname;
        this._blockClass = view;
        this._block = null;
        this._props = props;
    }

    navigate(pathname: string): void {
        if (this.match(pathname)) {
            this._pathname = pathname;
            this.render();
        }
    }

    leave(): void {
        if (this._block) {
            const content = this._block.getContent();
            content.remove();
        }
    }

    match(pathname: string): boolean {
        return isEqual(pathname, this._pathname);
    }

    render(): void {
        if (!this._block) {
            this._block = new this._blockClass();
        }
        render(this._props.rootQuery, this._block);
    }
}
