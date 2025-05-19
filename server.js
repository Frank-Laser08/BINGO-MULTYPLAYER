// File: server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

let calledNumbers = new Set();

function getRandomNumber() {
  if (calledNumbers.size >= 75) return null;
  let num;
  do {
    num = Math.floor(Math.random() * 75) + 1;
  } while (calledNumbers.has(num));
  calledNumbers.add(num);
  return num;
}

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  calledNumbers.forEach((num) => {
    socket.emit('number-called', num);
  });

  socket.on('call-number', () => {
    const number = getRandomNumber();
    if (number) {
      io.emit('number-called', number);
    }
  });

  socket.on('reset', () => {
    calledNumbers = new Set();
    io.emit('reset');
  });
});

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
