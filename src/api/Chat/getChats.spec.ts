import {strict as assert} from "assert";
import sinon from "sinon";
import {getChats} from "./getChats.js";
import {HOST_URL} from "../../hooks/route.js";

describe("getChats()", () => {
    let fetchStub: sinon.SinonStub;

    beforeEach(() => {
        fetchStub = sinon.stub(global, "fetch");
    });

    afterEach(() => {
        fetchStub.restore();
    });

    it("возвращает список чатов", async () => {
        const mockChats = [{id: 1, title: "General"}, {id: 2, title: "Random"}];

        fetchStub.resolves(new Response(JSON.stringify(mockChats), {
            status: 200,
            headers: {"Content-Type": "application/json"}
        }));

        const result = await getChats();

        assert.deepEqual(result, mockChats);
        assert.ok(fetchStub.calledOnce);
        assert.equal(fetchStub.firstCall.args[0], `${HOST_URL}/chats`);
    });

    it("ошибка", async () => {
        fetchStub.resolves(new Response("Ошибка доступа", {status: 403}));

        await assert.rejects(() => getChats(), {
            message: "Ошибка доступа"
        });
    });
});
