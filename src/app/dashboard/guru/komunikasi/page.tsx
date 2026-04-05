'use client'

import { useState, useEffect, useCallback } from 'react'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MessageSquare, Send, FileText, CheckCircle2, Users, Inbox, AlertCircle, Loader2, Upload, X, CheckCircle, Edit, Trash2, User } from 'lucide-react'
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

export default function GuruKomunikasiPage() {
  // State
  const [currentUser, setCurrentUser] = useState<User>({
    id: '',
    name: '',
    role: 'GURU'
  })
  const [userLoading, setUserLoading] = useState(true)
  const [messages, setMessages] = useState<Message[]>([])
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [messagesLoading, setMessagesLoading] = useState(true)
  const [conversationsLoading, setConversationsLoading] = useState(true)
  const [newMessage, setNewMessage] = useState('')
  const [subject, setSubject] = useState('')
  const [selectedReceiver, setSelectedReceiver] = useState<string>('')
  const [socket, setSocket] = useState<Socket | null>(null)
  const [sending, setSending] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [attachmentUrl, setAttachmentUrl] = useState('')

  // Daftar penerima (orang tua, kepsek, admin, guru lain)
  const [receivers, setReceivers] = useState<Array<{ id: string; name: string; role: string }>>([])

  // Edit mode states
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null)
  const [editSubject, setEditSubject] = useState('')
  const [editContent, setEditContent] = useState('')
  const [saving, setSaving] = useState(false)
  const [deletingMessageId, setDeletingMessageId] = useState<string | null>(null)

  // Load user from localStorage
  useEffect(() => {
    const userId = localStorage.getItem('userId')
    const userName = localStorage.getItem('userName')
    const userRole = localStorage.getItem('userRole')

    if (userId && userName) {
      setCurrentUser({
        id: userId,
        name: userName,
        role: userRole || 'GURU'
      })
    } else {
      // Default values for testing
      setCurrentUser({
        id: 'user-teacher-1',
        name: 'Ibu Siti Aminah',
        role: 'GURU'
      })
    }
    setUserLoading(false)
  }, [])

  // Fetch receivers (parents, admin, etc.)
  useEffect(() => {
    const fetchReceivers = async () => {
      try {
        const userId = localStorage.getItem('userId')
        const url = userId
          ? `/api/users/receivers?role=GURU&userId=${userId}`
          : '/api/users/receivers?role=GURU'

        const response = await fetch(url)
        const data = await response.json()
        if (data.success && data.receivers) {
          setReceivers(data.receivers)
        } else {
          // Default receivers for fallback
          setReceivers([
            { id: 'user-kepsek-1', name: 'Ibu Hj. Nurul Hidayah', role: 'KEPSEK' },
            { id: 'user-admin-1', name: 'Ibu Ratna Sari', role: 'ADMIN' }
          ])
        }
      } catch (error) {
        console.error('Error fetching receivers:', error)
        // Default receivers for fallback
        setReceivers([
          { id: 'user-kepsek-1', name: 'Ibu Hj. Nurul Hidayah', role: 'KEPSEK' },
          { id: 'user-admin-1', name: 'Ibu Ratna Sari', role: 'ADMIN' }
        ])
      }
    }
    fetchReceivers()
  }, [])

  // Fetch messages
  const fetchMessages = useCallback(async () => {
    if (!currentUser.id) return

    try {
      setMessagesLoading(true)
      const response = await fetch(`/api/messages?userId=${currentUser.id}`)
      const data = await response.json()
      setMessages(data.messages || [])
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setMessagesLoading(false)
    }
  }, [currentUser.id])

  // Fetch conversations
  const fetchConversations = useCallback(async () => {
    if (!currentUser.id) return

    try {
      setConversationsLoading(true)
      const response = await fetch(`/api/conversations?userId=${currentUser.id}`)
      const data = await response.json()
      setConversations(data.conversations || [])
    } catch (error) {
      console.error('Error fetching conversations:', error)
    } finally {
      setConversationsLoading(false)
    }
  }, [currentUser.id])

  // Initialize WebSocket connection
  useEffect(() => {
    if (!currentUser.id || socket) return

    const socketInstance = io('/', {
      query: { XTransformPort: 3003 },
      transports: ['websocket', 'polling']
    })

    socketInstance.on('connect', () => {
      console.log('Guru connected to chat service')
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

    // New message notification
    socketInstance.on('message:new', () => {
      fetchConversations()
    })

    setSocket(socketInstance)

    return () => {
      socketInstance.disconnect()
    }
  }, [currentUser.id, currentUser.role, currentUser.name])

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
      setSending(true)

      // Append attachment URL to content if exists
      let messageContent = newMessage.trim()
      if (attachmentUrl) {
        messageContent += `\n\n[File Terlampir: ${attachmentUrl}]`
      }

      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: currentUser.id,
          receiverId: selectedReceiver,
          subject: subject || undefined,
          content: messageContent
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
      setAttachmentUrl('')
      setSelectedFile(null)
      fetchMessages()
      fetchConversations()
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Gagal mengirim pesan')
    } finally {
      setSending(false)
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

  // Handle file select for attachment
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    const allowedDocTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ]
    const allowedTypes = [...allowedImageTypes, ...allowedDocTypes]

    if (!allowedTypes.includes(file.type)) {
      alert('Tipe file tidak didukung. Hanya gambar (JPEG, PNG, GIF, WebP) dan dokumen (PDF, Word, Excel) yang diizinkan')
      return
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB

    if (file.size > maxSize) {
      alert('Ukuran file terlalu besar. Maksimal 5MB')
      return
    }

    setSelectedFile(file)
  }

  // Handle file upload
  const handleUpload = async () => {
    if (!selectedFile) return

    try {
      setUploading(true)
      const formData = new FormData()
      formData.append('file', selectedFile)

      const response = await fetch('/api/messages/upload', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (data.success) {
        setAttachmentUrl(data.fileUrl)
      } else {
        throw new Error(data.error || 'Gagal mengupload file')
      }
    } catch (error: any) {
      console.error('Error uploading file:', error)
      alert(error.message || 'Gagal mengupload file')
    } finally {
      setUploading(false)
    }
  }

  // Handle remove file
  const handleRemoveFile = () => {
    setSelectedFile(null)
    setAttachmentUrl('')
  }

  // Start edit mode
  const startEdit = (message: Message) => {
    setEditingMessageId(message.id)
    setEditSubject(message.subject || '')
    setEditContent(message.content)
  }

  // Cancel edit mode
  const cancelEdit = () => {
    setEditingMessageId(null)
    setEditSubject('')
    setEditContent('')
  }

  // Save edited message
  const saveEdit = async (messageId: string) => {
    if (!editContent.trim()) return

    try {
      setSaving(true)
      const response = await fetch(`/api/messages/${messageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: editSubject || undefined,
          content: editContent
        })
      })

      const data = await response.json()

      if (data.success) {
        // Update messages state
        setMessages(prev =>
          prev.map(msg =>
            msg.id === messageId
              ? { ...msg, subject: data.message.subject, content: data.message.content }
              : msg
          )
        )
        cancelEdit()
      } else {
        throw new Error(data.error || 'Gagal mengupdate pesan')
      }
    } catch (error: any) {
      console.error('Error updating message:', error)
      alert(error.message || 'Gagal mengupdate pesan')
    } finally {
      setSaving(false)
    }
  }

  // Delete message
  const deleteMessage = async (messageId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus pesan ini?')) return

    try {
      setDeletingMessageId(messageId)
      const response = await fetch(`/api/messages/${messageId}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        // Remove message from state
        setMessages(prev => prev.filter(msg => msg.id !== messageId))
        fetchConversations()
      } else {
        throw new Error(data.error || 'Gagal menghapus pesan')
      }
    } catch (error: any) {
      console.error('Error deleting message:', error)
      alert(error.message || 'Gagal menghapus pesan')
    } finally {
      setDeletingMessageId(null)
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

  if (userLoading) {
    return (
      <DashboardLayout role="guru" userName="Memuat...">
        <div className="flex items-center justify-center min-h-[600px]">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="guru" userName={currentUser.name || 'Ibu Guru'}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Komunikasi Orang Tua</h1>
            <p className="text-muted-foreground mt-2">Kelola komunikasi dengan orang tua siswa</p>
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
              <CardTitle className="text-sm font-medium">Orang Tua Aktif</CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{conversations.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Percakapan aktif</p>
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
                  placeholder="Contoh: Laporan Mingguan"
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
                {!attachmentUrl ? (
                  <div className="space-y-2">
                    {!selectedFile ? (
                      <div>
                        <Input
                          type="file"
                          accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                          onChange={handleFileSelect}
                          className="cursor-pointer"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Gambar maksimal 10MB, Dokumen maksimal 5MB
                        </p>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleUpload}
                          disabled={uploading}
                          className="flex-1"
                        >
                          {uploading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Mengupload...
                            </>
                          ) : (
                            <>
                              <Upload className="mr-2 h-4 w-4" />
                              Upload {selectedFile.name}
                            </>
                          )}
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={handleRemoveFile}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-green-600 flex-1 truncate">File terlampir</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveFile}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              <Button
                className="w-full"
                onClick={sendMessage}
                disabled={!newMessage.trim() || !selectedReceiver || sending}
              >
                {sending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Mengirim...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Kirim Pesan
                  </>
                )}
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
              {messagesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
              ) : (
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
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium text-sm">{pesan.sender.name}</h4>
                                <span className="text-xs text-muted-foreground">• {pesan.sender.role}</span>
                                {pesan.senderId === currentUser.id && pesan.receiver && (
                                  <>
                                    <span className="text-xs text-muted-foreground">→</span>
                                    <User className="w-3 h-3 text-muted-foreground" />
                                    <span className="text-xs font-medium text-gray-600">{pesan.receiver.name}</span>
                                    <span className="text-xs text-muted-foreground">({pesan.receiver.role})</span>
                                  </>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                {formatDate(pesan.createdAt)}, {formatTime(pesan.createdAt)}
                              </p>
                            </div>
                            <div className="flex gap-2 items-center">
                              {pesan.senderId === currentUser.id && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => startEdit(pesan)}
                                    disabled={editingMessageId !== null}
                                  >
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => deleteMessage(pesan.id)}
                                    disabled={deletingMessageId === pesan.id}
                                  >
                                    {deletingMessageId === pesan.id ? (
                                      <Loader2 className="h-3 w-3 animate-spin" />
                                    ) : (
                                      <Trash2 className="h-3 w-3" />
                                    )}
                                  </Button>
                                </>
                              )}
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

                          {/* Edit Mode */}
                          {editingMessageId === pesan.id ? (
                            <div className="mt-3 space-y-3">
                              <Input
                                placeholder="Judul (opsional)"
                                value={editSubject}
                                onChange={(e) => setEditSubject(e.target.value)}
                              />
                              <Textarea
                                placeholder="Isi pesan..."
                                rows={4}
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                              />
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => saveEdit(pesan.id)}
                                  disabled={saving || !editContent.trim()}
                                >
                                  {saving ? (
                                    <>
                                      <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                                      Menyimpan...
                                    </>
                                  ) : (
                                    <>
                                      <CheckCircle className="mr-2 h-3 w-3" />
                                      Simpan
                                    </>
                                  )}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={cancelEdit}
                                  disabled={saving}
                                >
                                  <X className="mr-2 h-3 w-3" />
                                  Batal
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <>
                              {pesan.subject && (
                                <p className="text-sm font-semibold text-gray-900 mb-1">{pesan.subject}</p>
                              )}
                              <p className="text-sm mt-2 whitespace-pre-wrap">{pesan.content}</p>
                            </>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
