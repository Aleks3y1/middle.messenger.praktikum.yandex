import {HOST_URL} from "../../hooks/route.ts";

export async function authorization(login: string, password: string) {
    try {
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
            new Error(errorText || `Ошибка: ${response.status}`);
        }

        const contentType = response.headers.get('Content-Type');

        let result;

        if (contentType && contentType.includes('application/json')) {
            result = await response.json();
        } else {
            result = await response.text();
        }

        return result;
    } catch (error: any) {
        return Promise.reject(error);
    }
}
