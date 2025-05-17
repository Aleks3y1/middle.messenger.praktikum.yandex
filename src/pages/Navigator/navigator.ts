import Handlebars from "handlebars";
import Block from "../../base/Block";
import {templateLoader} from "../../hooks/templateLoader";

export class Navigator extends Block {
    constructor() {
        super("div", {links: Navigator.getLinks()});
        this.loadTemplate();
    }

    private async loadTemplate() {
        try {
            const content = await templateLoader("/templates/navigator.hbs");
            this.props.template = Handlebars.compile(content);
            this.eventBus.emit(Block.EVENTS.FLOW_RENDER);
        } catch (error) {
            console.error("Ошибка загрузки страницы:", error);
        }
    }

    protected render(): string {
        if (!this.props.template) {
            return `<p>Загружаем страницу...</p>`;
        }

        return this.props.template({
            title: "Навигация",
            links: this.props.links
        });
    }

    private static getLinks() {
        return [
            {href: "/home", text: "Главная"},
            {href: "/signin", text: "Вход"},
            {href: "/signup", text: "Регистрация"},
            {href: "/profile", text: "Профиль"},
            {href: "/notfound", text: "Notfound"},
            {href: "/500", text: "500"}
        ];
    }
}
