import {tamplateLoader} from "../../hooks/tamplateLoader.ts";
import Handlebars from "handlebars";
import '../Notfound/notfound.scss'

export async function ServerError(): Promise<void> {
    const app = document.querySelector('#app');

    if (app) {
        try {
            const content = await tamplateLoader('/templates/errorsPage.hbs');
            const template = Handlebars.compile(content);
            app.innerHTML = template({
                number: '500',
                title: 'Мы уже фиксим',
            })
        } catch (error) {
            console.error('Ошибка загрузки страницы:', error);
        }
    }
}
