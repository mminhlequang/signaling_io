

const constants = require('./constants')

class SocketControl {
  constructor (socket) {
    this.socket = socket
    this.socket.socketControl = this
    this.onJoin() 
    this.onOffer()
    this.onAnswer()
    this.onCandidate()
    this.onBye()
  }
  onJoin () {
    const self = this
    self.socket.on(constants.onJoin, (data) => {
      this.print('join', self.socket.id)
      self.socket.io.signalingManager.join(self.socket, data)
    })
  }
  onOffer () {
    const self = this
    self.socket.on(constants.onOffer, (data) => {
      this.print('offer', self.socket.id)
      self.socket.io.signalingManager.offer(self.socket, data)
    })
  }
  onAnswer () {
    const self = this
    self.socket.on(constants.onAnswer, (data) => {
      this.print('answer', self.socket.id)
      self.socket.io.signalingManager.answer(self.socket, data)
    })
  }
  onCandidate () {
    const self = this
    self.socket.on(constants.onCandidate, (data) => {
      this.print('candidate', self.socket.id)
      self.socket.io.signalingManager.candidate(self.socket, data)
    })
  }
  onBye () {
    const self = this
    self.socket.on(constants.onBye, (data) => {
      this.print('bye', self.socket.id)
      self.socket.io.signalingManager.bye(self.socket, data)
    })
  }

  print(func, data){
    console.log('[SocketControl] ' + func + ':', data)
  }
}
module.exports = SocketControl