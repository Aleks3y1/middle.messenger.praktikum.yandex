import {strict as assert} from "assert";
import sinon from "sinon";
import {Router} from "./Router.js";
import {Route} from "./Route.js";
import Block from "../base/Block.js";

class DummyBlock extends Block {
    protected render(): string {
        return "<div>dummy</div>";
    }
}

describe("Router", () => {
    let router: Router;

    beforeEach(() => {
        (Router as any).__instance = undefined;
        router = new Router("#app");
    });

    it("проверка use()", () => {
        router.use("/test", DummyBlock);
        const route = (router as any).routes.find((r: Route) => r.match("/test"));
        assert.ok(route);
    });

    it("go вызывает render", () => {
        router.use("/test", DummyBlock);
        const route = (router as any).routes.find((r: Route) => r.match("/test"));
        const renderSpy = sinon.spy(route!, "render");

        router.go("/test");
        assert.ok(renderSpy.calledOnce);
    });

    it("start вызывает _onRoute", () => {
        router.use(window.location.pathname, DummyBlock);
        const route = router["getRoute"](window.location.pathname);
        const renderSpy = sinon.spy(route!, "render");

        router.start();
        assert.ok(renderSpy.calledOnce);
    });

    it("getRoute возвращает Route", () => {
        router.use("/abc", DummyBlock);
        const route = router["getRoute"]("/abc");
        assert.ok(route instanceof Route);
    });

    it("проверка leave", () => {
        router.use("/one", DummyBlock).use("/two", DummyBlock);

        const route1 = router["getRoute"]("/one")!;
        const leaveSpy = sinon.spy(route1, "leave");

        router.go("/one");
        router.go("/two");

        assert.ok(leaveSpy.calledOnce);
    });
});
