import {HOST_URL} from "../../hooks/route.ts";


export async function logout(): Promise<void> {
    const response = await fetch(`${HOST_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        mode: 'cors'
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Ошибка: ${response.status}`);
    }

    document.cookie = "uuid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    localStorage.clear();
    sessionStorage.clear();

    // const contentType = response.headers.get('Content-Type');
    // if (contentType && contentType.includes('application/json')) {
    //     return await response.json();
    // } else {
    //     return await response.text();
    // }
}
