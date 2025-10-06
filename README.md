# Job Board - Plateforme d'Offres d'Emploi

Une plateforme moderne de gestion d'offres d'emploi construite avec Next.js 14+, Prisma, et PostgreSQL.

## Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Node.js** (version 18 ou supérieure)
- **npm** ou **yarn**
- **PostgreSQL** (version 12 ou supérieure)
- **Git**

## Installation et Configuration

### 1. Cloner le projet

```bash
git clone <url-du-repo>
cd job-board
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configuration de la base de données

1. Créez une base de données PostgreSQL :
```sql
CREATE DATABASE job_board;
```

2. Copiez le fichier d'environnement :
```bash
cp env.example .env
```

3. Modifiez le fichier `.env` avec vos informations :
```env
DATABASE_URL="postgresql://votre_user:votre_password@localhost:5432/job_board"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="votre-clé-secrète-très-longue-et-sécurisée"
```

### 4. Configuration Prisma

```bash
# Générer le client Prisma
npx prisma generate

# Créer et appliquer les migrations (après avoir ajouté les modèles)
npx prisma migrate dev --name init

# (Optionnel) Peupler la base avec des données de test
npx prisma db seed
```

### 5. Lancer le serveur de développement

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## Structure du Projet

```
job-board/
├── src/
│   ├── app/                    # App Router Next.js 14+
│   │   ├── (auth)/            # Routes d'authentification
│   │   ├── (public)/          # Routes publiques
│   │   ├── admin/             # Dashboard administrateur
│   │   └── api/               # API Routes
│   ├── components/            # Composants React réutilisables
│   ├── lib/                   # Utilitaires et configurations
│   └── types/                 # Types TypeScript
├── prisma/                    # Configuration Prisma
└── public/                    # Assets statiques
```

## Scripts Disponibles

```bash
# Développement
npm run dev          # Lance le serveur de développement
npm run build        # Build de production
npm run start        # Lance le serveur de production
npm run lint         # Vérification ESLint

# Base de données
npx prisma studio    # Interface graphique pour la DB
npx prisma generate  # Génère le client Prisma
npx prisma migrate dev # Applique les migrations
npx prisma db push   # Push le schéma sans migration
npx prisma db seed   # Peuple la base avec des données de test
```

## Stack Technologique

- **Frontend & Backend** : Next.js 14+ (App Router)
- **Base de données** : PostgreSQL
- **ORM** : Prisma
- **Authentication** : NextAuth.js
- **Styling** : Tailwind CSS
- **Validation** : Zod
- **TypeScript** : Support complet

## Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Architecture détaillée du projet
- [Prisma Documentation](https://www.prisma.io/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)

## Étapes de Développement

### Phase 1 : Configuration de Base ✅
- [x] Setup du projet Next.js
- [x] Configuration Prisma
- [x] Structure des dossiers
- [ ] Modèles de données Prisma

### Phase 2 : Authentification
- [ ] Configuration NextAuth.js
- [ ] Pages de connexion/inscription
- [ ] Middleware de protection des routes

### Phase 3 : API et CRUD
- [ ] Routes API pour les offres d'emploi
- [ ] Routes API pour les entreprises
- [ ] Routes API pour les candidatures
- [ ] Routes API pour les utilisateurs

### Phase 4 : Interface Utilisateur
- [ ] Liste des offres d'emploi
- [ ] Détails d'une offre
- [ ] Formulaire de candidature
- [ ] Dashboard administrateur

### Phase 5 : Fonctionnalités Avancées
- [ ] Système de notifications
- [ ] Upload de fichiers (CV)
- [ ] Filtres et recherche
- [ ] Pagination

## Contribution

1. Créez une branche pour votre fonctionnalité
```bash
git checkout -b feature/nom-de-la-fonctionnalite
```

2. Commitez vos changements
```bash
git commit -m "Ajout de la fonctionnalité X"
```

3. Poussez vers la branche
```bash
git push origin feature/nom-de-la-fonctionnalite
```

4. Ouvrez une Pull Request

## Dépannage

### Erreurs communes

**Erreur de connexion à la base de données :**
- Vérifiez que PostgreSQL est démarré
- Vérifiez l'URL de connexion dans `.env`
- Assurez-vous que la base de données existe

**Erreur Prisma :**
```bash
# Réinitialiser Prisma
npx prisma generate
npx prisma db push
```

**Port déjà utilisé :**
```bash
# Utiliser un autre port
npm run dev -- -p 3001
```

## Support

Si vous rencontrez des problèmes :
1. Consultez la documentation dans `ARCHITECTURE.md`
2. Vérifiez les issues GitHub existantes
3. Créez une nouvelle issue avec les détails du problème

---

