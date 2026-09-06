import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import setupCounter from "../setup-counter.js";

// ─────────────────────────────────────────────────────────────────────────
// This demonstrates the CORE IDEA behind Jest/Vitest's jsdom environment:
// build a JSDOM instance and expose browser-like globals (document, window)
// so code under test can reach the DOM without importing anything.
//
// It is a mental model, not a literal reimplementation. One honest caveat:
// real environments don't bulk-copy window onto global — a naive
// Object.assign(globalThis, dom.window) breaks (self-referential window.window,
// eager getters, read-only props) — so they install globals carefully and
// provide many more than the two below (HTMLElement, navigator, location,
// storage, requestAnimationFrame, MutationObserver, ...).
//
// The JSDOM instance is created ONCE for the whole file, mirroring how a
// framework builds its jsdom environment once per test file (not per test).
// ─────────────────────────────────────────────────────────────────────────
const dom = new JSDOM();
globalThis.window = dom.window;
globalThis.document = dom.window.document;

const template = `
  <span id="count" aria-label="count">0</span>
  <button aria-label="decrement">-</button>
  <button aria-label="increment">+</button>
`;

beforeEach(() => {
    // Reset to a known state before each test. Assigning innerHTML discards the
    // previous test's elements (and their listeners), so state can't leak. This
    // is the role a framework fills with afterEach cleanup — done on entry here
    // so a test that throws can't leave the next one with dirty state.
    document.body.innerHTML = template;
    setupCounter();
});

// From here down, the test body is identical to what you'd write under
// Jest/Vitest with `environment: "jsdom"`. The only difference between this
// file and a framework test is the setup above — and that is the core of what
// the framework's environment option automates.

test("starts at zero", () => {
    assert.equal(document.getElementById("count").textContent, "0");
});

test("clicking increment adds one", () => {
    document.querySelector('[aria-label="increment"]').click();
    assert.equal(document.getElementById("count").textContent, "1");
});

test("clicking decrement subtracts one", () => {
    document.querySelector('[aria-label="decrement"]').click();
    assert.equal(document.getElementById("count").textContent, "-1");
});
