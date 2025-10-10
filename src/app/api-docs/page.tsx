'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import 'swagger-ui-react/swagger-ui.css'

// Import dynamique pour éviter les erreurs SSR
const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false })

export default function ApiDocsPage() {
  return (
    <section className="min-h-screen">
      <div id="swagger-ui"></div>
      <SwaggerUI url="/api/swagger" />
    </section>
  );
}
