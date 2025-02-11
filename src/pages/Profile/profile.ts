import Handlebars from "handlebars";
import Block from "../../base/Block";
import {templateLoader} from "../../hooks/templateLoader";
import "./profile.scss";

export class Profile extends Block {
    constructor() {
        super("div", {password: true, buttonText: "Изменить"});
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

    protected addEvents(): void {
        const changePasswordButton = this._element?.querySelector(".action-link__password");
        const saveButton = this._element?.querySelector(".main-button");

        if (changePasswordButton) {
            changePasswordButton.addEventListener("click", (e) => {
                e.preventDefault();
                this.setProps({password: false, buttonText: "Сохранить"});
            });
        }

        if (saveButton) {
            saveButton.addEventListener("click", (e) => {
                e.preventDefault();
                this.setProps({password: true, buttonText: "Изменить"});
            });
        }
    }
}
