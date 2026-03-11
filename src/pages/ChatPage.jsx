import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Send, Phone } from 'lucide-react'
import useAuthStore from '../store/authStore'
import useChatStore from '../store/chatStore'
import { mockProviders } from '../data/mockProviders'
import { cn } from '../lib/utils'

// Noms fictifs pour les clients (côté prestataire)
const MOCK_CLIENTS = {
  default: { nom: 'Client', emoji: '👤' }
}

function getContact(myType, contactId) {
  if (myType === 'client') {
    const p = mockProviders.find((p) => p.id === contactId)
    return p ? { nom: p.nom, emoji: p.emoji, tel: p.telephone } : null
  }
  return MOCK_CLIENTS[contactId] || { nom: 'Client', emoji: '👤', tel: '' }
}

function formatTime(iso) {
  const d = new Date(iso)
  return `${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`
}

// Messages de démo pré-chargés
const DEMO_MESSAGES = (providerId, clientId) => [
  {
    id: 'demo1',
    senderId: providerId,
    text: 'Bonjour ! Je suis disponible pour votre demande. De quoi avez-vous besoin exactement ?',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    read: true,
  },
  {
    id: 'demo2',
    senderId: clientId,
    text: 'Bonjour ! J\'ai besoin d\'un nettoyage complet de mon appartement, 3 pièces.',
    createdAt: new Date(Date.now() - 3500000).toISOString(),
    read: true,
  },
  {
    id: 'demo3',
    senderId: providerId,
    text: 'Très bien, je peux venir demain matin. Quel est votre quartier ?',
    createdAt: new Date(Date.now() - 3400000).toISOString(),
    read: true,
  },
]

export default function ChatPage() {
  const { contactId } = useParams()
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const { getMessages, sendMessage, markRead } = useChatStore()

  const [text, setText] = useState('')
  const bottomRef = useRef(null)
  const contact = getContact(user?.type, contactId)

  // Pré-charger messages démo si conversation vide
  const storeMessages = getMessages(user?.id, contactId)
  const messages = storeMessages.length > 0
    ? storeMessages
    : DEMO_MESSAGES(contactId, user?.id)

  useEffect(() => {
    markRead(user?.id, contactId, user?.id)
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  const handleSend = () => {
    if (!text.trim()) return
    sendMessage(user.id, contactId, text.trim())
    setText('')
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  if (!contact) { navigate(-1); return null }

  return (
    <div className="app-container flex flex-col" style={{ height: '100dvh' }}>
      {/* Header */}
      <div className="bg-navy px-4 pt-12 pb-3 flex items-center gap-3 flex-shrink-0">
        <button onClick={() => navigate(-1)} className="text-white p-1 -ml-1">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="w-9 h-9 bg-orange-100 rounded-full flex items-center justify-center text-lg flex-shrink-0">
          {contact.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-white font-semibold text-sm">{contact.nom}</div>
          <div className="text-blue-300 text-xs">En ligne</div>
        </div>
        {contact.tel && (
          <a href={`tel:${contact.tel}`} className="text-white p-1">
            <Phone className="w-5 h-5" />
          </a>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 bg-gray-50 flex flex-col gap-2">
        {messages.map((m, i) => {
          const isMe = m.senderId === user?.id
          const showTime = i === 0 || new Date(m.createdAt) - new Date(messages[i-1].createdAt) > 300000
          return (
            <div key={m.id}>
              {showTime && (
                <div className="text-center text-[10px] text-gray-400 my-2">
                  {formatTime(m.createdAt)}
                </div>
              )}
              <div className={cn('flex', isMe ? 'justify-end' : 'justify-start')}>
                <div className={cn(
                  'max-w-[75%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed',
                  isMe
                    ? 'bg-primary text-white rounded-br-sm'
                    : 'bg-white text-gray-800 rounded-bl-sm shadow-sm'
                )}>
                  {m.text}
                  <div className={cn('text-[10px] mt-0.5 text-right', isMe ? 'text-orange-200' : 'text-gray-400')}>
                    {formatTime(m.createdAt)}
                    {isMe && <span className="ml-1">{m.read ? '✓✓' : '✓'}</span>}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-100 px-3 py-3 flex items-end gap-2 flex-shrink-0">
        <textarea
          value={text} onChange={(e) => setText(e.target.value)} onKeyDown={handleKey}
          placeholder="Écrire un message..."
          rows={1}
          className="flex-1 bg-gray-100 rounded-2xl px-4 py-2.5 text-sm outline-none resize-none max-h-24 placeholder:text-gray-400"
          style={{ lineHeight: '1.4' }}
        />
        <button onClick={handleSend} disabled={!text.trim()}
          className={cn(
            'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors',
            text.trim() ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'
          )}>
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
