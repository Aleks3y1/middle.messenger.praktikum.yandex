import Handlebars from "handlebars";
import Block from "../../base/Block";
import {templateLoader} from "../../hooks/templateLoader";
import "./singIn.scss";
import {Validation} from "../../hooks/Validation.ts";

export class SignIn extends Block {
    constructor() {
        super("div", {});
        this.loadTemplate();
    }

    private async loadTemplate() {
        try {
            const [buttonContent, authFormContent, signInTemplate] = await Promise.all([
                templateLoader("/templates/partials/button.hbs"),
                templateLoader("/templates/partials/authForm.hbs"),
                templateLoader("/templates/signIn.hbs")
            ]);

            Handlebars.registerPartial("button", buttonContent);
            Handlebars.registerPartial("authForm", authFormContent);

            this.props.template = Handlebars.compile(signInTemplate);
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
            description: "Вход",
            inputs: [
                {
type: "text", id: "login", label: "Логин", name: "login"
},
                {
type: "password", id: "password", label: "Пароль", name: "password"
}
            ],
            buttonText: "Войти",
            href: "/signup",
            linkText: "Ещё не зарегистрированы?"
        });
    }

    protected addEvents(): void {
        const form = this._element?.querySelector(".auth-form");

        if (form) {
            form.addEventListener("submit", (e) => {
                e.preventDefault();

                form.querySelectorAll("input").forEach((input) => {
                    Validation.validate(input)
                });
            });

            form.querySelectorAll("input").forEach((input) => {
                input.addEventListener("blur", () => Validation.validate(input));
            });
        }
    }
}
