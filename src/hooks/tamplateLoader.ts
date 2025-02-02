export async function tamplateLoader(url: string): Promise<string> {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Ошибка загрузки шаблона по адресу ${url}: ${response.statusText}`);
    }
    return await response.text();
}
