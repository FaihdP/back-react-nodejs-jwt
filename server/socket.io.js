import server from './index.js'
import { Server as SocketServer } from 'socket.io'

const io = new SocketServer(server, {
  cors: {
    origin: 'http://localhost:3000'
  }
})

// Socket's event
io.on('connection', (socket) => {
  socket.on('client: connectChatGroup', (idGroup) => {
    socket.join(idGroup)
  })

  socket.on('client: sendMessage', ({ idGroup, name, message }) => {
    io.to(idGroup).emit('server: sendMessage', { name, message })
  })
})
