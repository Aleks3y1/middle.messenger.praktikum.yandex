import Handlebars from "handlebars";
import Block from "../../base/Block";
import {templateLoader} from "../../hooks/templateLoader";
import "./singIn.scss";
import {Validation} from "../../hooks/Validation.ts";

export class SignUp extends Block {
    constructor() {
        super("div", {});
        this.loadTemplate();
    }

    private async loadTemplate() {
        try {
            const [buttonContent, authFormContent, signUpTemplate] = await Promise.all([
                templateLoader("/templates/partials/button.hbs"),
                templateLoader("/templates/partials/authForm.hbs"),
                templateLoader("/templates/signUp.hbs")
            ]);

            Handlebars.registerPartial("button", buttonContent);
            Handlebars.registerPartial("authForm", authFormContent);

            this.props.template = Handlebars.compile(signUpTemplate);
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
            description: "Регистрация",
            inputs: [
                {
type: "text", id: "name", label: "Имя", name: "first_name"
},
                {
type: "text", id: "firstName", label: "Фамилия", name: "second_name"
},
                {
type: "text", id: "login", label: "Логин", name: "login"
},
                {
type: "tel", id: "tel", label: "Номер телефона", name: "phone"
},
                {
type: "email", id: "email", label: "Почта", name: "email"
},
                {
type: "password", id: "password", label: "Пароль", name: "password"
},
                {type: "password", id: "retryPassword", label: "Повторите пароль"}
            ],
            buttonText: "Зарегистрироваться",
            href: "/signin",
            linkText: "Войти"
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
