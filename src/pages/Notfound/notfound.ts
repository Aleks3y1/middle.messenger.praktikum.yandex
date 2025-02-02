import {tamplateLoader} from "../../hooks/tamplateLoader.ts";
import Handlebars from "handlebars";
import './notfound.scss'

export async function Notfound(): Promise<void> {
    const app = document.querySelector('#app');

    if (app) {
        try {
            const content = await tamplateLoader('/templates/errorsPage.hbs');
            const template = Handlebars.compile(content);
            app.innerHTML = template({
                number: '404',
                title: 'Не туда попали',
            })
        } catch (error) {
            console.error('Ошибка загрузки страницы:', error);
        }
    }
}