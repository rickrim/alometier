import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Eye, EyeOff } from 'lucide-react'
import useAuthStore from '../../store/authStore'

export default function Login() {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({ telephone: '', password: '' })
  const [error, setError] = useState('')

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.telephone || !form.password) {
      setError('Veuillez remplir tous les champs')
      return
    }
    // Mock : accepter n'importe quel login pour le MVP
    // On détermine le type selon un préfixe fictif (à remplacer par API)
    const isProvider = form.telephone.startsWith('0')
    login({
      id: Date.now().toString(),
      type: isProvider ? 'provider' : 'client',
      nom: 'Utilisateur',
      telephone: form.telephone,
    })
    navigate(isProvider ? '/prestataire' : '/client')
  }

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

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        <button type="submit" className="btn-primary mt-2">
          Se connecter
        </button>

        <p className="text-center text-gray-500 text-sm mt-auto">
          Pas encore inscrit ?{' '}
          <Link to="/" className="text-primary font-semibold">Créer un compte</Link>
        </p>
      </form>
    </div>
  )
}
