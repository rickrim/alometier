import { useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ArrowLeft, Eye, EyeOff, Camera } from 'lucide-react'
import useAuthStore from '../../store/authStore'

const SERVICES = [
  'Ménage', 'Blanchisserie / Repassage', 'Plomberie', 'Électricité',
  'Cordonnerie', 'Maçonnerie', 'Mécanique', 'Coiffure à domicile',
  'Peinture', 'Soudure', 'Gardiennage', 'Cuisine', 'Nounou / Nourrice',
  'Jardinage', 'Déménagement', 'Informatique'
]

export default function Register() {
  const { type } = useParams()
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)
  const isProvider = type === 'prestataire'

  const [showPassword, setShowPassword] = useState(false)
  const [selectedServices, setSelectedServices] = useState([])
  const [form, setForm] = useState({
    nom: '', telephone: '', email: '', password: '', quartier: '',
    zone: '', tarif: '', description: ''
  })
  const [errors, setErrors] = useState({})

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const toggleService = (s) =>
    setSelectedServices((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    )

  const validate = () => {
    const e = {}
    if (!form.nom.trim()) e.nom = 'Nom requis'
    if (!form.telephone.trim()) e.telephone = 'Téléphone requis'
    if (!form.password || form.password.length < 6) e.password = 'Minimum 6 caractères'
    if (isProvider && selectedServices.length === 0) e.services = 'Choisissez au moins un service'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    login({
      id: Date.now().toString(),
      type: isProvider ? 'provider' : 'client',
      nom: form.nom,
      telephone: form.telephone,
      email: form.email,
      quartier: form.quartier,
      ...(isProvider && {
        services: selectedServices,
        zone: form.zone,
        tarif: form.tarif,
        description: form.description,
        disponible: true,
      })
    })
    navigate(isProvider ? '/prestataire' : '/client')
  }

  return (
    <div className="app-container flex flex-col min-h-screen">
      {/* Header */}
      <div className="bg-primary px-4 pt-12 pb-6">
        <button onClick={() => navigate(-1)} className="text-white mb-4 p-1 -ml-1">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold text-white">
          {isProvider ? 'Créer mon profil prestataire' : 'Créer mon compte client'}
        </h1>
        <p className="text-orange-100 text-sm mt-1">
          {isProvider ? 'Commencez à recevoir des demandes' : 'Trouvez un prestataire rapidement'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 px-6 py-6 flex flex-col gap-5 overflow-y-auto pb-10">
        {/* Photo */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center border-2 border-dashed border-gray-300">
              <Camera className="w-8 h-8 text-gray-400" />
            </div>
            <div className="absolute bottom-0 right-0 w-7 h-7 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white text-lg font-bold leading-none">+</span>
            </div>
          </div>
        </div>

        {/* Champs communs */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet *</label>
          <input name="nom" value={form.nom} onChange={handleChange}
            placeholder="Ex: Kossi Agbeko" className="input-field" />
          {errors.nom && <p className="text-red-500 text-xs mt-1">{errors.nom}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone *</label>
          <input name="telephone" value={form.telephone} onChange={handleChange}
            placeholder="+228 90 00 00 00" type="tel" className="input-field" />
          {errors.telephone && <p className="text-red-500 text-xs mt-1">{errors.telephone}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email (optionnel)</label>
          <input name="email" value={form.email} onChange={handleChange}
            placeholder="email@exemple.com" type="email" className="input-field" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Quartier</label>
          <input name="quartier" value={form.quartier} onChange={handleChange}
            placeholder="Ex: Bè Klikamé, Lomé" className="input-field" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe *</label>
          <div className="relative">
            <input name="password" value={form.password} onChange={handleChange}
              type={showPassword ? 'text' : 'password'}
              placeholder="Minimum 6 caractères" className="input-field pr-12" />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
        </div>

        {/* Champs prestataire */}
        {isProvider && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Zone d'intervention</label>
              <input name="zone" value={form.zone} onChange={handleChange}
                placeholder="Ex: Lomé, rayon 5km" className="input-field" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tarif indicatif</label>
              <input name="tarif" value={form.tarif} onChange={handleChange}
                placeholder="Ex: 2 000 FCFA / heure" className="input-field" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Services proposés *</label>
              <div className="flex flex-wrap gap-2">
                {SERVICES.map((s) => (
                  <button key={s} type="button" onClick={() => toggleService(s)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                      selectedServices.includes(s)
                        ? 'bg-primary text-white border-primary'
                        : 'bg-white text-gray-600 border-gray-200'
                    }`}>
                    {s}
                  </button>
                ))}
              </div>
              {errors.services && <p className="text-red-500 text-xs mt-2">{errors.services}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description (optionnel)</label>
              <textarea name="description" value={form.description} onChange={handleChange}
                placeholder="Parlez de votre expérience, vos compétences..."
                rows={3} className="input-field resize-none" />
            </div>
          </>
        )}

        <button type="submit" className="btn-primary mt-2">
          S'inscrire
        </button>

        <p className="text-center text-gray-500 text-sm">
          Déjà inscrit ?{' '}
          <Link to="/connexion" className="text-primary font-semibold">Se connecter</Link>
        </p>
      </form>
    </div>
  )
}
