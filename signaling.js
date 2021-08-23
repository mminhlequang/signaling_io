'use strict';

const express = require('express');
const socketIO = require('socket.io');
const RoomSignalingManager = require('./signaling_socket/socket_manager')
const RoomGeoTrackingManager = require('./geo_tracking/socket_manager')

const PORT = 3737;
const INDEX = '/index.html';

const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}...`));

const io = socketIO(server);
//Setup manager in app
io.signalingManager = new RoomSignalingManager(io)
io.geoTrackingManager = new RoomGeoTrackingManager(io)

let total = 0
io.sockets.on("connection", (socket) => {

  //UID for geotracking
  if(socket.handshake.query.uid){
    socket.uid = socket.handshake.query.uid;
  } 
  io.geoTrackingManager.connect(socket)
  

  console.log(`On Connection ${socket.id}`)
  total = total + 1;
  io.emit('signaling_logs', total)
  socket.io = io;
  _intializeSocket(socket)

  socket.on("disconnect", () => {
    console.log(`On Disconnect ${socket.id}`)
    io.geoTrackingManager.disconnect(socket)
    total = total - 1;
    io.emit('signaling_logs', total)
  })
})

function _intializeSocket (socket) {
  new (require('./signaling_socket/socket_control'))(socket) 
  new (require('./geo_tracking/socket_control'))(socket) 
}
