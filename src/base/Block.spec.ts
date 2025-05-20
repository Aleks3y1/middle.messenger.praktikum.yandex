import {strict as assert} from "assert";
import Block from "./Block.js";
import globalJsdom from "global-jsdom";

before(() => {
    globalJsdom();
});

class TestBlock extends Block {
    protected render(): string {
        return `<span>${this.props.message}</span>`;
    }
}

describe("Block", () => {
    it("должен рендерить содержимое", () => {
        const block = new TestBlock("div", {message: "Проверка"});
        const content = block.getContent();

        assert.ok(content instanceof HTMLElement);
        assert.ok(content.innerHTML.includes("Проверка"));
    });

    it("возвращает элемент через getContent", () => {
        const block = new TestBlock("section", {message: "123"});
        const content = block.getContent();

        assert.equal(content?.tagName, "SECTION");
    });
});
