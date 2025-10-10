# Job Board - Plateforme d'Offres d'Emploi

Une plateforme moderne de gestion d'offres d'emploi construite avec Next.js, Prisma, et PostgreSQL.

## Prérequis

Avant de commencer, assurez-vous d'avoir installé :
```bash
git clone [url-du-repo]
cd job-board
npm install
```

2. **Configurer la base de données**
```bash
cp .env.example .env.local
# Configurer DATABASE_URL dans .env.local
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

- **Frontend & Backend** : Next.js (App Router)
- **Base de données** : PostgreSQL
- **ORM** : Prisma
- **Authentication** : NextAuth.js
- **Styling** : Tailwind CSS
- **Validation** : Zod
- **TypeScript** : Support complet

## Documentation

### **Documentation Projet**
- **[ARCHITECTURE_GUIDE.md](./ARCHITECTURE_GUIDE.md)** - Guide complet de l'architecture
- **[SWAGGER_TESTS.md](./SWAGGER_TESTS.md)** - Guide de tests API avec Swagger

### **APIs Documentées**
- **Swagger UI** : http://localhost:3000/api-docs
- **Spec OpenAPI** : http://localhost:3000/api/swagger

### **Documentation Externe**
- [Prisma Documentation](https://www.prisma.io/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)

## Étapes de Développement

### Phase 1 : Configuration de Base 
- [x] Setup du projet Next.js
- [x] Configuration Prisma
- [x] Structure des dossiers
- [x] Modèles de données Prisma

### Phase 2 : Authentification
- [x] Configuration NextAuth.js
- [x] Pages de connexion/inscription
- [x] Middleware de protection des routes
- [x] Gestion des rôles (USER/RECRUITER/ADMIN)
- [x] APIs Companies complètes
- [x] Documentation Swagger UI

### Phase 3 : API et CRUD
- [x] Routes API pour les offres d'emploi 
- [x] Routes API pour les entreprises 
- [x] Routes API pour les candidatures
- [x] Routes API pour les utilisateurs

### Phase 4 : Interface Utilisateur
- [x] Liste des offres d'emploi
- [x] Détails d'une offre
- [x] Formulaire de candidature
- [x] Dashboard administrateur


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

