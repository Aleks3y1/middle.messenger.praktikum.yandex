import {HOST_URL} from "../../hooks/route.ts";

export async function authorization(login: string, password: string): Promise<void> {
    const response = await fetch(`${HOST_URL}/auth/signin`, {
        method: 'POST',
        credentials: 'include',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            login: login,
            password: password,
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Ошибка: ${response.status}`);
    }
}
