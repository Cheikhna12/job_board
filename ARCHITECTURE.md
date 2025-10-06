# Architecture du Projet Job Board

## Stack Technologique
- **Frontend & Backend**: Next.js 14+ (App Router)
- **Base de données**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **Validation**: Zod

## Structure du Projet

```
job-board/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── register/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── (public)/
│   │   │   ├── page.tsx                    # Liste des offres
│   │   │   └── jobs/
│   │   │       └── [id]/
│   │   │           └── page.tsx            # Détails d'une offre
│   │   ├── admin/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx                    # Dashboard admin
│   │   │   ├── jobs/
│   │   │   │   └── page.tsx
│   │   │   ├── companies/
│   │   │   │   └── page.tsx
│   │   │   ├── users/
│   │   │   │   └── page.tsx
│   │   │   └── applications/
│   │   │       └── page.tsx
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth]/
│   │   │   │       └── route.ts
│   │   │   ├── jobs/
│   │   │   │   ├── route.ts                # GET, POST
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts            # GET, PUT, DELETE
│   │   │   ├── companies/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts
│   │   │   ├── applications/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts
│   │   │   └── users/
│   │   │       ├── route.ts
│   │   │       └── [id]/
│   │   │           └── route.ts
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ui/                             # Composants UI réutilisables
│   │   ├── jobs/
│   │   │   ├── JobCard.tsx
│   │   │   ├── JobDetails.tsx
│   │   │   ├── JobList.tsx
│   │   │   └── ApplyForm.tsx
│   │   ├── admin/
│   │   │   ├── DataTable.tsx
│   │   │   ├── Pagination.tsx
│   │   │   └── Forms/
│   │   └── layout/
│   │       ├── Header.tsx
│   │       └── Footer.tsx
│   ├── lib/
│   │   ├── prisma.ts                       # Client Prisma
│   │   ├── auth.ts                         # Configuration NextAuth
│   │   └── validations/
│   │       ├── job.schema.ts
│   │       ├── user.schema.ts
│   │       └── application.schema.ts
│   └── types/
│       └── index.ts
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── public/
├── .env
├── .env.example
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```



## Routes API RESTful

### Jobs
- `GET /api/jobs`  - Liste toutes les offres actives
- `GET /api/jobs/[id]`  - Détails d'une offre
- `POST /api/jobs`  - Créer une offre (admin)
- `PUT /api/jobs/[id]`  - Modifier une offre (admin)
- `DELETE /api/jobs/[id]`  - Supprimer une offre (admin)

### Companies
- `GET /api/companies`  - Liste toutes les entreprises
- `GET /api/companies/[id]`  - Détails d'une entreprise
- `POST /api/companies`  - Créer une entreprise (admin)
- `PUT /api/companies/[id]`  - Modifier une entreprise (admin)
- `DELETE /api/companies/[id]`  - Supprimer une entreprise (admin)

### Applications
- `GET /api/applications`  - Liste des candidatures (admin)
- `GET /api/applications/[id]`  - Détails d'une candidature
- `POST /api/applications`  - Postuler à une offre
- `PUT /api/applications/[id]`  - Modifier le statut (admin)
- `DELETE /api/applications/[id]`  - Supprimer une candidature (admin)

### Users
- `GET /api/users`  - Liste des utilisateurs (admin)
- `GET /api/users/[id]`  - Détails d'un utilisateur
- `PUT /api/users/[id]`  - Modifier un utilisateur
- `DELETE /api/users/[id]`  - Supprimer un utilisateur (admin)

## Fonctionnalités Clés

### Step 1-3: Affichage des offres
- Liste paginée des offres
- Affichage dynamique des détails sans rechargement

### Step 4-5: API et Candidatures
- API RESTful complète
- Formulaire de candidature avec validation

### Step 6: Authentication
- Inscription/Connexion avec NextAuth.js
- Sessions persistantes
- Auto-complétion pour utilisateurs connectés

### Step 7: Administration
- Dashboard admin protégé
- CRUD complet sur toutes les tables
- Pagination des données
- Gestion des statuts de candidatures

### Step 8: Design
- Interface responsive avec Tailwind CSS
- Composants réutilisables
- UX optimisée
