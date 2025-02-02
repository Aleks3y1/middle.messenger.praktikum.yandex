import Handlebars from 'handlebars';
import './singIn.scss';
import {tamplateLoader} from "../../hooks/tamplateLoader.ts";

export async function SignIn(): Promise<void> {
    const app = document.querySelector('#app');

    if (app) {
        try {
            const buttonContent = await tamplateLoader('/templates/partials/button.hbs');
            Handlebars.registerPartial('button', buttonContent);

            const partialContent = await tamplateLoader('/templates/partials/authForm.hbs');
            Handlebars.registerPartial('authForm', partialContent);

            const response = await fetch('/templates/signIn.hbs');
            const content = await response.text();
            const template = Handlebars.compile(content);

            app.innerHTML = template({
                description: 'Вход',
                inputs: [
                    {type: 'text', id: 'login', label: 'Логин', name: 'login'},
                    {type: 'password', id: 'password', label: 'Пароль', name: 'password'},
                ],
                buttonText: 'Войти',
                href: '/signup',
                linkText: 'Ещё не зарегистрированы?',
            });
        } catch (error) {
            console.error('Ошибка загрузки страницы:', error);
        }
    }
}
