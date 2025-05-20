import Handlebars from "handlebars";
import Block from "../../base/Block";
import {templateLoader} from "../../hooks/templateLoader";
import "./singIn.scss";
import {authorization} from "../../api/User/authorization.ts";
import {router} from "../../hooks/routerHook";
import {validationHook} from "../../hooks/ValidationHook.ts";
import {Validation} from "../../hooks/Validation.ts";

export class SignIn extends Block {
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
            const [buttonContent, authFormContent, signInTemplate] = await Promise.all([
                templateLoader("/templates/partials/button.hbs"),
                templateLoader("/templates/partials/authForm.hbs"),
                templateLoader("/templates/signIn.hbs"),
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
            return `<p>Загружается страница...</p>`;
        }
        return this.props.template({
            description: "Вход",
            inputs: [
                {type: "text", id: "login", label: "Логин", name: "login"},
                {type: "password", id: "password", label: "Пароль", name: "password"},
            ],
            buttonText: "Войти",
            href: "/sign-up",
            linkText: "Еще не зарегистрированы?",
        });
    }

    private handleEvents(event: Event): void {
        const form = (event.target as HTMLElement).closest(".auth-form") as HTMLFormElement;
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
        authorization(data.login, data.password)
            .then(() => router.go("/messenger"))
            .catch(console.error);
    }
}
