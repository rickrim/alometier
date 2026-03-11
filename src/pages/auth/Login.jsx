import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Eye, EyeOff } from 'lucide-react'
import useAuthStore from '../../store/authStore'
import { cn } from '../../lib/utils'

export default function Login() {
  const navigate = useNavigate()
  const { login, loading, error, clearError } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({ telephone: '', password: '' })
  const [localError, setLocalError] = useState('')

  const handleChange = (e) => {
    clearError()
    setLocalError('')
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.telephone || !form.password) {
      setLocalError('Veuillez remplir tous les champs')
      return
    }
    const ok = await login(form.telephone, form.password)
    if (ok) {
      // La redirection se fait via le GuestRoute → ProtectedRoute dans le router
      const user = useAuthStore.getState().user
      navigate(user?.type === 'provider' ? '/prestataire' : '/client')
    }
  }

  const displayError = localError || error

  return (
    <div className="app-container flex flex-col min-h-screen">
      <div className="bg-primary px-4 pt-12 pb-8">
        <button onClick={() => navigate('/')} className="text-white mb-4 p-1 -ml-1">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold text-white">Connexion</h1>
        <p className="text-orange-100 text-sm mt-1">Content de vous revoir !</p>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 px-6 py-8 flex flex-col gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
          <input name="telephone" value={form.telephone} onChange={handleChange}
            placeholder="+228 90 00 00 00" type="tel" className="input-field" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
          <div className="relative">
            <input name="password" value={form.password} onChange={handleChange}
              type={showPassword ? 'text' : 'password'}
              placeholder="Votre mot de passe" className="input-field pr-12" />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <button type="button" className="text-primary text-sm font-medium text-right -mt-2">
          Mot de passe oublié ?
        </button>

        {displayError && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
            {displayError}
          </div>
        )}

        <button type="submit" disabled={loading}
          className={cn('btn-primary mt-2', loading && 'opacity-60 cursor-not-allowed')}>
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>

        <p className="text-center text-gray-500 text-sm mt-auto">
          Pas encore inscrit ?{' '}
          <Link to="/" className="text-primary font-semibold">Créer un compte</Link>
        </p>
      </form>
    </div>
  )
}
