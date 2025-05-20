import {HOST_URL} from "../../hooks/route.ts";

type SetUserProps = {
    oldPassword: string;
    newPassword: string;
}

export async function setPassword({
                                      oldPassword,
                                      newPassword,
                                  }: SetUserProps) {
    const response = await fetch(`${HOST_URL}/user/password`, {
        method: 'PUT',
        credentials: 'include',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
                oldPassword: oldPassword,
                newPassword: newPassword,
            }
        )
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Ошибка: ${response.status}`);
    }

    return await response.json();
}
