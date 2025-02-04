declare module '*.hbs' {
    const content: string;
    export default content;
}

declare module 'vite-plugin-handlebars' {
    import { Plugin } from 'vite';

    interface HandlebarsOptions {
        partialDirectory?: string;
        context?: Record<string, any>;
    }

    function handlebars(options?: HandlebarsOptions): Plugin;
    export default handlebars;
}
