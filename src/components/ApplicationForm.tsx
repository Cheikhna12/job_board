'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'

interface ApplicationFormProps {
  jobId: string
  jobTitle: string
  onSuccess?: () => void
}

export default function ApplicationForm({ jobId, jobTitle, onSuccess }: ApplicationFormProps) {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [applicantName, setApplicantName] = useState('')
  const [applicantEmail, setApplicantEmail] = useState('')
  const [applicantPhone, setApplicantPhone] = useState('')

  // Pré-remplir les champs si l'utilisateur est connecté
  useState(() => {
    if (session?.user) {
      setApplicantName(session.user.name || '')
      setApplicantEmail(session.user.email || '')
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobId,
          message,
          applicantName,
          applicantEmail,
          applicantPhone,
        }),
      })

      if (response.ok) {
        alert('Candidature envoyée avec succès !')
        setIsOpen(false)
        setMessage('')
        onSuccess?.()
      } else {
        const error = await response.json()
        alert(`Erreur: ${error.error}`)
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error)
      alert('Erreur lors de l\'envoi de la candidature')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full bg-slate-800 hover:bg-slate-900 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
      >
        Postuler maintenant
      </button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Postuler pour {jobTitle}</h3>
          <button
            onClick={() => setIsOpen(false)}
            className="text-slate-400 hover:text-slate-600"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Nom complet *
            </label>
            <input
              type="text"
              value={applicantName}
              onChange={(e) => setApplicantName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              value={applicantEmail}
              onChange={(e) => setApplicantEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Téléphone
            </label>
            <input
              type="tel"
              value={applicantPhone}
              onChange={(e) => setApplicantPhone(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Message de motivation *
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={4}
              placeholder="Expliquez pourquoi vous êtes intéressé par ce poste..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-lg font-semibold disabled:opacity-50"
            >
              {isSubmitting ? 'Envoi...' : 'Envoyer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
