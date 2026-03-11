import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useChatStore = create(
  persist(
    (set, get) => ({
      conversations: {},

      // conversationId = `${userId1}_${userId2}` (triés)
      getConvId: (id1, id2) => [id1, id2].sort().join('_'),

      sendMessage: (senderId, receiverId, text) => {
        const convId = get().getConvId(senderId, receiverId)
        const message = {
          id: Date.now().toString(),
          senderId,
          text,
          createdAt: new Date().toISOString(),
          read: false,
        }
        set((state) => ({
          conversations: {
            ...state.conversations,
            [convId]: [...(state.conversations[convId] || []), message],
          },
        }))
      },

      getMessages: (id1, id2) => {
        const convId = get().getConvId(id1, id2)
        return get().conversations[convId] || []
      },

      markRead: (id1, id2, userId) => {
        const convId = get().getConvId(id1, id2)
        set((state) => ({
          conversations: {
            ...state.conversations,
            [convId]: (state.conversations[convId] || []).map((m) =>
              m.senderId !== userId ? { ...m, read: true } : m
            ),
          },
        }))
      },

      getUnreadCount: (myId) => {
        let count = 0
        Object.values(get().conversations).forEach((msgs) => {
          msgs.forEach((m) => { if (m.senderId !== myId && !m.read) count++ })
        })
        return count
      },
    }),
    { name: 'alometier-chat' }
  )
)

export default useChatStore
