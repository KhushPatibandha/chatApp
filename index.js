const { Socket } = require('dgram');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// thing that is left is to emit to all the connected users that the particular user is connected.



// only works if some event listeners on client side are not there.
io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
        io.emit('chat message', (msg))
    })
})

io.on('connection', (socket) => {
  socket.on('connect', (msg) => {
    io.emit('chat message', (msg))
  })
})

// io.on('connection', (socket) => {
//   socket.on('disconnect', (msg) => {
//     io.emit('user disconnected', (msg))
//   })
// })


// this one works now.
// io.on('connection', (socket) => {
//     io.emit('chat message', "a user connected");
//     console.log('a user connected');
//     socket.on('disconnect', () => {
//         console.log('a user diconnected');
//         io.emit('chat message', "a user disconnected")
//     })
// })

server.listen(3000, () => {
  console.log('listening on *:3000');
});