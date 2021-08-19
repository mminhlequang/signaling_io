
const express = require('express')
const http = require('http')
const RoomSignalingManager = require('./signaling_socket/socket_manager')

const app = express()


app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,accesstoken");
  next();
});

const httpServer = http.createServer(app)
const io = require('socket.io').listen(httpServer)
app.start = app.listen = function () {
  return httpServer.listen.apply(httpServer, arguments)
}

//Setup manager in app
io.signalingManager = new RoomSignalingManager(io)

io.sockets.on("connection", (socket) => {

  console.log(`On Connection ${socket.id}`)
  socket.io = io;
  _intializeSocket(socket)

  socket.on("disconnect", () => {
    console.log(`On Disconnect ${socket.id}`)
  })
})

app.start(3000, () => console.log('App listening on port 3000!'))

function _intializeSocket (socket) {
  new (require('./signaling_socket/socket_control'))(socket) 
}