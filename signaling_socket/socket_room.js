

class Room {
  constructor (manager, id) {
    this.id = id
    this.manager = manager
    this.sockets = []
  }
  join (socket) {
    if (!this.sockets.includes(socket)){
      socket.join(this.id)
      this.sockets.push(socket)
    }
  }
  leave (socket) {
    this.sockets = this.sockets.filter(i => i != socket);
  }

  socket(id){
    return this.sockets.find(s => s.id == id)
  }
}
module.exports = Room