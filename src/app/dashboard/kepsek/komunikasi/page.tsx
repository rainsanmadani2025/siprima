'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MessageSquare, Send, FileText, Reply, CheckCircle2, Users, Inbox, AlertCircle } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { io, Socket } from 'socket.io-client'

interface Message {
  id: string
  senderId: string
  receiverId: string
  subject?: string | null
  content: string
  isRead: boolean
  createdAt: string
  sender: {
    id: string
    name: string
    role: string
    avatar?: string | null
  }
  receiver: {
    id: string
    name: string
    role: string
    avatar?: string | null
  }
}

interface Conversation {
  partnerId: string
  partnerName: string
  partnerRole: string
  partnerAvatar?: string | null
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
}

interface User {
  id: string
  name: string
  role: string
  avatar?: string | null
}

export default function KepsekKomunikasiPage() {
  // State
  const [currentUser, setCurrentUser] = useState<User>({
    id: 'user-kepsek-1',
    name: 'Ibu Hj. Nurul Hidayah',
    role: 'KEPSEK'
  })
  const [messages, setMessages] = useState<Message[]>([])
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [subject, setSubject] = useState('')
  const [selectedReceiver, setSelectedReceiver] = useState<string>('')
  const [socket, setSocket] = useState<Socket | null>(null)
  const [typingUser, setTypingUser] = useState<string | null>(null)

  // Daftar penerima (guru, orang tua, admin)
  const receivers = [
    { id: 'user-teacher-1', name: 'Ibu Siti Aminah', role: 'GURU' },
    { id: 'user-parent-1', name: 'Bapak Ahmad Fauzi', role: 'ORTU' },
    { id: 'user-parent-2', name: 'Ibu Aisyah Putri', role: 'ORTU' },
    { id: 'user-admin-1', name: 'Ibu Ratna Sari', role: 'ADMIN' }
  ]

  // Fetch messages
  const fetchMessages = useCallback(async () => {
    try {
      const response = await fetch(`/api/messages?userId=${currentUser.id}`)
      const data = await response.json()
      setMessages(data.messages || [])
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }, [currentUser.id])

  // Fetch conversations
  const fetchConversations = useCallback(async () => {
    try {
      const response = await fetch(`/api/conversations?userId=${currentUser.id}`)
      const data = await response.json()
      setConversations(data.conversations || [])
    } catch (error) {
      console.error('Error fetching conversations:', error)
    }
  }, [currentUser.id])

  // Initialize WebSocket connection
  useEffect(() => {
    const socketInstance = io('/', {
      query: { XTransformPort: 3003 },
      transports: ['websocket', 'polling']
    })

    socketInstance.on('connect', () => {
      console.log('Kepsek connected to chat service')
      // Register user
      socketInstance.emit('user:join', {
        userId: currentUser.id,
        role: currentUser.role,
        name: currentUser.name
      })
    })

    // Receive new message
    socketInstance.on('message:receive', (data) => {
      setMessages(prev => [data, ...prev])
      fetchConversations()
    })

    // Message read notification
    socketInstance.on('message:read', (data) => {
      setMessages(prev =>
        prev.map(msg =>
          msg.id === data.messageId ? { ...msg, isRead: true } : msg
        )
      )
    })

    // Typing indicator
    socketInstance.on('typing:indicator', (data) => {
      if (data.isTyping) {
        setTypingUser(data.name)
      } else {
        setTypingUser(null)
      }
    })

    // New message notification
    socketInstance.on('message:new', () => {
      fetchConversations()
    })

    setSocket(socketInstance)

    return () => {
      socketInstance.disconnect()
    }
  }, [currentUser])

  // Initial data fetch
  useEffect(() => {
    fetchMessages()
    fetchConversations()
  }, [fetchMessages, fetchConversations])

  // Send message
  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedReceiver) return

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: currentUser.id,
          receiverId: selectedReceiver,
          subject: subject || undefined,
          content: newMessage.trim()
        })
      })

      const data = await response.json()

      // Emit message via WebSocket
      if (socket && data.message) {
        const receiver = receivers.find(r => r.id === selectedReceiver)
        socket.emit('message:send', {
          messageId: data.message.id,
          senderId: currentUser.id,
          senderName: currentUser.name,
          senderRole: currentUser.role,
          receiverId: selectedReceiver,
          receiverName: receiver?.name,
          receiverRole: receiver?.role,
          subject: data.message.subject,
          content: data.message.content,
          createdAt: data.message.createdAt
        })
      }

      setNewMessage('')
      setSubject('')
      fetchMessages()
      fetchConversations()
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  // Mark message as read
  const markAsRead = async (messageId: string, senderId: string) => {
    try {
      await fetch(`/api/messages/${messageId}/read`, { method: 'PUT' })

      if (socket) {
        socket.emit('message:read', {
          messageId,
          readerId: currentUser.id,
          senderId
        })
      }

      setMessages(prev =>
        prev.map(msg =>
          msg.id === messageId ? { ...msg, isRead: true } : msg
        )
      )
    } catch (error) {
      console.error('Error marking message as read:', error)
    }
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Komunikasi</h1>
          <p className="text-muted-foreground mt-2">Kelola komunikasi dengan guru dan orang tua</p>
        </div>
      </div>

      {/* Statistik Komunikasi */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pesan</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{messages.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Semua pesan</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pesan Masuk</CardTitle>
            <Inbox className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {messages.filter(m => m.receiverId === currentUser.id).length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Belum dibaca: {messages.filter(m => m.receiverId === currentUser.id && !m.isRead).length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pesan Terkirim</CardTitle>
            <Send className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {messages.filter(m => m.senderId === currentUser.id).length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Laporan & agenda</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Percakapan Aktif</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{conversations.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Komunikasi aktif</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Form Kirim Pesan */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Kirim Pesan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Penerima</label>
              <Select value={selectedReceiver} onValueChange={setSelectedReceiver}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih penerima" />
                </SelectTrigger>
                <SelectContent>
                  {receivers.map((receiver) => (
                    <SelectItem key={receiver.id} value={receiver.id}>
                      {receiver.name} ({receiver.role})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Judul (Opsional)</label>
              <Input
                placeholder="Contoh: Pengumuman Penting"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Isi Pesan</label>
              <Textarea
                placeholder="Tulis pesan Anda di sini..."
                rows={6}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Lampiran (Opsional)</label>
              <Button variant="outline" className="w-full">
                <FileText className="mr-2 h-4 w-4" />
                Unggah File
              </Button>
            </div>

            <Button
              className="w-full"
              onClick={sendMessage}
              disabled={!newMessage.trim() || !selectedReceiver}
            >
              <Send className="mr-2 h-4 w-4" />
              Kirim Pesan
            </Button>
          </CardContent>
        </Card>

        {/* Riwayat Pesan */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Riwayat Pesan
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <MessageSquare className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p>Belum ada pesan</p>
                </div>
              ) : (
                messages.map((pesan) => (
                  <div
                    key={pesan.id}
                    className={`flex gap-3 p-4 rounded-lg border ${
                      pesan.senderId === currentUser.id ? '' : 'bg-blue-50 dark:bg-blue-950/20'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-white flex-shrink-0 ${
                        pesan.senderId === currentUser.id ? 'bg-green-600' : 'bg-blue-600'
                      }`}
                    >
                      {pesan.senderId === currentUser.id ? (
                        <Send className="h-5 w-5" />
                      ) : (
                        <MessageSquare className="h-5 w-5" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <h4 className="font-medium text-sm">{pesan.sender.name}</h4>
                          <p className="text-xs text-muted-foreground">
                            {pesan.sender.role} • {formatDate(pesan.createdAt)}, {formatTime(pesan.createdAt)}
                          </p>
                        </div>
                        <div className="flex gap-2 items-center">
                          {pesan.senderId !== currentUser.id && !pesan.isRead && (
                            <Badge
                              className="bg-amber-100 text-amber-800 hover:bg-amber-200 cursor-pointer"
                              onClick={() => markAsRead(pesan.id, pesan.senderId)}
                            >
                              <AlertCircle className="w-3 h-3 mr-1" />
                              Belum Dibaca
                            </Badge>
                          )}
                          {pesan.isRead && (
                            <Badge className="bg-emerald-100 text-emerald-800">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Dibaca
                            </Badge>
                          )}
                        </div>
                      </div>
                      {pesan.subject && (
                        <p className="text-sm font-semibold text-gray-900 mb-1">{pesan.subject}</p>
                      )}
                      <p className="text-sm mt-2">{pesan.content}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
