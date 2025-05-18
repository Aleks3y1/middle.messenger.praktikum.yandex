import {HOST_URL} from "../../hooks/route.ts";

export async function user() {
    const response = await fetch(`${HOST_URL}/auth/user`, {
        method: 'GET',
        credentials: 'include',
        mode: 'cors'
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Ошибка: ${response.status}`);
    }

    return await response.json();
}
