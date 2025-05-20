import {HOST_URL} from "../../hooks/route.ts";

type SetUserProps = {
    first_name: string;
    second_name: string;
    display_name: string;
    login: string;
    email: string;
    phone: string;
}

export async function setUser({
                                  first_name,
                                  second_name,
                                  display_name,
                                  login,
                                  email,
                                  phone
                              }: SetUserProps) {
    const response = await fetch(`${HOST_URL}/user/profile`, {
        method: 'PUT',
        credentials: 'include',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
                first_name: first_name,
                second_name: second_name,
                display_name: display_name,
                login: login,
                email: email,
                phone: phone
            }
        )
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Ошибка: ${response.status}`);
    }

    return await response.json();
}
