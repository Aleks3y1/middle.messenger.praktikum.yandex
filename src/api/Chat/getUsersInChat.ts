const HOST_URL = 'https://ya-praktikum.tech/api/v2';

export async function getUsersInChat(chatId: number) {
    const response = await fetch(`${HOST_URL}/chats/${chatId}/users`, {
        method: 'GET',
        credentials: 'include',
        mode: 'cors',
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Ошибка: ${response.status}`);
    }

    return await response.json();
}
