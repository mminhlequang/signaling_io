

const constants = require('./constants')

class SocketControl {
  constructor (socket) {
    this.socket = socket 
    this.onUpdating() 
  }
  onUpdating () {
    const self = this
    self.socket.on(constants.onUpdating, (data) => {
      console.log('onUpdating', data)
      self.socket.io.geoTrackingManager.updateLocation(self.socket, data)
    })
  } 
}
module.exports = SocketControl