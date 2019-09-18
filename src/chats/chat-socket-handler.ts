import { SocketHandler } from '..'
import { ChatService } from './chat-service'
import { Socket, Server } from 'socket.io'
import { Message } from '.'

function leavAllRooms(socket: Socket) {
  Object.keys(socket.rooms).forEach(room => socket.leave(room))
}

function sendToRoom(server: Server, room: string, message: Message): void {
  server.to(room).emit('chat message', message)
}

export function buildChatSocketHandler(service: ChatService): SocketHandler {
  return (server, socket) => {
    leavAllRooms(socket)
    socket.on('join', newRoom => {
      leavAllRooms(socket)
      socket.join(newRoom)
    })
    socket.on('chat message', message => {
      Object.keys(socket.rooms).forEach(room => {
        const msg: Message = { room, message, date: new Date() }
        service.received(msg)
        sendToRoom(server, room, msg)
      })
    })
  }
}
