# The Ingredients of UI Testing

This repository aims to decompose the elements that make a ui testing set up. The goal is to show how each part works and thereby remove the mystery involved in performing component tests especially.

**Note: tests were developed using node version 24.14.1**

## 1. Test Runner & Assertion Library
Highlights the the difference between a test runner and an assertion library. The smallest unit for running javascript tests.


## 2. Browser APIs
Adds browser APIs to our Node test environment, using the DOM and jsdom as the primary example.

### 3. Transformation & Module Resolution
Typescript and React both use syntax that browsers do not natively understand. This step shows how you can introduce a transpilation step in order to run non-native syntax in your tests.

### 4. Jest, React & Testing Library
Putting everything together, we see how to run unit tests using Jest and React Testing Library.

### 5. Vitest (To Do)
We show the most modern approach to running ui tests.
