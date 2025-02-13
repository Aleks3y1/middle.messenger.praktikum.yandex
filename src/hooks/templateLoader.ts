export async function templateLoader(url: string, timeout = 5000): Promise<string> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, {signal: controller.signal});

        if (!response.ok) {
            throw new Error(`Ошибка загрузки шаблона (${url}): ${response.status} ${response.statusText}`);
        }

        return await response.text();
    } catch (error) {
        throw new Error(`Ошибка загрузки шаблона (${url}): ${error}`);
    } finally {
        clearTimeout(timeoutId);
    }
}
