import {HOST_URL} from "../../hooks/route.ts";

export async function setAvatar(formData: FormData) {
    const response = await fetch(`${HOST_URL}/user/profile/avatar`, {
        method: 'PUT',
        credentials: 'include',
        mode: 'cors',
        body: formData,
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Ошибка: ${response.status}`);
    }

    return await response.json();
}
