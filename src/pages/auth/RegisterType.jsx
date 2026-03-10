import { useNavigate } from 'react-router-dom'
import { Briefcase, User } from 'lucide-react'

export default function RegisterType() {
  const navigate = useNavigate()

  return (
    <div className="app-container flex flex-col min-h-screen">
      {/* Header */}
      <div className="bg-primary px-6 pt-16 pb-12 text-center">
        <div className="w-20 h-20 bg-white rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
          <span className="text-4xl font-bold text-primary">A</span>
        </div>
        <h1 className="text-3xl font-bold text-white">AloMétier</h1>
        <p className="text-orange-100 mt-2 text-sm">
          Des prestataires de confiance, près de chez vous
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-10 flex flex-col">
        <h2 className="text-xl font-bold text-navy text-center mb-2">
          Bienvenue !
        </h2>
        <p className="text-gray-500 text-center text-sm mb-8">
          Choisissez votre profil pour commencer
        </p>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => navigate('/inscription/client')}
            className="flex items-center gap-4 card border-2 border-transparent hover:border-primary active:scale-[0.98] transition-all duration-150"
          >
            <div className="w-14 h-14 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <User className="w-7 h-7 text-primary" />
            </div>
            <div className="text-left">
              <div className="font-bold text-navy text-base">Je suis client</div>
              <div className="text-gray-500 text-sm">Je recherche un prestataire</div>
            </div>
          </button>

          <button
            onClick={() => navigate('/inscription/prestataire')}
            className="flex items-center gap-4 card border-2 border-transparent hover:border-primary active:scale-[0.98] transition-all duration-150"
          >
            <div className="w-14 h-14 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <Briefcase className="w-7 h-7 text-primary" />
            </div>
            <div className="text-left">
              <div className="font-bold text-navy text-base">Je suis prestataire</div>
              <div className="text-gray-500 text-sm">Je propose mes services</div>
            </div>
          </button>
        </div>

        <div className="mt-auto pt-8 text-center">
          <p className="text-gray-500 text-sm">
            Déjà inscrit ?{' '}
            <button
              onClick={() => navigate('/connexion')}
              className="text-primary font-semibold"
            >
              Se connecter
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
