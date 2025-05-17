const HOST_URL = 'https://ya-praktikum.tech/api/v2';

export async function addUserToChat(userId: number, chatId: number) {
    const response = await fetch(`${HOST_URL}/chats/users`, {
        method: 'PUT',
        credentials: 'include',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            users: [userId],
            chatId: chatId
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Ошибка: ${response.status}`);
    }

    const text = await response.text();
    if (text.trim() === 'OK') return { success: true };
    try {
        return JSON.parse(text);
    } catch {
        return { raw: text };
    }
}
