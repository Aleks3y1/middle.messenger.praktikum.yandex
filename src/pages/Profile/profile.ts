import Handlebars from "handlebars";
import Block from "../../base/Block";
import {templateLoader} from "../../hooks/templateLoader";
import "./profile.scss";
import {router} from "../../hooks/routerHook";
import {logout} from "../../api/User/logout.ts";
import {user} from "../../api/User/user.ts";
import {setUser} from "../../api/User/setUser.ts";
import {validationHook} from "../../hooks/ValidationHook.ts";
import {setPassword} from "../../api/User/setPassword.ts";
import {setAvatar} from "../../api/User/setAvatar.ts";

export class Profile extends Block {
    constructor() {
        super("div", {
            password: true,
            login: false,
            buttonText: "Изменить",
            events: {
                click: (event) => this.handleClick(event),
                change: (event) => this.handleChange(event),
            },
        });

        void this.loadTemplate();
    }

    private async loadTemplate(): Promise<void> {
        try {
            const [buttonContent, profileTemplate, userInfo] = await Promise.all([
                templateLoader("/templates/partials/button.hbs"),
                templateLoader("/templates/profile.hbs"),
                user(),
            ]);

            Handlebars.registerPartial("button", buttonContent);
            this.props.template = Handlebars.compile(profileTemplate);
            this.setProps({user: userInfo});
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
            login: this.props.login,
            buttonText: this.props.buttonText,
            user: this.props.user,
        });
    }

    private handleClick(event: Event): void {
        const target = event.target as HTMLElement;

        if (target.closest(".action-link__password")) {
            event.preventDefault();
            this.setProps({password: false, buttonText: "Сохранить"});
        }

        if (target.closest(".action-link__login")) {
            event.preventDefault();
            this.setProps({login: true, password: true, buttonText: "Сохранить"});
        }

        if (target.closest(".main-button")) {
            event.preventDefault();
            const form = document.querySelector(".form-data") as HTMLFormElement;
            if (!form) {
                return;
            }

            if (!validationHook(form)) {
                console.error("Введите корректные данные");
                return;
            }

            if (this.props.login) {
                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries()) as Record<string, string>;
                const {first_name, second_name, display_name, login, email, phone} = data;
                setUser({first_name, second_name, display_name, login, email, phone})
                    .then(() => {
                        this.setProps({
                            user: {first_name, second_name, display_name, login, email, phone},
                            password: true,
                            login: false,
                            buttonText: "Изменить",
                        });
                    });
            } else {
                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries()) as Record<string, string>;
                const {oldPassword, newPassword, retryPassword} = data;
                if (newPassword !== retryPassword) {
                    console.error("Пароли не совпадают");
                    return;
                }
                setPassword({oldPassword, newPassword}).then(() => {
                    this.setProps({password: true, login: false, buttonText: "Изменить"});
                });
            }
        }

        if (target.closest(".logout-link")) {
            event.preventDefault();
            logout().then(() => {
                router.go('/')
                window.location.reload();
            }).catch(console.error);
        }
    }

    private handleChange(event: Event): void {
        const target = event.target as HTMLInputElement;
        if (target.type === 'file' && target.name === 'avatar' && target.files?.length) {
            const file = target.files[0];
            const formData = new FormData();
            formData.append('avatar', file);
            setAvatar(formData).then((user) => {
                this.setProps({
                    user: {...this.props.user, avatar: user.avatar, timestamp: Date.now()},
                });
            }).catch(console.error);
        }
    }
}
