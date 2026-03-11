import { useState, useEffect } from 'react'

// Coordonnées par défaut : centre de Lomé, Togo
const LOME_CENTER = { lat: 6.1375, lng: 1.2123 }

export default function useGeolocation() {
  const [position, setPosition] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Géolocalisation non supportée')
      setPosition(LOME_CENTER)
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setLoading(false)
      },
      () => {
        // Fallback sur Lomé si refus ou erreur
        setPosition(LOME_CENTER)
        setLoading(false)
      },
      { timeout: 8000, maximumAge: 60000 }
    )
  }, [])

  return { position, loading, error }
}
