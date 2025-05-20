import Handlebars from 'handlebars';

export function registerHelpers(): void {
    Handlebars.registerHelper('resolve-from-root', (path: string): string => {
        const root = '/src';
        return `${root}/${path}`.replace(/\/+/g, '/');
    });
    Handlebars.registerHelper("formatChatTime", function (time: string) {
        if (!time) return "";

        const date = new Date(time);
        const now = new Date();

        const isToday = date.toDateString() === now.toDateString();
        if (isToday) return date.toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"});

        const yesterday = new Date();
        yesterday.setDate(now.getDate() - 1);
        if (date.toDateString() === yesterday.toDateString()) return "Вчера";

        const isSameWeek = now.getTime() - date.getTime() < 7 * 24 * 60 * 60 * 1000;
        if (isSameWeek) return date.toLocaleDateString("ru-RU", {weekday: "short"});

        return date.toLocaleDateString("ru-RU", {
            day: "numeric",
            month: "short",
            year: date.getFullYear() === now.getFullYear() ? undefined : "numeric"
        });
    });
}

export function registerPartials(): void {
    Handlebars.registerPartial("button", "{{> button }}");
}


