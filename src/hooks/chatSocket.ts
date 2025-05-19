import {ChatWebSocket} from "../base/ChatWebSocket.ts";
import {getChatToken} from "../api/Chat/getChatToken.ts";

let chatSocket: ChatWebSocket | null = null;

export async function connectToChat(chatId: number, userId: number): Promise<ChatWebSocket | null> {
    try {
        const token = await getChatToken(chatId);
        chatSocket = new ChatWebSocket(chatId, userId, token, () => {});
        return chatSocket;
    } catch (error) {
        console.error("Ошибка подключения к WebSocket:", error);
        return null;
    }
}

export function getChatSocket(): ChatWebSocket | null {
    return chatSocket;
}
