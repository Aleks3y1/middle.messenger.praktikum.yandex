import Handlebars from "handlebars";
import Block from "../../base/Block";
import {templateLoader} from "../../hooks/templateLoader";
import "./singIn.scss";
import {Validation} from "../../hooks/Validation.ts";

export class SignIn extends Block {
    constructor() {
        super("div", {
            events: {
                submit: (event) => this.handleEvents(event),
                blur: (event) => this.handleBlur(event)
            }
        });
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
                {type: "text", id: "login", label: "Логин", name: "login"},
                {type: "password", id: "password", label: "Пароль", name: "password"}
            ],
            buttonText: "Войти",
            href: "/signup",
            linkText: "Ещё не зарегистрированы?"
        });
    }

    private handleEvents(event: Event): void {
        event.preventDefault();
        const target = event.target as HTMLElement;

        if (target.closest(".auth-form")) {
            this.getFormNode(event);
        }
    }

    private handleBlur(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.tagName === "INPUT") {
            Validation.validate(input);
        }
    }

    private getFormNode(event: Event): void {
        event.preventDefault();
        const regForm = event.target as HTMLFormElement;
        if (regForm) {
            const formNode = new FormData(regForm);
            const data: Record<string, string> = {};
            formNode.forEach((value, key) => (data[key] = value.toString()));
            console.log(data);
        }
    }
}
