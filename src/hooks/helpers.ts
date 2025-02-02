import Handlebars from 'handlebars';

export function registerHelpers(): void {
    Handlebars.registerHelper('resolve-from-root', (path: string): string => {
        const root = '/src';
        return `${root}/${path}`.replace(/\/+/g, '/');
    });
}
