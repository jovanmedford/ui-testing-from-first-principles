import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import renderCounter from "../counter.js";

const domEnvironment = new JSDOM();
globalThis.window = domEnvironment.window;
globalThis.document = domEnvironment.window.document;

beforeEach(() => {
    document.body.replaceChildren();
    renderCounter(document.body);
});

test("starts at zero", () => {
    assert.strictEqual(document.getElementById("count").textContent, "0");
});

test("clicking increment adds one", () => {
    document.querySelector('[aria-label="increment"]').click();

    assert.strictEqual(
        document.getElementById("count").textContent,
        "1"
    );
});

test("clicking decrement subtracts one", () => {
    document.querySelector('[aria-label="decrement"]').click();
    assert.strictEqual(document.getElementById("count").textContent, "-1");
});
