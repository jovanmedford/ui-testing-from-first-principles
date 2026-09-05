# Transformation & Module Resolution

Let's imagine we wanted to test a password validator. The validation rules are simple, a password must be 7 characters or longer and it must contain at least one special character.

This section uses typescript as a segue to discussing other areas of confusion: transformation and module resolution. These are further ingredients to your testing set up that are often hidden to you by your choice of bundler. 

## Running The Test
To run the test, simply run:

```bash
npm run build
npm run test
```

# 1. Transformation

Test runners use node or a browser-like environment to run your tests. This means that some of the syntax we write will not be natively understood by your testing environment. For eg. your browser will not be able to make sense of JSX on its own. For this reason, some testing set ups require an extra transformation (transpilation) step where we take the code from one syntax down to plain js.

In this step I'll use typescript since it keeps us to a small number of tools. Note however that node has native support for typescript these days so you can also run the tests without transformation.

## What Does This Look Like?

In our case, we will include a build script in our project that outputs the code and the tests in js. We will then run the js version of the tests.

```json
// tsconfig.json
{
    ...
    compilerOptions: {
    ...
    outDir: './dist'
    }
}
```


# 2. Module & Module Resolution

| Environment  | Module   | ModuleResolution | Description                                     |
| ------------ | -------- | ---------------- | ----------------------------------------------- |
| Node         | nodenext | nodenext         | Requires extension                              |
| Browser (UI) | esnext   | bundler          | Extensions are optional (resolved by bundler)   | 

JS tests run in different environments (node, browser-like). 

Typescript has special settings in the tsconfig that you can use to help typescript match the behaviour of the environment that runs your code.

**module** - sets the module system for the project. 

**moduleResolution** - sets the algorithm that will be used to determine how to find files based the import string.

## Why Does it matter?

A mismatch between these settings can result in the following:

- No typescript error but failing test set up due to files not being found.
- Typescript errors when the test set up is otherwise correct.

## Bonus: Experimenting with esnext + bundler
In the last step we will introduce a bundler. For UI tests, bundlers are used to abstract away the transformation and module resolution steps amongst many other things. However, we still need to let typescript know how to interpret import statements. 

1. Set the tsconfig compilerOptions to:

```json
    {
        "module": "esnext",
        "moduleResolution": "bundler",
    }
```

2. Remove the extensions from all imports:
   
```js
   // /3-transform-test/test/validate-password.test.ts 
   import validatePassword from "../validate-password";
```

```js
   // /3-transform-test/validate-password.ts
   import { hasSpecialCharacter, isRequired } from "./helpers";
```

 3. All of your files should be green and show no typescript errors.
 4. Run ```npm run build```
 5. Open `dist/test/validate-password.test.js` and see that the imports are still extensionless.
 6. Run ```npm run test``` -> you should get a not found error here.

This highlights that the tsconfig moduleResolution does not impact the output. It just tries to resolve the type information according to the option you have chosen. It is important to make sure your moduleResolution matches the behaviour of the bundler or environment you are using to avoid these issues.

