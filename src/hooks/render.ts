import Block from "../base/Block.ts";

export function render(query: string, block: Block): void {
    const root = document.querySelector(query);
    if (root) {
        root.innerHTML = '';
        root.appendChild(block.getContent());
    }
}
