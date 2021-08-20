// 'use strict';

// const express = require('express');
// const socketIO = require('socket.io');
// const RoomSignalingManager = require('./signaling_socket/socket_manager')

// const PORT = process.env.PORT || 3000;
// const INDEX = '/index.html';

// const server = express()
//   .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
//   .listen(PORT, () => console.log(`Listening on ${PORT}`));

// const io = socketIO(server);

// //Setup manager in app
// io.signalingManager = new RoomSignalingManager(io)

// io.sockets.on("connection", (socket) => {

//   console.log(`On Connection ${socket.id}`)
//   socket.io = io;
//   _intializeSocket(socket)

//   socket.on("disconnect", () => {
//     console.log(`On Disconnect ${socket.id}`)
//   })
// })

// function _intializeSocket (socket) {
//   new (require('./signaling_socket/socket_control'))(socket) 
// }

'use strict';

const express = require('express');
const socketIO = require('socket.io');

const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';

const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = socketIO(server);

io.on('connection', (socket) => {
  console.log('Client connected');
  socket.on('disconnect', () => console.log('Client disconnected'));
});
