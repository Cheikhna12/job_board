/**
 * Obtient l'URL de base pour les appels API côté serveur
 * Fonctionne en production (Vercel) et en développement local
 */
export function getBaseUrl(): string {
  // En production sur Vercel, utiliser VERCEL_URL avec https
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  
  // En développement local
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL
  }
  
  return 'http://localhost:3000'
}

/**
 * Obtient l'URL de base dynamiquement depuis les headers de la requête
 * À utiliser dans les Server Components pour éviter les problèmes de cache
 */
export function getBaseUrlFromHeaders(headersList: Headers): string {
  const host = headersList.get('host')
  const protocol = headersList.get('x-forwarded-proto') || 'http'
  
  if (host) {
    return `${protocol}://${host}`
  }
  
  return getBaseUrl()
}
