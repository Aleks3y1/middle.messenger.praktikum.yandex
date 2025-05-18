import {HOST_URL} from "../../hooks/route.ts";

export async function registration(
    first_name: string,
    second_name: string,
    login: string,
    email: string,
    password: string,
    phone: string) {
    try {
        const response = await fetch(`${HOST_URL}/auth/signup`, {
            method: 'POST',
            credentials: 'include',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                first_name: first_name,
                second_name: second_name,
                login: login,
                email: email,
                password: password,
                phone: phone,
            })
        });

        if (!response.ok) {
            const errorText = await response.clone().text();
            new Error(errorText || `Ошибка: ${response.status}`);
        }

        return await response.json();
    } catch (error: any) {
        return Promise.reject(error);
    }
}
