'use client'

import ApplicationForm from './ApplicationForm'

interface JobApplicationSectionProps {
  jobId: string
  jobTitle: string
  createdAt: string
}

export default function JobApplicationSection({ jobId, jobTitle, createdAt }: JobApplicationSectionProps) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
      <ApplicationForm 
        jobId={jobId} 
        jobTitle={jobTitle}
        onSuccess={() => {
          // Optionnel: actions après succès
        }}
      />
      <p className="mt-3 text-xs text-slate-500 text-center">
        Publiée le {new Date(createdAt).toLocaleDateString('fr-FR')}
      </p>
    </div>
  )
}
