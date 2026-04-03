import { Server } from 'socket.io'

const io = new Server({
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
})

// Simpan user yang online
const onlineUsers = new Map<string, { userId: string; role: string; name: string }>()

io.on('connection', (socket) => {
  console.log('User connected:', socket.id)

  // User join (mendaftar diri dengan user ID)
  socket.on('user:join', (userData: { userId: string; role: string; name: string }) => {
    onlineUsers.set(socket.id, userData)

    // Broadcast ke semua user bahwa user ini online
    io.emit('user:online', {
      userId: userData.userId,
      name: userData.name,
      role: userData.role
    })

    // Kirim daftar user online ke user yang baru join
    const onlineUsersList = Array.from(onlineUsers.values())
    socket.emit('users:online', onlineUsersList)

    console.log(`User ${userData.name} (${userData.role}) joined`)
  })

  // Kirim pesan
  socket.on('message:send', (data: {
    messageId: string
    senderId: string
    senderName: string
    senderRole: string
    senderAvatar?: string
    receiverId: string
    receiverName: string
    receiverRole: string
    subject?: string
    content: string
    parentId?: string
    createdAt: string
  }) => {
    // Cari socket receiver
    let receiverSocket: string | null = null
    for (const [socketId, user] of onlineUsers.entries()) {
      if (user.userId === data.receiverId) {
        receiverSocket = socketId
        break
      }
    }

    // Kirim pesan ke receiver jika online
    if (receiverSocket) {
      io.to(receiverSocket).emit('message:receive', {
        ...data
      })
      console.log(`Message sent from ${data.senderName} to ${data.receiverName}`)
    } else {
      console.log(`Receiver ${data.receiverName} is offline`)
    }

    // Broadcast pesan baru ke semua user (untuk update unread count)
    io.emit('message:new', {
      messageId: data.messageId,
      senderId: data.senderId,
      receiverId: data.receiverId,
      createdAt: data.createdAt
    })
  })

  // Broadcast pengumuman baru ke semua user
  socket.on('announcement:new', (data: any) => {
    console.log('New announcement:', data.title)
    // Broadcast ke semua user yang connected
    io.emit('announcement:new', data)
  })

  // Broadcast portfolio baru ke user terkait
  socket.on('portfolio:new', (data: any) => {
    console.log('New portfolio:', data.title, 'for student:', data.studentId)
    // Broadcast ke semua user yang connected (termasuk orang tua siswa tersebut)
    io.emit('portfolio:new', data)
  })

  // Broadcast raport baru ke user terkait
  socket.on('report:new', (data: any) => {
    console.log('New report:', data.id, 'for student:', data.studentId, 'semester:', data.semester)
    // Broadcast ke semua user yang connected (termasuk orang tua siswa tersebut)
    io.emit('report:new', data)
  })

  // Tandai pesan sudah dibaca
  socket.on('message:read', (data: { messageId: string; readerId: string; senderId: string }) => {
    // Cari socket sender
    let senderSocket: string | null = null
    for (const [socketId, user] of onlineUsers.entries()) {
      if (user.userId === data.senderId) {
        senderSocket = socketId
        break
      }
    }

    // Kirim notifikasi ke sender bahwa pesan sudah dibaca
    if (senderSocket) {
      io.to(senderSocket).emit('message:read', {
        messageId: data.messageId,
        readerId: data.readerId
      })
    }
  })

  // User sedang mengetik
  socket.on('typing:start', (data: { userId: string; receiverId: string; name: string }) => {
    // Cari socket receiver
    let receiverSocket: string | null = null
    for (const [socketId, user] of onlineUsers.entries()) {
      if (user.userId === data.receiverId) {
        receiverSocket = socketId
        break
      }
    }

    // Kirim notifikasi typing ke receiver
    if (receiverSocket) {
      io.to(receiverSocket).emit('typing:indicator', {
        userId: data.userId,
        name: data.name,
        isTyping: true
      })
    }
  })

  // User berhenti mengetik
  socket.on('typing:stop', (data: { userId: string; receiverId: string }) => {
    // Cari socket receiver
    let receiverSocket: string | null = null
    for (const [socketId, user] of onlineUsers.entries()) {
      if (user.userId === data.receiverId) {
        receiverSocket = socketId
        break
      }
    }

    // Kirim notifikasi stop typing ke receiver
    if (receiverSocket) {
      io.to(receiverSocket).emit('typing:indicator', {
        userId: data.userId,
        isTyping: false
      })
    }
  })

  // User disconnect
  socket.on('disconnect', () => {
    const userData = onlineUsers.get(socket.id)
    if (userData) {
      onlineUsers.delete(socket.id)

      // Broadcast ke semua user bahwa user ini offline
      io.emit('user:offline', {
        userId: userData.userId,
        name: userData.name,
        role: userData.role
      })

      console.log(`User ${userData.name} (${userData.role}) disconnected`)
    }
  })
})

// Start server pada port 3003
const PORT = 3003
io.listen(PORT)

console.log(`Chat service running on port ${PORT}`)
console.log(`WebSocket URL: ws://localhost:${PORT}`)
