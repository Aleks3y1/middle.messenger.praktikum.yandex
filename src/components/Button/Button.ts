import Handlebars from "handlebars";
import Block from "../../base/Block";

interface ButtonProps {
    buttonText: string;
    type?: string;
}

export class Button extends Block {
    constructor(props: ButtonProps) {
        super("button", props);
    }

    render(): string {
        return Handlebars.compile(`{{> button type=type buttonText=buttonText }}`)(this.props);
    }
}
