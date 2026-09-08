# Source Transformation & Module Resolution

Our third goal is to test a password validator written in TypeScript. The validator imports its individual checks from another file.

The validation rules are: a password must be 7 characters or longer and it must contain at least one special character.

## The code we want to run

Our validator is written in TypeScript and imports two checks from another file:

```ts
import {
  hasSpecialCharacter,
  isRequiredLength
} from "./helpers.js";

export default function validatePassword(password: string) {
  return isRequiredLength(password) && hasSpecialCharacter(password);
}
```

The `password: string` annotation is TypeScript syntax. The imported helpers also introduce a second concern: the runtime must be able to locate the module referenced by `"./helpers.js"`.

The `.js` extension may look surprising because the source file is named `helpers.ts`. We will return to that when we discuss module resolution.

## The path to execution

In this chapter, Node will run the emitted JavaScript rather than the TypeScript source directly:

```text
TypeScript source and tests
          ↓
   TypeScript compiler
          ↓
 JavaScript in `dist`
          ↓
    Node test runner
```

The TypeScript compiler has two relevant responsibilities in this process:

1. Emit JavaScript that Node can execute.
2. Check imports using resolution rules that model the eventual runtime.

The first responsibility introduces source transformation. The second introduces module resolution.

## Transforming Source Code

UI frameworks often allow developers to write code in syntax that is not native to browsers. For example, React developers write UI components in JSX, a syntax that lets you write HTML-like markup directly in JavaScript code. If you're testing React code written with JSX, it will need to be transformed into JavaScript calls that the browser can understand.

Remember, your test environment will either be a real browser or a Node environment with access to browser API implementations. In either case, any non-standard syntax will need to be transformed to regular JavaScript so it can be executed.

### Source Transformation in Our Password Validator

When the TypeScript compiler processes the validator, it removes the parameter's type annotation.

The TypeScript source contains:

```ts
export default function validatePassword(password: string) {
```

The emitted JavaScript contains:

```js
export default function validatePassword(password) {
```

The `: string` annotation has disappeared, while the executable JavaScript remains. The compiler writes that JavaScript to `dist/validate-password.js`, where Node can execute it.

Although modern Node can strip erasable TypeScript syntax directly, we use the TypeScript compiler here because it also type-checks our code, applies `tsconfig.json`, and makes the emitted JavaScript visible.

## Module Format

JavaScript code is rarely written in one file. Modules allow a file to expose values that another file can use. The JavaScript ecosystem has two dominant module formats:

- CommonJS (CJS), which uses `require` and `module.exports`.
- ECMAScript Modules (ESM), which uses `import` and `export`.

A file's module format determines how it expresses dependencies and exports, and how the host interprets them. This is separate from module resolution, which determines which file or package an import specifier refers to.

### Module Format in Our Password Validator

Our password validator uses ESM syntax. Its nearest `package.json` declares the module format to be ESM:

```json
{
  "type": "module"
}
```

When TypeScript is configured with `"module": "nodenext"`, it uses the nearest `package.json` to determine the module format of `.ts` and `.js` files. Here, `"type": "module"` means TypeScript treats the files as ESM and preserves their `import` and `export` statements in the emitted JavaScript. Node then executes the emitted `.js` files as ESM.

If this project needed to target CommonJS instead, identifying it as CommonJS in `package.json` would cause `nodenext` to emit CommonJS output. In either case, the emitted module format must match the format expected by the runtime. We'll see an example of this in chapter 4.

## Module Resolution

Once the runtime knows the module format, it still has to determine which file or package each import specifier refers to. This process is called module resolution. Some common forms of specifier are:

- Relative specifiers, such as `"./helpers.js"`.
- Bare specifiers, such as `"react"`.
- URL specifiers, such as `"https://example.com/module.js"`, in hosts that support URL imports.

The host is responsible for resolving these specifiers. Node and browsers each apply their own resolution rules. A build tool such as a bundler may resolve source imports before it reaches the host. However, it is ultimately the hosts' rules that will be applied to the emitted code.

## TypeScript Compilation and Configuration

We're writing our source code and tests in TypeScript.

The `module` option tells TypeScript how to interpret and emit module syntax. The `moduleResolution` option tells TypeScript which host's resolution rules to model while checking imports. TypeScript itself does not control how those imports are resolved at runtime; this remains the host's responsibility.

### Module Resolution in Our Password Validator

Our source directory contains `helpers.ts`, but the validator imports from `"./helpers.js"`:

```ts
import { hasSpecialCharacter, isRequiredLength } from "./helpers.js";
```

With `moduleResolution` set to `nodenext`, TypeScript understands that this specifier refers to `helpers.ts` while it checks the source code. It then preserves `"./helpers.js"` in the emitted JavaScript. When Node executes `dist/validate-password.js`, Node resolves that specifier to the generated `dist/helpers.js` file.

The `.js` extension is therefore written for the code that Node will execute, even though the corresponding source file uses a `.ts` extension.

### How Bundler Resolution Differs

Bundlers commonly allow extensionless relative specifiers such as `"./helpers"`. TypeScript's `bundler` resolution mode models that behavior and therefore accepts the extensionless import during compilation.

A mismatch can cause TypeScript to reject an import that the host could resolve, or allow an import that later fails when the host executes it.

There are quite a few options for these settings, but the two pairs most relevant to this chapter are:

| Intended loader | `module`  | `moduleResolution` | Relative ESM imports       |
| --------------- | --------- | ------------------ | -------------------------- |
| Node.js         | `nodenext` | `nodenext`         | Require explicit extensions |
| Bundler         | `esnext`   | `bundler`          | May be extensionless       |

### Configuring TypeScript for Node

We configure TypeScript to emit the application code and tests as JavaScript in `dist`, using settings that model Node:

```json
// tsconfig.json
{
  "compilerOptions": {
    "module": "nodenext",
    "moduleResolution": "nodenext",
    "outDir": "./dist",
    "types": ["node"]
  }
}
```

- `module: "nodenext"` tells TypeScript to model Node's module system. For ordinary `.ts` files, it uses the nearest `package.json` to determine whether to emit ESM or CommonJS.
- `moduleResolution: "nodenext"` checks imports using Node's module resolution rules.
- `outDir` writes the emitted JavaScript to the `dist` directory.
- `types: ["node"]` provides type declarations for Node APIs such as `node:test`.

## Running the tests

Compile the project and run the emitted tests:

```bash
npm run build
npm run test
```

The passing suite demonstrates that TypeScript emitted JavaScript whose module format and import specifiers Node can load successfully.

See the complete test suite in [`test/validate-password.test.ts`](./test/validate-password.test.ts).

## Demonstrating a Host Mismatch

Let's show what happens when your configuration doesn't match your host environment. We'll configure TypeScript as though a bundler will resolve the source files, even though we are running tests with Node directly.

1. Change the two module options in `tsconfig.json`:

   ```json
   {
     "module": "esnext",
     "moduleResolution": "bundler"
   }
   ```

2. Remove the `.js` extensions from the relative imports:

   ```ts
   // test/validate-password.test.ts
   import validatePassword from "../validate-password";
   ```

   ```ts
   // validate-password.ts
   import { hasSpecialCharacter, isRequiredLength } from "./helpers";
   ```

3. Compile the project:

   ```bash
   npm run build
   ```

   Compilation succeeds because `bundler` resolution allows extensionless relative imports.

4. Open `dist/test/validate-password.test.js`. The emitted import is still extensionless:

   ```js
   import validatePassword from "../validate-password";
   ```

5. Run the emitted tests:

   ```bash
   npm test
   ```

   Node cannot resolve the extensionless ESM import, so the test fails with an error similar to:

   ```text
   Error [ERR_MODULE_NOT_FOUND]: Cannot find module '.../dist/validate-password'
   ```

TypeScript accepted the import because it was modelling a bundler, but no bundler processed the emitted code. Node remained the actual host and applied its own module resolution rules. The `moduleResolution` option changed what TypeScript accepted during compilation; it did not change Node's resolver or rewrite the emitted specifier.

### Restore the Working Configuration

Set `module` and `moduleResolution` back to `nodenext`, restore the `.js` extensions in both imports, and then run `npm run build` followed by `npm test`.

## Takeaway

 Both your tests and source code need to be executed according to the rules of the host. If your code is written with non-standard JS, you will need to have it transformed. Similarly, you'll need to prepare your code so that the module format matches the host and module specifiers can be resolved according to the hosts' rules.

## Next step: Testing a React component with Jest

Chapter 1 introduced the test runner and assertion library. In chapter 2, we saw how to extend the environment by adding browser API implementations. This chapter shows how we can include non standard sytax and test code requiring multiple files. In doing so we covered complex topics such as module format and module resolution. In Chapter 4, we will bring these ingredients together to test a React component using Jest, jsdom, TypeScript, and React Testing Library.
