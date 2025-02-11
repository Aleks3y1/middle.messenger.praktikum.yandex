enum METHOD {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    PATCH = "PATCH",
    DELETE = "DELETE",
}

type Options<T = any> = {
    method: METHOD;
    data?: T;
    headers?: Record<string, string>;
    timeout?: number;
};

export class XHRTransport {
    private apiUrl: string;

    constructor(apiUrl: string) {
        this.apiUrl = apiUrl;
    }

    get<TResponse>(endpoint: string, params?: Record<string, any>): Promise<TResponse> {
        const url = `${this.apiUrl}${endpoint}${this._buildQueryString(params)}`;
        return this._request<TResponse>(url, {method: METHOD.GET});
    }

    post<TResponse, TData = any>(endpoint: string, data?: TData): Promise<TResponse> {
        return this._request<TResponse>(`${this.apiUrl}${endpoint}`, {method: METHOD.POST, data});// пока без апи, учесть путь до апи
    }

    put<TResponse, TData = any>(endpoint: string, data?: TData): Promise<TResponse> {
        return this._request<TResponse>(`${this.apiUrl}${endpoint}`, {method: METHOD.PUT, data});// пока без апи, учесть путь до апи
    }

    patch<TResponse, TData = any>(endpoint: string, data?: TData): Promise<TResponse> {
        return this._request<TResponse>(`${this.apiUrl}${endpoint}`, {method: METHOD.PATCH, data});// пока без апи, учесть путь до апи
    }

    delete<TResponse, TData = any>(endpoint: string, data?: TData): Promise<TResponse> {
        return this._request<TResponse>(`${this.apiUrl}${endpoint}`, {method: METHOD.DELETE, data});// пока без апи, учесть путь до апи
    }

    private _request<TResponse>(url: string, options: Options): Promise<TResponse> {
        const {
method, data, headers = {}, timeout = 5000
} = options;

        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open(method, url);
            xhr.timeout = timeout;

            // Устанавливаем заголовки
            Object.entries(headers).forEach(([key, value]) => {
                xhr.setRequestHeader(key, value);
            });

            xhr.onload = () => {
                try {
                    resolve(JSON.parse(xhr.responseText) as TResponse);
                } catch (error) {
                    reject(new Error(`Ошибка парсинга JSON: ${xhr.responseText}`));
                }
            };

            xhr.onerror = () => reject(new Error("Ошибка сети"));
            xhr.ontimeout = () => reject(new Error("Таймаут запроса"));
            xhr.onabort = () => reject(new Error("Запрос был прерван"));

            if (method === METHOD.GET || !data) {
                xhr.send();
            } else {
                xhr.setRequestHeader("Content-Type", "application/json");
                xhr.send(JSON.stringify(data));
            }
        });
    }

    private _buildQueryString(params?: Record<string, any>): string {
        if (!params) return "";
        const queryString = new URLSearchParams(params).toString();
        return queryString ? `?${queryString}` : "";
    }
}
