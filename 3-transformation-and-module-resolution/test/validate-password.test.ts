import validatePassword from "../validate-password.js";
import { describe, it } from "node:test"
import assert from "node:assert";

describe("validate password", () => {
    it("passes - a valid string", () => {
        assert.strictEqual(validatePassword("abcd!fg"), true)
    })

    it("fails - empty string", () => {
        assert.strictEqual(validatePassword(""), false)
    })

    it("fails - too short", () => {
        assert.strictEqual(validatePassword("a!"), false)
    })

    it("fails - no special character", () => {
        assert.strictEqual(validatePassword("abcdefg"), false)
    })
})
