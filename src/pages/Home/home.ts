import Handlebars from 'handlebars';
import './home.scss';
import '../../hooks/tamplateLoader.ts'
import {tamplateLoader} from "../../hooks/tamplateLoader.ts";

export async function Home(): Promise<void> {
    const app = document.querySelector('#app');

    if (app) {
        try {
            const searchContent = await tamplateLoader('/templates/partials/search.hbs');
            Handlebars.registerPartial('search', searchContent);

            const chatFrameContent = await tamplateLoader('/templates/partials/chatFrame.hbs');
            Handlebars.registerPartial('chatFrame', chatFrameContent);

            const userChatContent = await tamplateLoader('/templates/partials/userChat.hbs');
            Handlebars.registerPartial('userChat', userChatContent);

            const content = await tamplateLoader('/templates/home.hbs');
            const template = Handlebars.compile(content);

            app.innerHTML = template({
                usersChat: [
                    {
                        userName: 'Андрей',
                        date: '10:49',
                        message: 'Изображение',
                        you: false,
                        unread: true,
                        quantityUnread: '2'
                    },
                    {
                        userName: 'Андрей',
                        date: '10:49',
                        message: 'Изображение',
                        you: true,
                        unread: true,
                        quantityUnread: '2'
                    },
                    {userName: 'Андрей', date: '10:49', message: 'Изображение', you: false, unread: false},
                    {userName: 'Андрей', date: '10:49', message: 'Изображение', you: false, unread: false},
                    {userName: 'Андрей', date: '10:49', message: 'Изображение', you: false, unread: false},
                    {userName: 'Андрей', date: '10:49', message: 'Изображение', you: false, unread: false},
                    {userName: 'Андрей', date: '10:49', message: 'Изображение', you: false, unread: false},
                    {userName: 'Андрей', date: '10:49', message: 'Изображение', you: false, unread: false},
                    {userName: 'Андрей', date: '10:49', message: 'Изображение', you: false, unread: false},


                ]
            });
        } catch (error) {
            console.error('Ошибка загрузки страницы:', error);
        }
    }
}
