import { io } from 'socket.io-client';

// Use your backend URL and port (change if needed)
const socket = io('http://localhost:5000');

export default socket;
