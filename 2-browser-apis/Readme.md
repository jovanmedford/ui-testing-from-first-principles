# Browser APIs in a Node Test Environment

Our second goal is to test a counter made with vanilla JavaScript.

In Chapter 1 we saw how to run a simple test suite using only Node.

Web application frontends run in a browser. A browser provides us with the [DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model) and plenty of other [Web APIs](https://developer.mozilla.org/en-US/docs/Web/API) for working with events, storage, media, network requests, and more.

The [DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model) is an interface that provides a data representation of a document, such as a web page. It also defines methods for interacting with the page by manipulating that representation.

Node implements some web-compatible APIs, but it does not provide a DOM implementation out of the box. We will add one using [jsdom](https://github.com/jsdom/jsdom).

## How are the responsibilities shared?

Here's a breakdown of how the layers fit together so far:

| Responsibility                      | Provider      | Status                  |
| ----------------------------------- | ------------- | ----------------------- |
| Execute and report tests            | `node:test`   | Retained from Chapter 1 |
| Compare actual and expected results | `node:assert` | Retained from Chapter 1 |
| Supply DOM APIs                     | `jsdom`       | Added in Chapter 2      |

## Counter

![Counter after three increment actions, showing a decrement button, the current value of three, and an increment button.](../assets/chapter-2-counter.png)

*The counter after clicking increment three times.*

The counter simply consists of two buttons and a display that shows the current count.

## Adding a DOM implementation with jsdom

Creating a `JSDOM` instance gives us a browser-like `window` with a `document`:

```js
import { JSDOM } from "jsdom";

const domEnvironment = new JSDOM();

globalThis.window = domEnvironment.window;
globalThis.document = domEnvironment.window.document;
```

Assigning these objects to `globalThis` makes `window` and `document` available to the application in the places where a browser would normally provide them.

Installing jsdom alone would not accomplish this. We have to create an environment and expose the APIs that our code expects.

## Rendering the counter

```js
export default function renderCounter(container) {
  const counter = document.createElement("div");
  counter.innerHTML = counterMarkup;

  // ...query elements and attach event listeners...

  container.append(counter);
  return counter;
}
```

See the complete implementation in [`counter.js`](./counter.js).

Each test should begin with a new counter:

```js
beforeEach(() => {
    document.body.replaceChildren();
    renderCounter(document.body);
});
```

`replaceChildren` removes the elements created by the previous test. `renderCounter` then creates a new counter, attaches new event listeners, and appends it to the document body.

Here, "rendering" means creating and inserting DOM elements.

**`jsdom` does not perform visual layout or paint pixels to a screen.**

## Testing through the DOM

The test can now interact with the counter through the `document` object supplied by jsdom:

```js
test("clicking increment adds one", () => {
    document.querySelector('[aria-label="increment"]').click();

    assert.strictEqual(
        document.getElementById("count").textContent,
        "1"
    );
});
```

The test queries a DOM element, dispatches a click, and reads the resulting text. The runner and assertion library have not changed.

The query selector uses the `aria-label` attribute to retrieve the button. In Chapter 4, React Testing Library will let us locate the same button through its semantic role and accessible name instead of a CSS selector.

See the complete test suite in [`test/counter.test.js`](./test/counter.test.js).

## Running the test suite

Install the dependency and run the tests:

```bash
npm ci
npm test
```

The passing tests demonstrate that code executing in Node can now create and interact with DOM elements.

## The boundary of this environment

Our test process is still running in Node. We have added browser-like objects to its global scope, but we have not turned Node into a browser.

This is also a deliberately small teaching model. A framework-managed jsdom environment installs more globals, provides stronger isolation, and handles setup/teardown for us. Furthermore, jsdom implements many web standards, but it does not implement every browser API. It does not perform layout or visual rendering. Tools such as Playwright run tests in real browsers, where those capabilities are available.

## Takeaway

UI code depends on APIs supplied by its host environment. For example, the browser provides the DOM. Node does not have a DOM implementation by default, so we added `jsdom` so that we can test a counter made with vanilla JS.

## Next step: Transformation and module resolution

We can now test simple functions and behavior that depends on the DOM. The next chapter introduces TypeScript. In the past, Node did not have the ability to interpret TS syntax. So we will show how to compile to JavaScript before running the tests. The same transformation concept also applies to non-standard syntax used by UI frameworks, such as JSX. Examining the transformation will help us understand how source syntax, emitted modules and the host environment must work together.

Later, we will assemble the full React setup in Chapter 4. There, Jest's `testEnvironment: "jsdom"` option will take ownership of the DOM setup shown here, and React Testing Library will provide higher-level tools for rendering, querying, and interacting with the resulting document.
