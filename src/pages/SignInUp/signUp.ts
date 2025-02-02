import Handlebars from 'handlebars';
import './singIn.scss';
import {tamplateLoader} from "../../hooks/tamplateLoader.ts";

export async function SignUp(): Promise<void> {
    const app = document.querySelector('#app');

    if (app) {
        try {
            const buttonContent = await tamplateLoader('/templates/partials/button.hbs');
            Handlebars.registerPartial('button', buttonContent);

            const partialContent = await tamplateLoader('/templates/partials/authForm.hbs');
            Handlebars.registerPartial('authForm', partialContent);

            const response = await fetch('/templates/signUp.hbs');
            const content = await response.text();
            const template = Handlebars.compile(content);

            app.innerHTML = template({
                description: 'Регистрация',
                inputs: [
                    {type: 'text', id: 'name', label: 'Имя', name: 'first_name'},
                    {type: 'text', id: 'firstName', label: 'Фамилия', name: 'second_name'},
                    {type: 'text', id: 'login', label: 'Логин', name: 'login'},
                    {type: 'tel', id: 'tel', label: 'Номер телефона', name: 'phone'},
                    {type: 'email', id: 'email', label: 'Почта', name: 'email'},
                    {type: 'password', id: 'password', label: 'Пароль', name: 'password'},
                    {type: 'password', id: 'retryPassword', label: 'Повторите пароль'},
                ],
                buttonText: 'Зарегистрироваться',
                href: '/signin',
                linkText: 'Войти',
            });
        } catch (error) {
            console.error('Ошибка загрузки страницы:', error);
        }
    }
}
