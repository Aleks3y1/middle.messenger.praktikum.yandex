import {strict as assert} from "assert";
import sinon from "sinon";
import {authorization} from "./authorization.js";
import {HOST_URL} from "../../hooks/route.js";

describe("authorization (fetch)", () => {
    let fetchStub: sinon.SinonStub;

    beforeEach(() => {
        fetchStub = sinon.stub(global, "fetch");
    });

    afterEach(() => {
        fetchStub.restore();
    });

    it("запрос выполняется", async () => {
        fetchStub.resolves(new Response(null, {status: 200}));

        await authorization("users", "123456");

        assert.ok(fetchStub.calledOnce);

        const [url, options] = fetchStub.firstCall.args;
        assert.equal(url, `${HOST_URL}/auth/signin`);
        assert.equal(options.method, "POST");
        assert.equal(options.headers["Content-Type"], "application/json");
        assert.equal(options.credentials, "include");
        assert.equal(options.mode, "cors");

        const body = JSON.parse(options.body);
        assert.deepEqual(body, {login: "users", password: "123456"});
    });

    it("выбрасывает ошибку", async () => {
        fetchStub.resolves(new Response("Неверные данные", {status: 401}));

        await assert.rejects(() => authorization("wrong", "wrong"), {
            message: "Неверные данные"
        });
    });
});
