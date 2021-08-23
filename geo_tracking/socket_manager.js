 

const constants = require('./constants')
 
class RoomGeoTrackingManager {
  constructor (io) {
    this.io = io
    this.sockets = []
  }
  connect (socket) { 
    if (!this.sockets.find(s => s.id == socket.id)) {
      this.sockets.push(socket) 
      socket.join("RoomGeoTrackingManager")
    }
  }  
  disconnect(socket){
    if (this.sockets.find(s => s.id == socket.id)) 
      this.sockets = this.sockets.filter(i => i != socket);
  }
  updateLocation(socket, data){
    // if(data && data.uid && this.sockets.find(s => s.uid == data.uid)){
    //   var target = this.sockets.find(s => s.uid == data.uid);
    //   if(data.pro)
    //     target.emit(constants.onUpdating, {status : true, data: {pro : data.pro}})
    //   else if(data.user)
    //     target.emit(constants.onUpdating, {status : true, data: {user : data.user}})
    //   else 
    //     socket.emit(constants.onUpdating, {status : false, msg: "Missing location!"})
    // }else 
    //   socket.emit(constants.onUpdating, {status : false, msg: "Missing uid or can't find this target"})

    //For test
    if(data && data.uid){
      if(data.pro)
        this.io.to("RoomGeoTrackingManager").emit(constants.onUpdating, {status : true, data: {
          uid : data.uid,
          pro : data.pro
        }})
      else if(data.user)
        this.io.to("RoomGeoTrackingManager").emit(constants.onUpdating, {status : true, data: {
          uid : data.uid,
          user : data.user
        }})
      else 
        socket.emit(constants.onUpdating, {status : false, msg: "Missing location!"})
    }else 
      socket.emit(constants.onUpdating, {status : false, msg: "Missing uid!"})
  }
}
module.exports = RoomGeoTrackingManager