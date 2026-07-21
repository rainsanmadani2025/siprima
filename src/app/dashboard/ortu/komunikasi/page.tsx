'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  MessageSquare,
  Send,
  Phone,
  Mail,
  Clock,
  User,
  AlertCircle,
  CheckCircle2,
  Inbox,
  ArrowLeft,
  Users
} from 'lucide-react'
import { io, Socket } from 'socket.io-client'
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"

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

export default function KomunikasiPage() {
  const router = useRouter()

  // State
  const [currentUser, setCurrentUser] = useState<User>({
    id: '',
    name: '',
    role: ''
  })

  // Load user from localStorage
  useEffect(() => {
    const userId = localStorage.getItem('userId') || ''
    const userName = localStorage.getItem('userName') || ''
    const userRole = localStorage.getItem('userRole') || ''
    if (userId) {
      setCurrentUser({
        id: userId,
        name: userName,
        role: userRole.toUpperCase()
      })
    }
  }, [])

  const [messages, setMessages] = useState<Message[]>([])
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [subject, setSubject] = useState('')
  const [selectedReceiver, setSelectedReceiver] = useState<string>('')
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isTyping, setIsTyping] = useState(false)
  const [typingUser, setTypingUser] = useState<string | null>(null)

  // Daftar penerima (guru dan kepsek)
  const receivers = [
    { id: 'user-teacher-1', name: 'Ibu Siti Aminah', role: 'GURU' },
    { id: 'user-kepsek-1', name: 'Ibu Hj. Nurul Hidayah', role: 'KEPSEK' },
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
      const userId = localStorage.getItem('userId') || ''
      const userName = localStorage.getItem('userName') || ''
      const userRole = localStorage.getItem('userRole') || ''
      console.log('Connected to chat service')
      socketInstance.emit('user:join', {
        userId,
        role: userRole.toUpperCase(),
        name: userName
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

    // New message notification (for unread count)
    socketInstance.on('message:new', () => {
      fetchConversations()
    })

    setSocket(socketInstance)

    return () => {
      socketInstance.disconnect()
    }
  }, [])

  // Initial data fetch
  useEffect(() => {
    if (currentUser.id) {
      fetchMessages()
      fetchConversations()
    }
  }, [fetchMessages, fetchConversations, currentUser.id])

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

      // Emit read notification via WebSocket
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

  // Filter messages by conversation
  const filteredMessages = selectedConversation
    ? messages.filter(
        msg =>
          (msg.senderId === currentUser.id && msg.receiverId === selectedConversation) ||
          (msg.senderId === selectedConversation && msg.receiverId === currentUser.id)
      )
    : messages

  return (
    <DashboardLayout role="ortu" userName="Bapak/Ibu Orang Tua">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Komunikasi dengan Sekolah</h1>
            <p className="text-muted-foreground mt-2">Kirim pesan dan lapor ketidakhadiran anak</p>
          </div>
          <Button
            variant="outline"
            onClick={() => router.push('/dashboard/ortu')}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </Button>
        </div>

        {/* Statistik */}
        <div className="grid gap-4 md:grid-cols-4">
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
              <p className="text-xs text-muted-foreground mt-1">Laporan & info</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Percakapan</CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{conversations.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Komunikasi aktif</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Belum Dibaca</CardTitle>
              <AlertCircle className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">
                {messages.filter(m => m.receiverId === currentUser.id && !m.isRead).length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Perlu ditindak</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="kirim-pesan" className="space-y-4">
          <TabsList className="grid grid-cols-3 w-full bg-white border">
            <TabsTrigger value="kirim-pesan">
              <Send className="w-4 h-4 mr-2" />
              Kirim Pesan
            </TabsTrigger>
            <TabsTrigger value="riwayat-pesan">
              <MessageSquare className="w-4 h-4 mr-2" />
              Riwayat Pesan
            </TabsTrigger>
            <TabsTrigger value="kontak-sekolah">
              <Phone className="w-4 h-4 mr-2" />
              Kontak Sekolah
            </TabsTrigger>
          </TabsList>

          {/* Tab Kirim Pesan */}
          <TabsContent value="kirim-pesan">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="w-5 h-5" />
                  Kirim Pesan Baru
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Pilih Penerima</label>
                    <Select value={selectedReceiver} onValueChange={setSelectedReceiver}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih penerima pesan" />
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
                    <label className="text-sm font-medium">Subjek (Opsional)</label>
                    <Input
                      placeholder="Masukkan subjek pesan"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Pesan</label>
                  <Textarea
                    placeholder="Tulis pesan Anda di sini..."
                    className="min-h-[150px]"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    onClick={sendMessage}
                    disabled={!newMessage.trim() || !selectedReceiver}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Kirim Pesan
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Riwayat Pesan */}
          <TabsContent value="riwayat-pesan">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 w-5" />
                  Riwayat Pesan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  {filteredMessages.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      <MessageSquare className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                      <p>Belum ada pesan</p>
                    </div>
                  ) : (
                    filteredMessages.map((pesan) => (
                      <Card
                        key={pesan.id}
                        className={`${
                          pesan.senderId === currentUser.id
                            ? 'border-l-4 border-l-green-500'
                            : 'border-l-4 border-l-blue-500 bg-blue-50/50'
                        }`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                  pesan.senderId === currentUser.id ? 'bg-green-100' : 'bg-blue-100'
                                }`}
                              >
                                {pesan.senderId === currentUser.id ? (
                                  <Send className="w-4 h-4 text-green-600" />
                                ) : (
                                  <Inbox className="w-4 h-4 text-blue-600" />
                                )}
                              </div>
                              <div>
                                <p className="font-medium text-sm">{pesan.sender.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  ke: {pesan.receiver.name} • {formatDate(pesan.createdAt)} {formatTime(pesan.createdAt)}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              {pesan.senderId !== currentUser.id && !pesan.isRead && (
                                <Badge
                                  className="bg-amber-100 text-amber-800 hover:bg-amber-200 cursor-pointer"
                                  onClick={() => markAsRead(pesan.id, pesan.senderId)}
                                >
                                  <AlertCircle className="w-3 h-3 mr-1" />
                                  Tandai Dibaca
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
                            <p className="text-sm font-semibold mb-2">{pesan.subject}</p>
                          )}
                          <p className="text-sm text-gray-700 leading-relaxed">{pesan.content}</p>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Kontak Sekolah */}
          <TabsContent value="kontak-sekolah">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Kontak Sekolah
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    {receivers.map((receiver) => (
                      <div key={receiver.id} className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-semibold">{receiver.name}</p>
                          <p className="text-sm text-muted-foreground">{receiver.role}</p>
                          <Button
                            size="sm"
                            variant="outline"
                            className="mt-2"
                            onClick={() => {
                              setSelectedReceiver(receiver.id)
                            }}
                          >
                            <MessageSquare className="w-3 h-3 mr-1" />
                            Kirim Pesan
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                          <Phone className="w-4 h-4 text-purple-600" />
                          Kontak Telepon
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">Kantor: (021) 8775-xxxx</p>
                        <p className="text-sm">WhatsApp: 0812-3456-xxxx</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                          <Mail className="w-4 h-4 text-green-600" />
                          Email
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">info@ra-insanmadani.sch.id</p>
                        <p className="text-sm">admin@ra-insanmadani.sch.id</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                          <Clock className="w-4 h-4 text-amber-600" />
                          Jam Operasional
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">Senin - Jumat: 07:00 - 14:00</p>
                        <p className="text-sm">Sabtu: 08:00 - 12:00</p>
                        <p className="text-sm">Minggu: Libur</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}