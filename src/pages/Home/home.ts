import Handlebars from "handlebars";
import Block from "../../base/Block";
import {templateLoader} from "../../hooks/templateLoader";
import "./home.scss";

export class Home extends Block {
    constructor() {
        super("div", {usersChat: Home.getUsers()});
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

    private static getUsers() {
        return [
            {
userName: "Андрей", date: "10:49", message: "Изображение", you: false, unread: true, quantityUnread: "2"
},
            {
userName: "Андрей", date: "10:49", message: "Изображение", you: true, unread: true, quantityUnread: "2"
},
            {
userName: "Андрей", date: "10:49", message: "Изображение", you: false, unread: false
},
            {
userName: "Андрей", date: "10:49", message: "Изображение", you: false, unread: false
},
            {
userName: "Андрей", date: "10:49", message: "Изображение", you: false, unread: false
},
            {
userName: "Андрей", date: "10:49", message: "Изображение", you: false, unread: false
},
            {
userName: "Андрей", date: "10:49", message: "Изображение", you: false, unread: false
},
            {
userName: "Андрей", date: "10:49", message: "Изображение", you: false, unread: false
},
            {
userName: "Андрей", date: "10:49", message: "Изображение", you: false, unread: false
}
        ];
    }
}
