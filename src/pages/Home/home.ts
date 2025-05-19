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
import {deleteUserFromChat} from "../../api/Chat/deleteUserFromChat.ts";
import {ChatWebSocket} from "../../base/ChatWebSocket.ts";
import {getChatToken} from "../../api/Chat/getChatToken.ts";
import {user} from "../../api/User/user.ts";


Handlebars.registerHelper("ifEquals", function (this: any, a: any, b: any, options: any) {
    return a === b ? options.fn(this) : options.inverse(this);
});

export class Home extends Block {
    private dropMenuTemplate: string | null = null;
    private chatSocket: ChatWebSocket | null = null;
    private currentUserId: number | null = null;

    constructor() {
        super("div", {
            usersChat: [],
            selectedChatId: null,
            messages: [],
            events: {
                submit: (event) => this.handleEvents(event),
            }
        });
        void this.loadTemplate();
    }

    private async loadTemplate(): Promise<void> {
        try {
            const [
                searchContent,
                dropMenu,
                chatModal,
                addUserModal,
                deleteUserModal,
                chatFrameContent,
                userChatContent,
                homeTemplate,
                chatsRaw
            ] = await Promise.all([
                templateLoader("/templates/partials/search.hbs"),
                templateLoader("/templates/partials/dropdownMenu.hbs"),
                templateLoader("/templates/partials/createChatModal.hbs"),
                templateLoader("/templates/partials/addUserModal.hbs"),
                templateLoader("/templates/partials/deleteUserModal.hbs"),
                templateLoader("/templates/partials/chatFrame.hbs"),
                templateLoader("/templates/partials/userChat.hbs"),
                templateLoader("/templates/home.hbs"),
                getChats()
            ]);

            Handlebars.registerPartial("search", searchContent);
            Handlebars.registerPartial("dropdownMenu", dropMenu);
            Handlebars.registerPartial("createChatModal", chatModal);
            Handlebars.registerPartial("addUserModal", addUserModal);
            Handlebars.registerPartial("deleteUserModal", deleteUserModal);
            Handlebars.registerPartial("chatFrame", chatFrameContent);
            Handlebars.registerPartial("userChat", userChatContent);

            const chats = chatsRaw.sort((a: any, b: any) => {
                const aTime = a.last_message?.time ? new Date(a.last_message.time).getTime() : 0;
                const bTime = b.last_message?.time ? new Date(b.last_message.time).getTime() : 0;
                return bTime - aTime;
            });

            this.dropMenuTemplate = dropMenu;
            this.props.template = Handlebars.compile(homeTemplate);
            this.setProps({usersChat: chats, selectedChatId: null});
            this.lazyLoad();
        } catch (error) {
            console.error("Ошибка загрузки страницы:", error);
            router.go("/");
        }
    }

    protected render(): string {
        if (!this.props.template) {
            return `<p>Загружается страница...</p>`;
        }

        const activeChat = this.props.usersChat.find((chat: any) => chat.id === this.props.selectedChatId);

        return this.props.template({
            usersChat: this.props.usersChat,
            selectedChatId: this.props.selectedChatId,
            messages: this.props.messages,
            chatTitle: activeChat?.title || "",
            avatar: activeChat?.avatar || "",
            currentDate: new Date().toLocaleDateString()
        });
    }

    protected componentDidMount(): void {
        this.attachEvents();
    }

    protected componentDidUpdate(): boolean {
        this.attachEvents();

        const container = this.getContent().querySelector(".chat-frame__main");
        if (container) {
            container.scrollTop = container.scrollHeight;
        }

        return true;
    }

    private attachEvents(): void {
        setTimeout(() => this.dropdownsMenu(), 0);
        this.handleSelectChat();
    }

    private getSelectedChatId(): number | null {
        return this.props.selectedChatId;
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

        this.attachEvents();
    }

    private dropdownsMenu(): void {
        const root = this.getContent();
        const toggle = root.querySelector("#menu-toggle");
        const menu = root.querySelector("#dropdownMenu");
        const modal = root.querySelector("#createChatModal");
        const addUserModal = root.querySelector("#addUserModal");
        const deleteUserModal = root.querySelector("#deleteUserModal");
        const form = root.querySelector("#create-chat-form") as HTMLFormElement | null;
        const addUserForm = root.querySelector("#add-user-form") as HTMLFormElement | null;
        const deleteUserForm = root.querySelector("#delete-user-form") as HTMLFormElement | null;

        toggle?.addEventListener("click", () => {
            const hasActive = this.props.selectedChatId !== null;
            this.renderDropdownMenu(hasActive);

            const newMenu = this.getContent().querySelector("#dropdownMenu");
            newMenu?.classList.add("visible");
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
                const chatId = this.getSelectedChatId();
                if (!chatId) return console.error("Выберите чат.");
                try {
                    await deleteChat(chatId);
                    const chats = await getChats();
                    const selectedChatId = this.getSelectedChatId();
                    const usersChatWithActive = chats.map((chat: { id: number }) => ({
                        ...chat,
                        isActive: chat.id === selectedChatId
                    }));
                    this.setProps({usersChat: usersChatWithActive, selectedChatId});
                } catch (err) {
                    console.error("Ошибка при удалении чата:", err);
                }
            }

            if (action === "add-user") {
                addUserModal?.classList.add("active");
                this.handleOutsideClick(addUserModal);
            }

            if (action === "delete-user") {
                deleteUserModal?.classList.add("active");
                this.handleOutsideClick(deleteUserModal);
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
        if (deleteUserForm) {
            deleteUserForm.removeEventListener("submit", this.deleteUserSubmitHandler);
            deleteUserForm.addEventListener("submit", this.deleteUserSubmitHandler);
        }
    }

    private readonly UserHandler = this.createChats.bind(this);
    private readonly addUserSubmitHandler = this.addUserSubmit.bind(this);
    private readonly deleteUserSubmitHandler = this.deleteUserSubmit.bind(this);

    private async createChats(event: Event): Promise<void> {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const input = form.querySelector("input[name='title']") as HTMLInputElement;
        if (!input || !input.value.trim()) return console.error("Введите название чата");
        try {
            await createChat(input.value.trim());
            const chats = await getChats();
            const selectedChatId = this.getSelectedChatId();
            const usersChatWithActive = chats.map((chat: { id: number }) => ({
                ...chat,
                isActive: chat.id === selectedChatId
            }));
            this.setProps({usersChat: usersChatWithActive, selectedChatId});
            (this.getContent().querySelector("#createChatModal") as HTMLElement)?.classList.remove("active");
            input.value = "";
        } catch (error) {
            console.error("Ошибка при создании чата:", error);
        }
    }

    private async addUserSubmit(event: Event): Promise<void> {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const input = form.querySelector("input[name='userId']") as HTMLInputElement;
        const userId = Number(input.value.trim());
        const chatId = this.getSelectedChatId();
        if (!userId || !chatId) return console.error("Ошибка в ID пользователя");
        try {
            const usersInChat = await getUsersInChat(chatId);
            if ((usersInChat as { id: number }[]).some((u: { id: number }) => u.id === userId)) {
                alert("Пользователь уже в чате");
                return;
            }
            await addUserToChat(userId, chatId);
            input.value = "";
            (this.getContent().querySelector("#addUserModal") as HTMLElement)?.classList.remove("active");
        } catch (error) {
            console.error("Ошибка при добавлении пользователя:", error);
        }
    }

    private async deleteUserSubmit(event: Event): Promise<void> {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const input = form.querySelector("input[name='userId']") as HTMLInputElement;
        const userId = Number(input.value.trim());
        const chatId = this.getSelectedChatId();
        if (!userId || !chatId) return console.error("Ошибка в ID пользователя");
        try {
            await deleteUserFromChat(userId, chatId);
            alert("Пользователь удалён из чата");
            input.value = "";
            (this.getContent().querySelector("#deleteUserModal") as HTMLElement)?.classList.remove("active");
        } catch (error) {
            console.error("Ошибка при удалении пользователя:", error);
        }
    }

    private handleSelectChat(): void {
        const items = this.getContent().querySelectorAll(".aside-list__item");

        items.forEach(item =>
            item.addEventListener("click", async () => {
                const chatId = Number(item.getAttribute("data-id"));
                const token = await getChatToken(chatId);

                const usersChat = this.props.usersChat.map((chat: { id: number }) => ({
                    ...chat,
                    isActive: chat.id === chatId
                }));

                this.setProps({usersChat, selectedChatId: chatId});

                this.chatSocket?.close();

                const currentUser = await user();
                this.currentUserId = currentUser.id;


                this.chatSocket = new ChatWebSocket(chatId, currentUser.id, token, (data) => {
                    if (Array.isArray(data)) {
                        const formatted = data.reverse().map(m => ({
                            ...m,
                            isMine: m.user_id === currentUser.id
                        }));
                        this.setProps({messages: formatted});
                    } else if (data.type === "message") {
                        const userId = this.currentUserId;
                        const isMine = data.user_id === userId;

                        const newMessage = {
                            ...data,
                            isMine
                        };

                        this.setProps({
                            messages: [...(this.props.messages || []), newMessage]
                        });
                    }
                });
            })
        );
    }

    private handleOutsideClick(modal: Element | null): void {
        if (!modal) return;
        const onClick = (e: MouseEvent) => {
            if (!(e.target as HTMLElement).closest(".modal__content")) {
                modal.classList.remove("active");
                document.removeEventListener("click", onClick);
            }
        };
        setTimeout(() => document.addEventListener("click", onClick), 0);
    }

    private handleEvents(event: Event): void {
        const target = event.target as HTMLElement;
        if (target.closest(".search-form")) {
            event.preventDefault();
            this.getSearch(event);
        } else if (target.closest(".chat-frame__footer__enter")) {
            event.preventDefault();
            this.getMessage(event);
        } else if (target.closest(".chat-frame__footer__form")) {
            event.preventDefault();
            const input = this.getContent().querySelector("#message_input") as HTMLInputElement;
            const message = input?.value.trim();
            if (!message) return;
            this.chatSocket?.send({type: "message", content: message});
            input.value = "";
        }
    }

    private getSearch(event: Event): void {
        event.preventDefault();
        const input = (event.target as HTMLFormElement).querySelector(".search-form__input") as HTMLInputElement;
        if (input) console.log(input.value);
    }

    private getMessage(event: Event): void {
        event.preventDefault();
        const input = (event.target as HTMLFormElement).querySelector(".chat-frame__footer__input") as HTMLInputElement;
        if (input) console.log(input.value);
    }
}
