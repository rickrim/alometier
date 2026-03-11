import { useEffect } from 'react'
import AppRouter from './router'
import useAuthStore from './store/authStore'

export default function App() {
  const initSession = useAuthStore((s) => s.initSession)
  useEffect(() => { initSession() }, [])
  return <AppRouter />
}
