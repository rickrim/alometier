import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Send, Phone } from 'lucide-react'
import useAuthStore from '../store/authStore'
import { supabase } from '../lib/supabase'
import { mockProviders } from '../data/mockProviders'
import { cn } from '../lib/utils'

function getContact(myType, contactId) {
  if (myType === 'client') {
    const p = mockProviders.find((p) => p.id === contactId)
    return p ? { nom: p.nom, emoji: p.emoji, tel: p.telephone } : null
  }
  return { nom: 'Client', emoji: '👤', tel: '' }
}

function formatTime(iso) {
  const d = new Date(iso)
  return `${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`
}

export default function ChatPage() {
  const { contactId } = useParams()
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)
  const bottomRef = useRef(null)
  const contact = getContact(user?.type, contactId)

  // ── Charger l'historique ───────────────────────────────
  useEffect(() => {
    if (!user?.id) return

    const fetchMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${contactId}),and(sender_id.eq.${contactId},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true })

      if (data && data.length > 0) {
        setMessages(data)
      } else {
        // Messages de démo si conversation vide
        setMessages([
          { id: 'd1', sender_id: contactId, text: 'Bonjour ! Je suis disponible pour votre demande. De quoi avez-vous besoin ?', created_at: new Date(Date.now()-3600000).toISOString(), read: true },
          { id: 'd2', sender_id: user.id,   text: "Bonjour ! J'ai besoin d'un nettoyage complet, 3 pièces.", created_at: new Date(Date.now()-3500000).toISOString(), read: true },
          { id: 'd3', sender_id: contactId, text: 'Très bien, je peux venir demain matin. Quel est votre quartier ?', created_at: new Date(Date.now()-3400000).toISOString(), read: true },
        ])
      }
      setLoading(false)
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
    }

    fetchMessages()

    // ── Realtime subscription ──────────────────────────────
    const channel = supabase
      .channel(`chat:${[user.id, contactId].sort().join('_')}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `receiver_id=eq.${user.id}`,
      }, (payload) => {
        if (payload.new.sender_id === contactId) {
          setMessages((prev) => [...prev, payload.new])
          setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
        }
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [user?.id, contactId])

  // ── Envoyer un message ─────────────────────────────────
  const handleSend = async () => {
    if (!text.trim() || !user?.id) return
    const newMsg = {
      sender_id: user.id,
      receiver_id: contactId,
      text: text.trim(),
      read: false,
      created_at: new Date().toISOString(),
    }
    setText('')
    setMessages((prev) => [...prev, { ...newMsg, id: `tmp_${Date.now()}` }])
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)

    // Persister en base (si vrai utilisateur Supabase)
    await supabase.from('messages').insert(newMsg)
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
        {loading ? (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
            Chargement...
          </div>
        ) : (
          messages.map((m, i) => {
            const isMe = m.sender_id === user?.id
            const showTime = i === 0 ||
              new Date(m.created_at) - new Date(messages[i-1].created_at) > 300000
            return (
              <div key={m.id}>
                {showTime && (
                  <div className="text-center text-[10px] text-gray-400 my-2">
                    {formatTime(m.created_at)}
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
                    <div className={cn('text-[10px] mt-0.5 text-right',
                      isMe ? 'text-orange-200' : 'text-gray-400')}>
                      {formatTime(m.created_at)}
                      {isMe && <span className="ml-1">{m.read ? '✓✓' : '✓'}</span>}
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-100 px-3 py-3 flex items-end gap-2 flex-shrink-0">
        <textarea
          value={text} onChange={(e) => setText(e.target.value)} onKeyDown={handleKey}
          placeholder="Écrire un message..."
          rows={1}
          className="flex-1 bg-gray-100 rounded-2xl px-4 py-2.5 text-sm outline-none resize-none max-h-24 placeholder:text-gray-400"
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
