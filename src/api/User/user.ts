import {HOST_URL} from "../../hooks/route.ts";
import {router} from "../../hooks/routerHook.ts";

export async function user() {
    const response = await fetch(`${HOST_URL}/auth/user`, {
        method: 'GET',
        credentials: 'include',
        mode: 'cors'
    });

    if (!response.ok) {
        const errorText = await response.text();
        router.go('/');
        throw new Error(errorText || `Ошибка: ${response.status}`);
    }

    return await response.json();
}
