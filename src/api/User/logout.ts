import {HOST_URL} from "../../hooks/route.ts";


export async function logout() {
    const response = await fetch(`${HOST_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        mode: 'cors'
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Ошибка: ${response.status}`);
    }

    const contentType = response.headers.get('Content-Type');
    if (contentType && contentType.includes('application/json')) {
        return await response.json();
    } else {
        return await response.text();
    }
}
