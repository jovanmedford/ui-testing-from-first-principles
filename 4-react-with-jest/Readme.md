# Testing React Components With Jest

Our fourth goal is to test a React component.

This chapter brings together all of the responsibilities introduced in the previous chapters: a test runner and assertion library, DOM APIs, source transformation, and module resolution.

We will also introduce React Testing Library. It provides utilities for rendering components and encourages tests that resemble how people use them.

## The component we want to test

The example is a tab interface containing four Danish composers. The data comes from the [w3 aria tabs example](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/examples/tabs-automatic/).


We leave the React components deliberately simple so you can clearly see the aria attributes we will use to test the component:

```tsx
export function DanishComposersTabs() {
  const [selectedTab, setSelectedTab] = useState("tab-1");
  const isSelected = (tabId: string) => selectedTab === tabId;

  return (
    <Tabs>
      <h3 id="tablist-1">Danish Composers</h3>

      <TabsHeader aria-labelledby="tablist-1">
        <TabTrigger
          id="tab-1"
          aria-selected={isSelected("tab-1")}
          aria-controls="tabpanel-1"
          onClick={() => setSelectedTab("tab-1")}
        >
          Maria Ahlefeldt
        </TabTrigger>

        {/* Three more tabs */}
      </TabsHeader>

      {/* The corresponding tab panels */}
    </Tabs>
  );
}
```

The component uses JSX, TypeScript types, imports from several files, and handles DOM events. Testing it therefore requires every layer that we have introduced so far.

See the complete component in [`component/example-components.tsx`](./component/example-components.tsx).

## The path to execution

Jest does not run the TypeScript and TSX source files directly in this project. The complete path is:

```text
TypeScript and TSX source
            ↓
    TypeScript compiler
            ↓
 CommonJS JavaScript in `dist`
            ↓
       Jest in Node +  DOM APIs supplied by jsdom
            ↓
 React Testing Library renders and interacts with the component
```

Each tool has a distinct responsibility:

| Responsibility                      | Provider                                             |
| ----------------------------------- | ---------------------------------------------------- |
| Execute and report tests            | Jest                                                 |
| Compare actual and expected results | Jest (Performs Assertion Library tasks as well)      |
| Transform TypeScript and JSX        | TypeScript compiler                                  |
| Check imports and emit modules      | TypeScript compiler                                  |
| Supply DOM APIs                     | `jest-environment-jsdom`                             |
| Render, query, and dispatch events  | React Testing Library                                |

## Transforming TypeScript and JSX

The source and test files contain syntax that Jest does not execute directly in this setup. TypeScript removes type annotations, and the `react-jsx` setting converts JSX into JavaScript calls to React's JSX runtime.

The relevant `tsconfig.json` settings are:

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "module": "nodenext",
    "moduleResolution": "nodenext",
    "outDir": "./dist",
    "types": ["node", "react"]
  }
}
```

For example, this TSX from the test:

```tsx
render(<DanishComposersTabs />);
```

is emitted as JavaScript that calls the JSX runtime:

```js
render(jsx(DanishComposersTabs, {}));
```

The exact emitted code contains some additional CommonJS interop syntax, but the important point is that Jest receives ordinary JavaScript rather than JSX.

## Module format and resolution

The source files use `import` and `export`, but the nearest `package.json` declares this package to be CommonJS:

```json
{
  "type": "commonjs"
}
```

With `module` set to `nodenext`, TypeScript uses that package declaration when deciding how to emit ordinary `.ts` and `.tsx` files. It transforms the source imports and exports into CommonJS `require` calls and `exports` assignments. Jest then loads the emitted CommonJS without requiring an additional ESM configuration.

The relative imports use `.js` extensions even though their source files end in `.tsx`:

```tsx
import { DanishComposersTabs } from "../component/example-components.js";
```

As in Chapter 3, `nodenext` resolution lets TypeScript associate this specifier with `example-components.tsx` while checking the source. TypeScript preserves the `.js` specifier in the emitted code, where it refers to `dist/component/example-components.js` at runtime.

## Configuring Jest

The Jest configuration connects the compiled tests to the browser-like environment:

```json
{
  "testEnvironment": "jsdom",
  "testMatch": ["<rootDir>/dist/**/*.test.js"],
  "transform": {}
}
```

Let's review each selection:

- `testEnvironment: "jsdom"` gives the tests browser-like globals such as `window`, `document`, and DOM event implementations.
- `testMatch` tells Jest to look for the emitted `.test.js` files under `dist`, rather than the `.test.tsx` source files.
- `transform: {}` disables Jest's code transformation. TypeScript handles the transformation instead.

Remember, the test still runs in Node. jsdom implements many web standards in memory, but it does not paint the component in a real browser.

## Testing Components Like They Will Be Used

[React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) and its [user-event companion](https://testing-library.com/docs/user-event/intro/) supply the utilities used by this test suite:

- `render` mounts the React component into jsdom's document.
- `screen` queries the document as a user or assistive technology would encounter it.
- `userEvent` simulates a user interaction, including the events involved in that interaction.

### Rendering and querying

The first test renders the component and queries it by semantic role:

```tsx
render(<DanishComposersTabs />);

screen.getByRole("tablist", { name: "Danish Composers" });
expect(screen.getAllByRole("tab")).toHaveLength(4);
```

`getByRole` uses the accessibility tree rather than an implementation detail such as a class name.

### Interacting with the component

The "selects a tab when it is clicked" test uses `user-event` to interact with the component:

```tsx
it("selects a tab when it is clicked", async () => {
  const user = userEvent.setup();
  render(<DanishComposersTabs />);

  await user.click(screen.getByRole("tab", { name: "Carl Andersen" }));

  screen.getByRole("tab", {
    name: "Carl Andersen",
    selected: true,
  });
  screen.getByRole("tabpanel", { name: "Carl Andersen" });
  expect(
    screen.queryByRole("tabpanel", { name: "Maria Ahlefeldt" })
  ).toBeNull();
});
```

The click invokes the component's event handler, React updates its state, and the rendered DOM changes.

Together, the tests verify that the component:

1. Renders a named tablist containing four tabs.
2. Exposes the initial selected state.
3. Updates the selected tab and visible panel after a click.

See the complete suite in [`test/example-components.test.tsx`](./test/example-components.test.tsx).

## Running the tests

Install the dependencies and run the suite:

```bash
npm ci
npm run build
npm run test
```

The build and test scripts run independently:

```json
{
  "scripts": {
    "build": "tsc",
    "test": "jest"
  }
}
```

A passing suite demonstrates that all of the layers agree: TypeScript can transform and resolve the source, Jest can load the emitted modules, jsdom can provide the required DOM APIs, and React Testing Library can exercise the rendered behavior.

## Takeaway

A React component test is supported by several layers working together.

In this chapter we tried to keep the layers separate so we can see what each bit does. Jest runs the tests and assertions. TypeScript transforms TypeScript and JSX into a module format Jest can load. The Jest jsdom environment provides browser-like APIs. React Testing Library renders the component and allows us to write readable tests that mimic how the component would be used.

Understanding these boundaries makes the setup less mysterious and makes configuration failures easier to locate. For example, syntax errors may point to transformation problems; loading errors may point to module format or resolution; and missing browser globals may point to the test environment.
