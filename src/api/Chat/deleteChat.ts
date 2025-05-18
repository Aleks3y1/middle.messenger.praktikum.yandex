import {HOST_URL} from "../../hooks/route.ts";

export async function deleteChat(chatId: number): Promise<void> {
    const response = await fetch(`${HOST_URL}/chats`, {
        method: 'DELETE',
        credentials: 'include',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({chatId}),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Ошибка: ${response.status}`);
    }
}
