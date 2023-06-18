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


var users = [];

// only works if some event listeners on client side are not there.
io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
        socket.broadcast.emit('chat message', (msg))
    });
})

io.on('connection', (socket) => {
  users.push({id: socket.id, name: "user" + socket.id});
  console.log('a user connected', users);
  
  socket.on("disconnect", (SOCKET) => {
    console.log(users)
    users.map((value)=>{
      if(value.id == socket.id){
        console.log("user disconnected", value.name);
      }
  });
  });

  socket.on('connect', (msg) => {
    io.emit('chat message', (msg))
  })

  
});

io.on('connection', (socket) => {
  socket.on("someone-connected", (username)=>{
    console.log("someone connected, ready to send users list", username);
    socket.broadcast.emit("someone-connected-msg", username);
  });

  socket.on("set-username", (username)=>{
    console.log("username received from", socket.id, username)
    users.map((value)=>{
      if(value.id == socket.id){
        value.name = username;
      }
    });
  });

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