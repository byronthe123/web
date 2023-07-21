
import '@testing-library/jest-dom';
import "@testing-library/jest-dom/extend-expect";
import 'jest-canvas-mock';

// src/setupTests.js
import { server } from './mocks/server.js'
// Establish API mocking before all tests.
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished.
afterAll(() => server.close());

window.crypto = { subtle: {} };

window.alert = jest.fn();
global.open = jest.fn();
window.get = jest.fn();

global.navigator = {
    userAgent: 'node.js'
};

const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    clear: jest.fn()
};

global.localStorage = localStorageMock;

global.MutationObserver = class {
    constructor(callback) {}
    disconnect() {}
    observe(element, initObject) {}
};