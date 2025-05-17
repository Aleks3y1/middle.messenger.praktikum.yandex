import {getChatToken} from "../api/Chat/getChatToken";
import {ChatSocket} from "../base/ChatWebSocket.ts";

let chatSocket: ChatSocket | null = null;

export async function connectToChat(chatId: number, userId: number): Promise<ChatSocket | null> {
    try {
        console.log(" Инициализация подключения:", { userId, chatId });
        const token = await getChatToken(chatId);
        console.log("Токен получен:", token);

        chatSocket = new ChatSocket(userId, chatId, token);
        return chatSocket;
    } catch (error) {
        console.error("Ошибка подключения к WebSocket:", error);
        return null;
    }
}

export function getChatSocket(): ChatSocket | null {
    return chatSocket;
}
