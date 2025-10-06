# Guide de Contribution

## Workflow de Développement

### 1. Branches
- `main` : Branche principale (production)
- `develop` : Branche de développement
- `feature/nom-fonctionnalite` : Nouvelles fonctionnalités
- `fix/nom-bug` : Corrections de bugs
- `hotfix/nom-urgence` : Corrections urgentes

### 2. Convention de Nommage

#### Branches
```bash
feature/auth-system
feature/job-listing
fix/login-validation
hotfix/security-patch
```

#### Commits
Utilisez la convention [Conventional Commits](https://www.conventionalcommits.org/) :

```bash
feat: ajout du système d'authentification
fix: correction du bug de validation des formulaires
docs: mise à jour du README
style: formatage du code
refactor: refactorisation du composant JobCard
test: ajout des tests pour l'API jobs
chore: mise à jour des dépendances
```

### 3. Processus de Développement

1. **Créer une branche**
```bash
git checkout develop
git pull origin develop
git checkout -b feature/nom-de-la-fonctionnalite
```

2. **Développer et tester**
```bash
# Faire vos changements
npm run lint          # Vérifier le code
npm run build         # Tester le build
npm run dev           # Tester en développement
```

3. **Commit et Push**
```bash
git add .
git commit -m "feat: ajout de la fonctionnalité X"
git push origin feature/nom-de-la-fonctionnalite
```

4. **Créer une Pull Request**
- Vers la branche `develop`
- Avec une description claire
- Assigner au moins un reviewer

## Standards de Code

### TypeScript
- Utiliser des types stricts
- Éviter `any`, préférer `unknown`
- Documenter les interfaces complexes

### React/Next.js
- Composants fonctionnels avec hooks
- Props typées avec TypeScript
- Utiliser les Server Components quand possible

### Prisma
- Noms de modèles en PascalCase
- Noms de champs en camelCase
- Relations bien définies

### Styling
- Utiliser Tailwind CSS
- Classes utilitaires plutôt que CSS custom
- Responsive design (mobile-first)

## Structure des Dossiers

```
src/
├── app/                    # App Router Next.js
│   ├── (auth)/            # Groupe de routes auth
│   ├── (public)/          # Groupe de routes publiques
│   ├── admin/             # Pages admin
│   └── api/               # API routes
├── components/            # Composants réutilisables
│   ├── ui/                # Composants UI de base
│   ├── forms/             # Composants de formulaires
│   └── layout/            # Composants de layout
├── lib/                   # Utilitaires et configurations
│   ├── validations/       # Schémas Zod
│   ├── utils.ts           # Fonctions utilitaires
│   ├── prisma.ts          # Client Prisma
│   └── auth.ts            # Configuration NextAuth
└── types/                 # Types TypeScript
```

## Base de Données

### Migrations
```bash
# Créer une migration
npx prisma migrate dev --name nom-de-la-migration

# Appliquer les migrations
npx prisma migrate deploy

# Reset complet (développement uniquement)
npx prisma migrate reset
```

### Seed
```bash
# Peupler la base avec des données de test
npm run db:seed
```

## Tests

### Avant de commiter
- [ ] Le code compile sans erreurs
- [ ] Les tests passent (quand ils seront ajoutés)
- [ ] Le linting passe
- [ ] La fonctionnalité fonctionne en local

### Tests à ajouter (plus tard)
- Tests unitaires avec Jest
- Tests d'intégration avec Playwright
- Tests API avec Supertest

## Déploiement

### Environnements
- **Développement** : `localhost:3000`
- **Staging** : À définir
- **Production** : À définir

### Variables d'environnement
Toujours mettre à jour `env.example` avec les nouvelles variables.

## Bonnes Pratiques

### Sécurité
- Ne jamais commiter de secrets
- Valider toutes les entrées utilisateur
- Utiliser HTTPS en production
- Sanitiser les données avant insertion en DB

### Performance
- Optimiser les requêtes Prisma
- Utiliser la pagination
- Lazy loading des composants lourds
- Optimiser les images

### Accessibilité
- Utiliser les attributs ARIA appropriés
- Contraste de couleurs suffisant
- Navigation au clavier
- Textes alternatifs pour les images

## Ressources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

## Questions ?

Si vous avez des questions :
1. Consultez la documentation
2. Demandez dans le chat de l'équipe
3. Créez une issue GitHub pour les questions techniques
