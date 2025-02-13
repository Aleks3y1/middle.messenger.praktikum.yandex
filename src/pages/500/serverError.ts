import Handlebars from "handlebars";
import Block from "../../base/Block";
import {templateLoader} from "../../hooks/templateLoader";
import "../Notfound/notfound.scss";

export class ServerError extends Block {
    constructor() {
        super("div", {});
        this.loadTemplate();
    }

    private async loadTemplate(): Promise<void> {
        try {
            const content = await templateLoader("/templates/errorsPage.hbs");
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
            number: "500",
            title: "Мы уже фиксим"
        });
    }
}
