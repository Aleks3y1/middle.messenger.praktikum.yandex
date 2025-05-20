import {strict as assert} from "assert";
import sinon from "sinon";
import {XHRTransport} from "./XHRTransport.js";

describe("XHRTransport (простой)", () => {
    it("выполняет GET-запрос", async () => {
        const xhr = new XHRTransport("/api");
        const requestStub = sinon.stub(xhr as any, "_request").resolves({user: "Aleksey77"});
        const result = await xhr.get("/test", {name: "Aleksey77"});
        const args = requestStub.firstCall.args as [string, any];

        assert.ok(requestStub.calledOnce);
        assert.ok(args[0].includes("/api/test?name=Aleksey77"));
        assert.equal(args[1].method, "GET");
        assert.deepEqual(result, {user: "Aleksey77"});

        requestStub.restore();
    });
});
