const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Relay offer to another peer
    socket.on('offer', (offer, targetSocketId) => {
        socket.to(targetSocketId).emit('offer', offer, socket.id);
    });

    // Relay answer to another peer
    socket.on('answer', (answer, targetSocketId) => {
        socket.to(targetSocketId).emit('answer', answer);
    });

    // Relay ICE candidates between peers
    socket.on('ice-candidate', (candidate, targetSocketId) => {
        socket.to(targetSocketId).emit('ice-candidate', candidate);
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Signaling server running on http://localhost:${PORT}`);
});
