import Handlebars from 'handlebars';
import './navigator.scss'
import {tamplateLoader} from "../../hooks/tamplateLoader.ts";

export async function Navigator(): Promise<void> {
    const app = document.querySelector('#app');

    if (app) {
        try {
            const content = await tamplateLoader('/templates/navigator.hbs');
            const template = Handlebars.compile(content);

            app.innerHTML = template({
                title: 'Навигация',
                links: [
                    {href: '/home', text: 'Главная'},
                    {href: '/signin', text: 'Вход'},
                    {href: '/signup', text: 'Регистрация'},
                    {href: '/profile', text: 'Профиль'},
                    {href: '/notfound', text: 'Notfound'},
                    {href: '/500', text: '500'},
                ],
            });
        } catch (error) {
            console.error('Ошибка загрузки страницы:', error);
        }
    }
}
