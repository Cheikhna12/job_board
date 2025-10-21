/**
 * Obtient l'URL de base pour les appels API côté serveur
 * Fonctionne en production (Vercel) et en développement local
 */
export function getBaseUrl(): string {
  // En production sur Vercel
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  
  // Si NEXTAUTH_URL est définie (priorité)
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL
  }
  
  // En développement local
  return 'http://localhost:3000'
}
