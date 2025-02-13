import Handlebars from "handlebars";
import Block from "../../base/Block";
import { templateLoader } from "../../hooks/templateLoader";
import "./notfound.scss";

export class Notfound extends Block {
    constructor() {
        super("div", {});
        this.loadTemplate();
    }

    private async loadTemplate() {
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
            number: "404",
            title: "Не туда попали"
        });
    }
}
