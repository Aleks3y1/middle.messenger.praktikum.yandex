import Handlebars from "handlebars";
import Block from "../../base/Block";
import {templateLoader} from "../../hooks/templateLoader";
import "./singIn.scss";
import {Validation} from "../../hooks/Validation";
import {registration} from "../../api/User/registration.ts";
import {router} from "../../hooks/routerHook";

export class SignUp extends Block {
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
                {type: "text", id: "name", label: "Имя", name: "first_name"},
                {type: "text", id: "firstName", label: "Фамилия", name: "second_name"},
                {type: "text", id: "login", label: "Логин", name: "login"},
                {type: "tel", id: "tel", label: "Номер телефона", name: "phone"},
                {type: "email", id: "email", label: "Почта", name: "email"},
                {type: "password", id: "password", label: "Пароль", name: "password"},
                {type: "password", id: "retryPassword", label: "Повторите пароль"}
            ],
            buttonText: "Зарегистрироваться",
            href: "/signin",
            linkText: "Войти"
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

        if (!regForm) {
            return;
        }

        // let isValid = true;
        //
        // regForm.querySelectorAll('input').forEach((input: HTMLInputElement) => {
        //     const inputElem = input;
        //     const valid = Validation.validate(inputElem);
        //     if (!valid) {
        //         isValid = false;
        //     }
        // })
        //
        // if(!isValid) {
        //     return;
        // }

        const formNode = new FormData(regForm);
        const data: Record<string, string> = {};
        formNode.forEach((value, key) => (data[key] = value.toString()));
        registration(data.first_name,
            data.second_name,
            data.login,
            data.email,
            data.password,
            data.phone)
            .then(() => {
                router.go('/');
            })
            .catch((error) => {
                console.error(error);
            })
    }
}
