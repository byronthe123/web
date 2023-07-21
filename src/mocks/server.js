// src/mocks/server.js
import { setupServer } from 'msw/node';
import { handlers } from './handlers';
import { queueHandlers } from './queue/index';
import { refundRequestHandlers } from './refundRequest/index';
import { importHandlers } from './import';
import { dockHandlers } from './dock';

// This configures a request mocking server with the given request handlers.
export const server = setupServer(
    ...handlers,
    ...queueHandlers, 
    ...refundRequestHandlers,
    ...importHandlers,
    ...dockHandlers
);