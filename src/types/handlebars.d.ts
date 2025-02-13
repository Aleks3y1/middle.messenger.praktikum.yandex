declare module "*.hbs" {
    const template: (context?: any) => string;
    export default template;
}
declare module 'vite-plugin-handlebars' {
    import {Plugin} from 'vite';

    interface HandlebarsOptions {
        partialDirectory?: string;
        context?: Record<string, any>;
    }

    function handlebars(options?: HandlebarsOptions): Plugin;

    export default handlebars;
}
