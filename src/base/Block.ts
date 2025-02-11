import Handlebars from "handlebars";
import EventBus from "./EventBus";

export default class Block {
    static EVENTS: { INIT: string, FLOW_RENDER: string } = {
        INIT: "init",
        FLOW_RENDER: "flow:render"
    };

    protected _element: HTMLElement | null = null;
    eventBus: EventBus;
    props: Record<string, any>;

    constructor(tagName = "div", props: Record<string, any> = {}) {
        this.eventBus = new EventBus();
        this.props = this._makePropsProxy(props);
        this._element = document.createElement(tagName);
        this.eventBus.on(Block.EVENTS.INIT, this._init.bind(this));
        this.eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this));
        this.eventBus.emit(Block.EVENTS.INIT);
    }

    private _init(): void {
        this._render();
    }

    private _render(): void {
        if (!this._element) return;
        this._element.innerHTML = this.render();
        this.addEvents();
    }

    protected render(): string {
        return "";
    }

    protected addEvents(): void {
        this.getSearch();
        this.getMessage();
        this.getFormNode();
    }

    private getSearch(): void {
        const searchForm = this._element?.querySelector(".search-form") as HTMLInputElement;
        const input = this._element?.querySelector(".search-form__input") as HTMLInputElement;

        if (searchForm) {
            searchForm.addEventListener("submit", (event) => {
                event.preventDefault();
                console.log(input.value);
            })
        }
    }

    private getMessage(): void {
        const searchForm = this._element?.querySelector(".chat-frame__footer__enter") as HTMLInputElement;
        const input = this._element?.querySelector(".chat-frame__footer__input") as HTMLInputElement;

        if (searchForm) {
            searchForm.addEventListener("submit", (event) => {
                event.preventDefault();
                console.log(input.value);
            })
        }
    }

    private getFormNode(): void {
        const regForm = this._element?.querySelector(".auth-form") as HTMLFormElement | null;

        if (regForm) {
            regForm.addEventListener("submit", (event) => {
                event.preventDefault();
                const formNode = new FormData(regForm);
                const data: Record<string, string> = {};
                formNode.forEach((value: FormDataEntryValue, key: string) => {
                    data[key] = value.toString();
                })

                console.log(data);
            })
        }
    }

    public getContent(): HTMLElement {
        return this._element!;
    }

    public setProps(nextProps: Record<string, any>): void {
        Object.assign(this.props, nextProps);
        this.eventBus.emit(Block.EVENTS.FLOW_RENDER);
    }

    private _makePropsProxy(props: Record<string, any>) {
        return new Proxy(props, {
            set: (target, prop, value) => {
                target[prop as string] = value;
                this.eventBus.emit(Block.EVENTS.FLOW_RENDER);
                return true;
            }
        });
    }

    protected compile(template: string, context: any): string {
        return Handlebars.compile(template)(context);
    }
}
