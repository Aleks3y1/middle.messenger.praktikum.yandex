interface Message {
    type: string;
    content?: string;
    time?: string;
    user_id?: number;
}

function formatTime(isoTime: string): string {
    const date = new Date(isoTime);
    return date.toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"});
}

export class ChatWebSocket {
    private socket: WebSocket;
    private pingInterval?: number;
    private messageHandler: (data: any) => void;

    constructor(chatId: number, userId: number, token: string, onMessage: (data: any) => void) {
        this.messageHandler = onMessage;
        this.socket = new WebSocket(`wss://ya-praktikum.tech/ws/chats/${userId}/${chatId}/${token}`);
        this.setupEvents();
    }

    private setupEvents(): void {
        this.socket.addEventListener("open", () => {
            console.log("WebSocket открыт");

            this.pingInterval = window.setInterval(() => {
                this.send({type: "ping"});
            }, 10000);

            this.send({type: "get old", content: "0"});
        });

        this.socket.addEventListener("message", (event) => {
            try {
                const data = JSON.parse(event.data);

                if (Array.isArray(data)) {
                    data.forEach((msg: Message) => {
                        if (msg.time) msg.time = formatTime(msg.time);
                    });
                } else if (data?.type === "message" && data.time) {
                    data.time = formatTime(data.time);
                }

                this.messageHandler(data);
            } catch (err) {
                console.warn("Сообщение не JSON:", event.data);
                console.error("Ошибка обработки сообщения:", err);
            }
        });

        this.socket.addEventListener("close", () => {
            console.log("WebSocket закрыт");
            if (this.pingInterval) clearInterval(this.pingInterval);
        });

        this.socket.addEventListener("error", (event) => {
            console.error("Ошибка WebSocket:", event);
        });
    }

    public send(msg: Message): void {
        this.socket.send(JSON.stringify(msg));
    }

    public close(): void {
        this.socket.close();
    }
}
