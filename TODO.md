# TODO - Job Board

## ✅ Terminé 

### Authentification & Base
- [x] Configuration NextAuth.js + Prisma
- [x] Pages login/register
- [x] Middleware de protection des routes
- [x] Gestion des rôles (USER/RECRUITER/ADMIN)
- [x] Page d'accueil avec message de bienvenue
- [x] Header avec navigation

### APIs Fonctionnelles
- [x] `POST /api/auth/register` - Inscription
- [x] `POST /api/auth/signin` - Connexion  
- [x] `GET /api/auth/session` - Session
- [x] `POST /api/auth/signout` - Déconnexion

## 🚧 À Faire (Équipe)

### Phase 1: APIs Backend
**Priorité: HAUTE**

#### Jobs API
- [x] `GET /api/jobs` - Liste des offres
- [x] `GET /api/jobs/[id]` - Détails offre
- [x] `POST /api/jobs` - Créer offre (RECRUITER/ADMIN)
- [x] `PUT /api/jobs/[id]` - Modifier offre
- [x] `DELETE /api/jobs/[id]` - Supprimer offre

#### Companies API  
- [ ] `GET /api/companies` - Liste entreprises
- [ ] `POST /api/companies` - Créer entreprise (ADMIN)
- [ ] `PUT /api/companies/[id]` - Modifier entreprise

#### Applications API
- [ ] `GET /api/applications` - Liste candidatures
- [ ] `POST /api/applications` - Postuler
- [ ] `PUT /api/applications/[id]` - Changer statut

### Phase 2: Pages Frontend
**Priorité: MOYENNE**

#### Pages Publiques
- [x] `/jobs` - Liste des offres d'emploi
- [x] `/jobs/[id]` - Détails d'une offre
- [ ] `/companies` - Liste des entreprises

#### Pages Utilisateur
- [ ] `/profile` - Profil utilisateur
- [ ] `/applications` - Mes candidatures

#### Pages Admin/Recruiter
- [ ] `/admin` - Dashboard admin
- [ ] `/admin/jobs` - Gestion des offres
- [ ] `/admin/applications` - Gestion candidatures
- [ ] `/admin/users` - Gestion utilisateurs (ADMIN only)

### Phase 3: Fonctionnalités Avancées
**Priorité: BASSE**

- [ ] Upload de CV
- [ ] Notifications email
- [ ] Recherche avancée
- [ ] Filtres par localisation/salaire
- [ ] Dashboard avec statistiques

##  Comment Démarrer

### 1. Installation
```bash
git pull origin main
npm install
cp .env.example .env.local
# Configurer la DB dans .env.local
npx prisma db push
npm run dev
```

### 2. Tester l'Auth
- Aller sur http://localhost:3000
- Tester login/register
- Comptes de test disponibles dans le code

### 3. Créer une API
```typescript
// Exemple: src/app/api/jobs/route.ts
export async function GET() {
  const jobs = await prisma.job.findMany()
  return NextResponse.json(jobs)
}
```

## 📞 Contact
Questions ? Demander à Cheikhna pour l'auth ou la structure.
