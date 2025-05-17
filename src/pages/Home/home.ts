import Handlebars from "handlebars";
import Block from "../../base/Block";
import {templateLoader} from "../../hooks/templateLoader";
import "./home.scss";
import {getChats} from "../../api/Chat/getChats.ts";
import {createChat} from "../../api/Chat/createChat.ts";
import {deleteChat} from "../../api/Chat/deleteChat.ts";
import {addUserToChat} from "../../api/Chat/addUserToChat.ts";
import {router} from "../../hooks/routerHook.ts";
import {getUsersInChat} from "../../api/Chat/getUsersInChat.ts";
import {connectToChat} from "../../hooks/chatSocket.ts";


export class Home extends Block {
    private dropMenuTemplate: string | null = null;

    constructor() {
        super("div", {
            usersChat: [],
            currentUser: null,
            events: {
                submit: (event) => this.handleEvents(event),
            }
        });
        void this.loadTemplate();
    }

    private async loadTemplate(): Promise<void> {
        try {
            const [searchContent, dropMenu, chatModal, addUserModal, chatFrameContent, userChatContent, homeTemplate, chats] = await Promise.all([
                templateLoader("/templates/partials/search.hbs"),
                templateLoader("/templates/partials/dropdownMenu.hbs"),
                templateLoader("/templates/partials/createChatModal.hbs"),
                templateLoader("/templates/partials/addUserModal.hbs"),
                templateLoader("/templates/partials/chatFrame.hbs"),
                templateLoader("/templates/partials/userChat.hbs"),
                templateLoader("/templates/home.hbs"),
                getChats()
            ]);

            Handlebars.registerPartial("search", searchContent);
            Handlebars.registerPartial("dropdownMenu", dropMenu);
            Handlebars.registerPartial("createChatModal", chatModal);
            Handlebars.registerPartial("addUserModal", addUserModal);
            Handlebars.registerPartial("chatFrame", chatFrameContent);
            Handlebars.registerPartial("userChat", userChatContent);

            this.dropMenuTemplate = dropMenu;
            this.props.template = Handlebars.compile(homeTemplate);
            this.setProps({usersChat: chats});
            this.lazyLoad();
        } catch (error) {
            console.error("Ошибка загрузки страницы:", error);
            router.go("/signin");
        }
    }

    protected render(): string {
        if (!this.props.template) {
            return `<p>Загружаем страницу...</p>`;
        }

        return this.props.template({usersChat: this.props.usersChat});
    }

    protected componentDidMount(): void {
        setTimeout(() => this.waitMenu(), 0);
        this.handleSelectChat();
    }

    private waitMenu(): void {
        const root = this.getContent();
        const tryToggle = setInterval(() => {
            const toggle = root.querySelector("#menu-toggle");
            if (toggle) {
                clearInterval(tryToggle);
                this.dropdownsMenu();
            }
        }, 50);
    }

    private getSelectedChatId(): number | null {
        const activeItem = this.getContent().querySelector(".aside-list__item.active");
        if (!activeItem) return null;
        const id = activeItem.getAttribute("data-id");
        return id ? Number(id) : null;
    }

    private renderDropdownMenu(hasActiveChat: boolean): void {
        if (!this.dropMenuTemplate) return;

        const menuContainer = this.getContent().querySelector("#dropdownMenu");
        if (!menuContainer) return;

        const template = Handlebars.compile(this.dropMenuTemplate);
        const newHtml = template({hasActiveChat});

        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = newHtml.trim();

        menuContainer.replaceWith(tempDiv.firstElementChild!);
        this.dropdownsMenu();
    }

    private dropdownsMenu(): void {
        const root = this.getContent();
        const toggle = root.querySelector("#menu-toggle");
        const menu = root.querySelector("#dropdownMenu");
        const modal = root.querySelector("#createChatModal");
        const form = root.querySelector("#create-chat-form") as HTMLFormElement | null;
        const addUserModal = root.querySelector("#addUserModal");
        const addUserForm = root.querySelector("#add-user-form") as HTMLFormElement | null;

        toggle?.addEventListener("click", () => {
            menu?.classList.toggle("visible");
        });

        menu?.addEventListener("click", async (e) => {
            const action = (e.target as HTMLElement).dataset.action;
            menu?.classList.remove("visible");

            if (action === "create") {
                modal?.classList.add("active");
                this.handleOutsideClick(modal);
            }

            if (action === "delete") {
                const confirmed = confirm("Вы уверены, что хотите удалить чат?");
                if (!confirmed) return;

                try {
                    const chatId = this.getSelectedChatId();
                    if (!chatId) {
                        console.error("Выберите чат.");
                        return;
                    }

                    await deleteChat(chatId);
                    const chats = await getChats();
                    this.setProps({usersChat: chats});
                    this.renderDropdownMenu(false);
                } catch (error) {
                    console.error("Ошибка при удалении чата:", error);
                }
            }

            if (action === "add-user") {
                addUserModal?.classList.add("active");
                this.handleOutsideClick(addUserModal);
            }
        });

        if (form) {
            form.removeEventListener("submit", this.UserHandler);
            form.addEventListener("submit", this.UserHandler);
        }

        if (addUserForm) {
            addUserForm.removeEventListener("submit", this.addUserSubmitHandler);
            addUserForm.addEventListener("submit", this.addUserSubmitHandler);
        }
    }

    private readonly UserHandler = this.createChats.bind(this);
    private readonly addUserSubmitHandler = this.addUserSubmit.bind(this);

    private async addUserSubmit(event: Event): Promise<void> {
        event.preventDefault();

        const form = event.target as HTMLFormElement;
        const input = form.querySelector("input[name='userId']") as HTMLInputElement;
        const userId = Number(input.value.trim());
        const chatId = this.getSelectedChatId();

        if (!userId || !chatId) {
            console.error("Ошибка в ID пользователя");
            return;
        }

        try {
            const usersInChat = await getUsersInChat(chatId);
            const alreadyInChat = usersInChat.some((user: { id: number }) => user.id === userId);

            if (alreadyInChat) {
                alert("Пользователь уже в чате");
                return;
            }

            await addUserToChat(userId, chatId);

            input.value = "";
            const modal = this.getContent().querySelector("#addUserModal");
            modal?.classList.remove("active");
        } catch (error) {
            console.error("Ошибка при добавлении пользователя:", error);
        }
    }

    private handleOutsideClick(modal: Element | null): void {
        if (!modal) return;

        const onClick = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest(".modal__content")) {
                modal.classList.remove("active");
                document.removeEventListener("click", onClick);
            }
        };

        setTimeout(() => {
            document.addEventListener("click", onClick);
        }, 0);
    }

    private handleEvents(event: Event): void {
        const target = event.target as HTMLElement;

        if (target.closest(".search-form")) {
            event.preventDefault();
            this.getSearch(event);
        } else if (target.closest(".chat-frame__footer__enter")) {
            event.preventDefault();
            this.getMessage(event);
        }
    }

    private handleSelectChat(): void {
        const root = this.getContent();
        const chatElem = root.querySelectorAll(".aside-list__item");

        chatElem.forEach(item => {
            item.addEventListener("click", async () => {
                chatElem.forEach(i => i.classList.remove("active"));
                item.classList.add("active");
                this.renderDropdownMenu(true);

                const chatId = Number(item.getAttribute("data-id"));
                const userId = this.props.currentUser?.id;

                if (!isNaN(chatId) && userId) {
                    await connectToChat(chatId, userId);
                }
            });
        });
    }

    private getSearch(event: Event): void {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const input = form.querySelector(".search-form__input") as HTMLInputElement;
        if (input) {
            console.log(input.value);
        }
    }

    private async createChats(event: Event): Promise<void> {
        event.preventDefault();

        const form = event.target as HTMLFormElement;
        const input = form.querySelector("input[name='title']") as HTMLInputElement;

        if (!input || !input.value.trim()) {
            console.error("Введите название чата");
            return;
        }

        try {
            await createChat(input.value.trim());
            const chats = await getChats();
            this.setProps({usersChat: chats});

            const modal = this.getContent().querySelector("#createChatModal");
            modal?.classList.remove("active");

            input.value = "";
        } catch (error) {
            console.error("Ошибка при создании чата:", error);
        }
    }

    private getMessage(event: Event): void {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const input = form.querySelector(".chat-frame__footer__input") as HTMLInputElement;
        if (input) {
            console.log(input.value);
        }
    }
}
