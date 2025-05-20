import {HOST_URL} from "../../hooks/route.ts";


export async function createChat(title: string) {
    const response = await fetch(`${HOST_URL}/chats`, {
        method: 'POST',
        credentials: 'include',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            title,
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Ошибка: ${response.status}`);
    }

    return await response.json();
}
