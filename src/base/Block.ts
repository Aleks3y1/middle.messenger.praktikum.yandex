import Handlebars from "handlebars";
import EventBus from "./EventBus";

type Events = Record<string, (event: Event) => void>;

type Props = {
    events?: Events;
    [key: string]: any;
    // можно использовать unknown, но тогда нужно при использовании, с помощью 'as', явно приводить к типу(в будущем).
};

export default class Block {
    static EVENTS = {
        INIT: "init",
        FLOW_RENDER: "flow:render"
    };

    protected _element: HTMLElement | null = null;
    eventBus: EventBus;
    props: Props;

    constructor(tagName = "div", props: Props = {}) {
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
        this._removeEvents();
        this._element.innerHTML = this.render();
        this._addEvents();
        this.componentDidMount?.();
    }

    protected componentDidMount(): void {
    }

    protected render(): string {
        const {template, usersChat} = this.props;
        return template ? template({usersChat}) : `<p>Загружаем...</p>`;
    }

    protected lazyLoad(): void {
        this._render();
    }

    private _addEvents(): void {
        const {events = {}} = this.props;
        Object.keys(events).forEach(eventName => {
            this._element?.addEventListener(eventName, events[eventName]);
        });
    }

    private _removeEvents(): void {
        const {events = {}} = this.props;
        Object.keys(events).forEach(eventName => {
            if (events[eventName]) {
                this._element?.removeEventListener(eventName, events[eventName]);
            }
        });
    }

    public getContent(): HTMLElement {
        return this._element!;
    }

    public setProps(nextProps: Props): void {
        Object.assign(this.props, nextProps);
        this.eventBus.emit(Block.EVENTS.FLOW_RENDER);
    }

    private _makePropsProxy(props: Props): Props {
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
