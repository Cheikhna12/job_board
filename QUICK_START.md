# Quick Start Guide

## Pour commencer immédiatement

### 1. Cloner et installer
```bash
git clone <url-du-repo>
cd job-board
npm install
```

### 2. Configuration rapide
```bash
# Copier le fichier d'environnement
cp env.example .env

# Éditer .env avec vos informations de base de données
# DATABASE_URL="postgresql://user:password@localhost:5432/job_board"
```

### 3. Lancer le projet
```bash
npm run dev
```

Le projet sera accessible sur http://localhost:3000

## Prochaines étapes pour l'équipe

### À faire en priorité :

1. **Modèles Prisma** 
   - Copier les modèles depuis `ARCHITECTURE.md` dans `prisma/schema.prisma`
   - Exécuter `npm run db:migrate`

2. **Configuration NextAuth**
   - Créer `src/lib/auth.ts`
   - Configurer les providers d'authentification

3. **Schémas de validation Zod**
   - Créer les fichiers dans `src/lib/validations/`

### Structure déjà créée :

```
Projet Next.js 14+ configuré
Dépendances installées (Prisma, NextAuth, Tailwind, Zod)
Structure des dossiers créée
Configuration de base
Scripts npm utiles
Documentation complète
```

### Fichiers importants :

- `README.md` - Documentation complète
- `ARCHITECTURE.md` - Architecture détaillée avec tous les modèles
- `CONTRIBUTING.md` - Guide de contribution pour l'équipe
- `env.example` - Variables d'environnement

### Scripts disponibles :

```bash
npm run dev          # Développement
npm run build        # Build production
npm run db:generate  # Générer client Prisma
npm run db:migrate   # Migrations
npm run db:studio    # Interface graphique DB
```

## Répartition suggérée des tâches

### Phase 1 : Base de données
- **Personne 1** : Modèles Prisma + migrations
- **Personne 2** : Seed script + données de test

### Phase 2 : Authentification  
- **Personne 1** : Configuration NextAuth
- **Personne 2** : Pages login/register

### Phase 3 : API
- **Personne 1** : API Jobs + Companies
- **Personne 2** : API Applications + Users

### Phase 4 : Interface
- **Personne 1** : Pages publiques (liste jobs, détails)
- **Personne 2** : Dashboard admin

---

