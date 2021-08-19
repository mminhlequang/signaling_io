 
const constants = require('./constants')
const Room = require('./socket_room')
 
class RoomSignalingManager {
  constructor (io) {
    this.io = io
    this.rooms = []
  }
  join (socket, data) {
    if (!data || !data.id) { 
      return console.log('Room id empty!')
    }
    if (this.rooms.length == 0 || !this.rooms.find(r => r.id == data.id)) {
      let room = new Room(this, data.id)
      room.join(socket)
      this.rooms.push(room)
      socket.emit(constants.emitInfo, { status: true, msg: 'You are key member!' })
    } else {
      let room = this.rooms.find(r => r.id == data.id)
      this.io.to(room.id).emit(constants.emitJoin, { status: true, data: {socketId : socket.id} })
      socket.emit(constants.emitInfo, { status: true, msg: 'Join success!' })
      room.join(socket) 
    }
  } 
  // 'room': id,
  // 'socket': socket,
  // 'sdp': {'sdp': sdp, 'type': 'offer'},
  offer (socket, data) {
    if(!data || !data.room || !data.socket || !data.sdp) return this.print('offer', 'Params missing')
    this.print('offer', {socketId: socket.id})
    if(this.getRoom(data.room) && this.getRoom(data.room).socket(data.socket)){
      this.print('offer', {socketId: socket.id})
      this.getRoom(data.room)
        .socket(data.socket)
        .emit(constants.emitOffer, { status: true, data: {socketId: socket.id, sdp: data.sdp} })
    }
  }
  // 'room': id,
  // 'socket': socket,
  // 'sdp': {'sdp': s.sdp, 'type': s.type.toString().toLowerCase()},
  answer(socket, data) { 
    if(!data || !data.room || !data.to || !data.sdp) return this.print('answer', 'Params missing')
    if(this.getRoom(data.room) && this.getRoom(data.room).socket(data.to)){ 
      this.print('answer', {socketId: data.to})
      this.getRoom(data.room)
        .socket(data.to)
        .emit(constants.emitAnswer, { status: true, data: {socketId: socket.id, sdp: data.sdp} })
    }
  }
  // 'to': id,
  // 'candidate': {
  //   'sdpMLineIndex': candidate.sdpMlineIndex,
  //   'sdpMid': candidate.sdpMid,
  //   'candidate': candidate.candidate,
  // },
  // 'session_id': this._sessionId,
  candidate(socket, data) { 
    if(!data || !data.room || !data.to || !data.candidate) return this.print('candidate', 'Params missing')
    if(this.getRoom(data.room) && this.getRoom(data.room).socket(data.to)){
      this.print('candidate', {socketId: socket.id})
      this.getRoom(data.room)
        .socket(data.to)
        .emit(constants.emitCandidate, { status: true, data: {socketId: data.to, candidate : data.candidate} })
    }
  }
  // 'room': id
  bye (socket, data) {
    if(!data || !data.room) return;
    if(this.getRoom(data.room)){
      this.getRoom(data.room).leave(socket)
      this.io.to(this.getRoom(data.room).id).emit(constants.emitBye, { status: true, data: {socketId : socket.id} }) 
      if(this.getRoom(data.room).sockets.length == 0)
        this.rooms = this.rooms.filter(i => i != socket);
    }
  }
  getRoom(id){
    return this.rooms.find(r => r.id == id)
  }
  print(func, data){
    console.log('[RoomSignalingManager] ' + func + ':', data)
  }
}
module.exports = RoomSignalingManager