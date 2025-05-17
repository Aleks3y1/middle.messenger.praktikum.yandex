export class ChatSocket {
    private socket: WebSocket;
    private readonly pingInterval: number = 10000;
    private pingTimer: ReturnType<typeof setInterval> | null = null;
    private messageHandler: ((data: any) => void) | null = null;

    constructor(userId: number, chatId: number, token: string) {
        const wsUrl = `wss://ya-praktikum.tech/ws/chats/${userId}/${chatId}/${token}`;
        console.log("Подключение к WebSocket:", wsUrl);

        this.socket = new WebSocket(wsUrl);

        this.socket.addEventListener("open", () => {
            console.log("WebSocket открыт");
            this.getOldMessages();
            this.startPing();
        });

        this.socket.addEventListener("message", (event) => {
            try {
                const data = JSON.parse(event.data);
                if (this.messageHandler) this.messageHandler(data);
                console.log("Сообщение от сервера:", data); //комментарии для отладки
            } catch (e) {
                console.error("Ошибка парсинга сообщения:", e);
            }
        });

        this.socket.addEventListener("close", (event) => {
            this.stopPing();
            console.warn("WebSocket закрыт:", event);
        });

        this.socket.addEventListener("error", (error) => {
            console.error("WebSocket ошибка:", error);
        });
    }

    public onMessage(callback: (data: any) => void): void {
        this.messageHandler = callback;
    }

    public send(message: string): void {
        if (this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({content: message, type: "message"}));
        } else {
            console.warn("Невозможно отправить — WebSocket не подключен");
        }
    }

    public getOldMessages(): void {
        if (this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({content: "0", type: "get old"}));
        }
    }

    public close(): void {
        this.stopPing();
        this.socket.close();
    }

    private startPing(): void {
        this.pingTimer = setInterval(() => {
            this.socket.send(JSON.stringify({type: "ping"}));
        }, this.pingInterval);
    }

    private stopPing(): void {
        if (this.pingTimer) {
            clearInterval(this.pingTimer);
            this.pingTimer = null;
        }
    }
}
