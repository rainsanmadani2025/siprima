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
  Calendar,
  Clock,
  User,
  AlertCircle,
  CheckCircle2,
  Inbox,
  Paperclip,
  Search,
  Filter,
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
    id: 'user-parent-1',
    name: 'Bapak Ahmad Fauzi',
    role: 'ORTU'
  })
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
      console.log('Connected to chat service')
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
      // Refresh conversations
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
    socketInstance.on('message:new', (data) => {
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
      <div className="pb-4">
        <h1 className="text-3xl font-bold text-gray-900">Komunikasi dengan Sekolah</h1>
        <p className="text-gray-600 mt-1">Kirim pesan dan lapor ketidakhadiran anak</p>
        <Button
          variant="outline"
          onClick={() => router.push('/dashboard/ortu')}
          className="mt-4 gap-2 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 active:scale-95 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Beranda
        </Button>
      </div>

      {/* Statistik */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Inbox className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {messages.filter(m => m.receiverId === currentUser.id).length}
                </p>
                <p className="text-sm text-gray-600">Pesan Masuk</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                <Send className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {messages.filter(m => m.senderId === currentUser.id).length}
                </p>
                <p className="text-sm text-gray-600">Pesan Terkirim</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{conversations.length}</p>
                <p className="text-sm text-gray-600">Percakapan</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {messages.filter(m => m.receiverId === currentUser.id && !m.isRead).length}
                </p>
                <p className="text-sm text-gray-600">Belum Dibaca</p>
              </div>
            </div>
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
                <Send className="w-6 h-6 text-emerald-600" />
                Kirim Pesan Baru
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Pilih Penerima</label>
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
                    <label className="text-sm font-medium text-gray-700">Subjek (Opsional)</label>
                    <Input
                      placeholder="Masukkan subjek pesan"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Pesan</label>
                  <Textarea
                    placeholder="Tulis pesan Anda di sini..."
                    className="min-h-[150px]"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    onClick={sendMessage}
                    disabled={!newMessage.trim() || !selectedReceiver}
                    className="bg-gradient-to-r from-emerald-500 to-teal-500"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Kirim Pesan
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Riwayat Pesan */}
        <TabsContent value="riwayat-pesan">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-6 h-6 text-blue-600" />
                  Riwayat Pesan
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-8">
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
                          ? 'border-l-4 border-l-emerald-500'
                          : 'border-l-4 border-l-blue-500 bg-blue-50/50'
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                pesan.senderId === currentUser.id ? 'bg-emerald-100' : 'bg-blue-100'
                              }`}
                            >
                              {pesan.senderId === currentUser.id ? (
                                <Send className="w-4 h-4 text-emerald-600" />
                              ) : (
                                <Inbox className="w-4 h-4 text-blue-600" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 text-sm">{pesan.sender.name}</p>
                              <p className="text-xs text-gray-500">
                                ke: {pesan.receiver.name} • {formatDate(pesan.createdAt)} {formatTime(pesan.createdAt)}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            {pesan.senderId !== currentUser.id && !pesan.isRead && (
                              <Badge
                                className="bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer"
                                onClick={() => markAsRead(pesan.id, pesan.senderId)}
                              >
                                Tandai Dibaca
                              </Badge>
                            )}
                            {pesan.isRead && (
                              <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200">
                                Dibaca
                              </Badge>
                            )}
                          </div>
                        </div>
                        {pesan.subject && (
                          <p className="text-sm font-semibold text-gray-900 mb-2">{pesan.subject}</p>
                        )}
                        <p className="text-gray-700 text-sm leading-relaxed">{pesan.content}</p>
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
                <Phone className="w-6 h-6 text-purple-600" />
                Kontak Sekolah
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {receivers.map((receiver) => (
                    <div key={receiver.id} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{receiver.name}</p>
                        <p className="text-gray-700">{receiver.role}</p>
                        <Button
                          size="sm"
                          variant="outline"
                          className="mt-2"
                          onClick={() => {
                            setSelectedReceiver(receiver.id)
                            router.push('/dashboard/ortu/komunikasi')
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
                      <p className="text-gray-700">Kantor: (021) 8775-xxxx</p>
                      <p className="text-gray-700">WhatsApp: 0812-3456-xxxx</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Mail className="w-4 h-4 text-emerald-600" />
                        Email
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700">info@ra-insanmadani.sch.id</p>
                      <p className="text-gray-700">admin@ra-insanmadani.sch.id</p>
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
                      <p className="text-gray-700">Senin - Jumat: 07:00 - 14:00</p>
                      <p className="text-gray-700">Sabtu: 08:00 - 12:00</p>
                      <p className="text-gray-700">Minggu: Libur</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Catatan */}
      <Card className="bg-emerald-50 border-emerald-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <MessageSquare className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold text-emerald-900">Catatan</p>
              <p className="text-emerald-800">
                Pesan yang Anda kirim akan langsung diterima oleh guru atau admin jika mereka sedang online.
                Respon biasanya diberikan dalam 1x24 jam pada hari kerja. Untuk keadaan darurat, silakan hubungi
                nomor telepon sekolah langsung.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </DashboardLayout>
  )
}
