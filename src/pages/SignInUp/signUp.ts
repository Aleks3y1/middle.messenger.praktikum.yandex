import Handlebars from "handlebars";
import Block from "../../base/Block";
import {templateLoader} from "../../hooks/templateLoader";
import "./singIn.scss";
import {registration} from "../../api/User/registration.ts";
import {router} from "../../hooks/routerHook";
import {validationHook} from "../../hooks/ValidationHook.ts";
import {Validation} from "../../hooks/Validation.ts";

export class SignUp extends Block {
    constructor() {
        super("div", {
            events: {
                submit: (event) => this.handleEvents(event),
                blur: (event) => this.handleBlur(event),
                input: (event) => this.handleInput(event)
            },
        });
        void this.loadTemplate();
    }

    private async loadTemplate() {
        try {
            const [buttonContent, authFormContent, signUpTemplate] =
                await Promise.all([
                    templateLoader("/templates/partials/button.hbs"),
                    templateLoader("/templates/partials/authForm.hbs"),
                    templateLoader("/templates/signUp.hbs"),
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
        if (!this.props.template) return `<p>Загружаем страницу...</p>`;
        return this.props.template({
            description: "Регистрация",
            inputs: [
                {type: "text", id: "name", label: "Имя", name: "first_name"},
                {type: "text", id: "firstName", label: "Фамилия", name: "second_name"},
                {type: "text", id: "login", label: "Логин", name: "login"},
                {type: "tel", id: "tel", label: "Номер телефона", name: "phone"},
                {type: "email", id: "email", label: "Почта", name: "email"},
                {type: "password", id: "password", label: "Пароль", name: "password"},
                {type: "password", id: "retryPassword", label: "Повторите пароль", name: "retryPassword"},
            ],
            buttonText: "Зарегистрироваться",
            href: "/messenger",
            linkText: "Войти",
        });
    }

    private handleEvents(event: Event): void {
        const form = (event.target as HTMLElement)
            .closest(".auth-form") as HTMLFormElement;
        if (!form) return;
        event.preventDefault();
        if (!validationHook(form)) return;
        this.getFormNode(form);
    }

    private handleInput(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.tagName === "INPUT") {
            Validation.validate(input);
        }
    }

    private handleBlur(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.tagName === "INPUT") {
            Validation.validate(input);
        }
    }

    private getFormNode(regForm: HTMLFormElement): void {
        const data = Object.fromEntries(new FormData(regForm).entries()) as Record<string, string>;
        registration(
            data.first_name,
            data.second_name,
            data.login,
            data.email,
            data.password,
            data.phone
        )
            .then(() => router.go("/"))
            .catch(console.error);
    }
}
