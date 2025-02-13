import Handlebars from "handlebars";
import Block from "../../base/Block";
import {templateLoader} from "../../hooks/templateLoader";
import "./profile.scss";

export class Profile extends Block {
    constructor() {
        super("div", {
            password: true,
            buttonText: "Изменить",
            events: {
                click: (event) => this.handleClick(event),
            }
        });

        this.loadTemplate();
    }

    private async loadTemplate(): Promise<void> {
        try {
            const [buttonContent, profileTemplate] = await Promise.all([
                templateLoader("/templates/partials/button.hbs"),
                templateLoader("/templates/profile.hbs")
            ]);

            Handlebars.registerPartial("button", buttonContent);
            this.props.template = Handlebars.compile(profileTemplate);

            this.eventBus.emit(Block.EVENTS.FLOW_RENDER);
        } catch (error) {
            console.error("Ошибка загрузки шаблона:", error);
        }
    }

    protected render(): string {
        if (!this.props.template) {
            return `<p>Загружаем страницу...</p>`;
        }

        return this.props.template({
            password: this.props.password,
            buttonText: this.props.buttonText
        });
    }

    private handleClick(event: Event): void {
        const target = event.target as HTMLElement;

        if (target.closest(".action-link__password")) {
            event.preventDefault();
            this.setProps({password: false, buttonText: "Сохранить"});
        }

        if (target.closest(".main-button")) {
            event.preventDefault();
            this.setProps({password: true, buttonText: "Изменить"});
        }
    }
}
