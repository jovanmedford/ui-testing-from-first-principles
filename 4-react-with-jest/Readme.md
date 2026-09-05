# Introduction To Testing React Components With Jest

Let's see how a React set up can require all of the ingredients we have encountered so far. First, let's introduce one more ingredient: testing utilities. 

## React Testing Library

[Testing library](https://testing-library.com/) is a family of libraries that simplifies ui testing and encourages best practices out of the box.

Testing library covers important functions such as:
- Rendering
- Querying for dom elements 
- User interactions

Specifcally, we'll be using [React Testing Library](https://testing-library.com/docs/react-testing-library/intro).

## Putting It All Together 

We'll go step by step.

1. Test runner & assertion library
Jest includes both a test runner and assertion library. 

2. Environment: jsdom
Since we are going to best testing UI components, we are going to need access to the DOM api. So jest out the box will not be enough. Instead we will add `jest-environment-jsdom` and specifiy the testEnvironment in the `jest.config.json`.

3. Transformation and module resolution
Let's deal with transformation first.

Since we're using Typescript and JSX, there's going to be syntax that jest won't be able to handle out of the box. There are lots of options for handling this for e.g introducing another tool like babel. However, we will use the typescript compiler to handle the transformation of both TS and JSX into js which we can use to run our tests.

Onto module resolution.

In step 3, we set the type in `package.json` to "module". This worked because we ran the test with node's test runner which can handle ESM. 

In step 4, we're going to set the type in `package.json` to "CommonJS" (default setting). This is because Jest out the box only understands CommonJs. Since our ts is using the module and module resolution of node, this means our build produce output according to the nearest package.json file. This means we'll get the CommonJs that our Jest tests need.

4. React Testing Library
We will use testing libray to simplify our tests. In particular we'll use it to render the component, query elements and fire a click interaction. Notice the emphasis that testing library places on getting elements by accessibility attributes.
