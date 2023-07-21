import { io } from 'socket.io-client';

const server =
    process.env.REACT_APP_ENV === 'test'
        ? 'http://localhost:3002'
        : process.env.REACT_APP_ENV === 'staging'
        ? 'http://eos-web-backend-staging.azurewebsites.net'
        : 'https://eos-web-backend.azurewebsites.net';

// const server =  'http://localhost:3002';     
console.log(server);

export const socket = io(server);
socket.on('connect', () => {
    console.log('connected to server');
});
//export const SocketContext = React.createContext();
