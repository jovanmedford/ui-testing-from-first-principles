# UI Testing Setups From First Principles

Component tests help us trust that individual pieces of an application work as intended. For those tests to be meaningful, the test environment should try to mimic the parts of the production environment that those components rely on. Building that environment is where our challenge lies.

This repository can be useful to you if:

- You want to understand how UI Applications are put together in general
- You have a non-standard testing set up and have experienced cryptic errors
- You are just curious to learn more about testing

We'll split testing set ups into 3 rough layers and then bring it all together in chapter 4.

## Chapters

1. [Test runner and assertion library](./1-test-runner-and-assertion-library/Readme.md) — Test a pure JavaScript function with Node's built-in runner and assertion library.
2. [Browser APIs](./2-browser-apis/Readme.md) — Add browser capabilities to a Node test environment and test a vanilla JavaScript counter.
3. [Source transformation and module resolution](./3-transformation-and-module-resolution/ReadMe.md) — Compile TypeScript, trace imports into the emitted JavaScript, and see what happens when resolution rules do not match the runtime.
4. [React components with Jest](./4-react-with-jest/Readme.md) — The payoff. This chapter combines all we've learned so far to test a tabs component. It introduces Jest and React Testing Library.

## Running the examples

Each chapter has its own project and instructions. Run its commands from that chapter's directory. The examples were developed with Node.js 24.14.1, recorded in [`.nvmrc`](./.nvmrc).
