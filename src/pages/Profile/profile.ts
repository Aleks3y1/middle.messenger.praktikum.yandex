import './profile.scss';
import {tamplateLoader} from "../../hooks/tamplateLoader.ts";
import Handlebars from "handlebars";

let password = true;

export async function Profile(): Promise<void> {
    const app = document.querySelector('#app') as HTMLElement;

    if (app) {
        try {
            const buttonContent = await tamplateLoader('/templates/partials/button.hbs');
            Handlebars.registerPartial('button', buttonContent);

            const content = await tamplateLoader('/templates/profile.hbs');
            const template = Handlebars.compile(content);

            function render(): void {
                app.innerHTML = template({
                    password,
                    buttonText: password ? 'Сохранить' : 'Изменить',
                });
                eventListener();
            }

            function eventListener(): void {
                const buttonEvent = document.querySelector('.action-link__password');
                const buttonEnd = document.querySelector('.main-button');

                if (buttonEvent) {
                    buttonEvent.addEventListener('click', (e) => {
                        e.preventDefault();
                        password = false;
                        render();
                    });
                }

                if (buttonEnd) {
                    buttonEnd.addEventListener('click', (e) => {
                        e.preventDefault();
                        password = true;
                        render();
                    })
                }
            }

            render();
        } catch (error) {
            console.error('Ошибка загрузки страницы:', error);
        }
    }
}