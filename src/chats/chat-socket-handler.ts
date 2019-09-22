import { wrapSocketHandler, SocketHandler } from '../framework/service/handlers'

import { ChatService } from './chat-service'
import { Socket, Server } from 'socket.io'
import { Message } from '.'

function leaveAllRooms(socket: Socket): void {
  Object.keys(socket.rooms).forEach(room => socket.leave(room))
}

function sendToRoom(server: Server, room: string, message: Message): void {
  server.to(room).emit('chat message', message)
}

export function buildChatSocketHandler(service: ChatService): SocketHandler {
  return wrapSocketHandler((server, socket): void => {
    leaveAllRooms(socket)
    socket.on('join', newRoom => {
      leaveAllRooms(socket)
      socket.join(newRoom)
    })
    socket.on('chat message', message => {
      Object.keys(socket.rooms).forEach(room => {
        const msg: Message = { room, message, date: new Date() }
        service.received(msg)({ id: socket.id })
        sendToRoom(server, room, msg)
      })
    })
  })
}
