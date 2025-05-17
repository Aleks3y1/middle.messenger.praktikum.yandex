const HOST_URL = 'https://ya-praktikum.tech/api/v2';

export async function getChatToken(chatId: number): Promise<string> {
    const response = await fetch(`${HOST_URL}/chats/token/${chatId}`, {
        method: 'POST',
        credentials: 'include',
        mode: 'cors',
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Ошибка: ${response.status}`);
    }

    const data = await response.json();
    return data.token;
}
