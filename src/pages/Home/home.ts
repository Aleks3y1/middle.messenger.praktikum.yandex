import Handlebars from "handlebars";
import Block from "../../base/Block";
import {templateLoader} from "../../hooks/templateLoader";
import "./home.scss";

type Users = {
    userName: string,
    date: string,
    message: string,
    you: boolean,
    unread: boolean,
    quantityUnread?: string
}

export class Home extends Block {
    constructor() {
        super("div", {
            usersChat: Home.getUsers(),
            events: {
                submit: (event) => this.handleEvents(event),
            }
        });
        this.loadTemplate();
    }

    private async loadTemplate(): Promise<void> {
        try {
            const [searchContent, chatFrameContent, userChatContent, homeTemplate] = await Promise.all([
                templateLoader("/templates/partials/search.hbs"),
                templateLoader("/templates/partials/chatFrame.hbs"),
                templateLoader("/templates/partials/userChat.hbs"),
                templateLoader("/templates/home.hbs")
            ]);

            Handlebars.registerPartial("search", searchContent);
            Handlebars.registerPartial("chatFrame", chatFrameContent);
            Handlebars.registerPartial("userChat", userChatContent);

            this.props.template = Handlebars.compile(homeTemplate);
            this.eventBus.emit(Block.EVENTS.FLOW_RENDER);
        } catch (error) {
            console.error("Ошибка загрузки страницы:", error);
        }
    }

    protected render(): string {
        if (!this.props.template) {
            return `<p>Загружаем страницу...</p>`;
        }

        return this.props.template({usersChat: this.props.usersChat});
    }

    private handleEvents(event: Event): void {
        event.preventDefault();
        const target = event.target as HTMLElement;

        if (target.closest(".search-form")) {
            this.getSearch(event);
        } else if (target.closest(".chat-frame__footer__enter")) {
            this.getMessage(event);
        }
    }

    private getSearch(event: Event): void {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const input = form.querySelector(".search-form__input") as HTMLInputElement;
        if (input) {
            console.log(input.value);
        }
    }

    private getMessage(event: Event): void {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const input = form.querySelector(".chat-frame__footer__input") as HTMLInputElement;
        if (input) {
            console.log(input.value);
        }
    }

    private static getUsers(): Users[] {
        return [
            {userName: "Андрей", date: "10:49", message: "Изображение", you: false, unread: true, quantityUnread: "2"},
            {userName: "Андрей", date: "10:49", message: "Изображение", you: true, unread: true, quantityUnread: "2"},
            {userName: "Андрей", date: "10:49", message: "Изображение", you: false, unread: false},
            {userName: "Андрей", date: "10:49", message: "Изображение", you: false, unread: false},
            {userName: "Андрей", date: "10:49", message: "Изображение", you: false, unread: false},
            {userName: "Андрей", date: "10:49", message: "Изображение", you: false, unread: false},
            {userName: "Андрей", date: "10:49", message: "Изображение", you: false, unread: false},
            {userName: "Андрей", date: "10:49", message: "Изображение", you: false, unread: false},
            {userName: "Андрей", date: "10:49", message: "Изображение", you: false, unread: false}
        ];
    }
}
