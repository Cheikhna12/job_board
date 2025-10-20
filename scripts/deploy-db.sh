#!/bin/bash

# Script de déploiement de la base de données pour production
# Usage: ./scripts/deploy-db.sh

set -e

echo "Déploiement de la base de données..."

# Vérifier que DATABASE_URL est défini
if [ -z "$DATABASE_URL" ]; then
    echo "Erreur : DATABASE_URL n'est pas défini"
    echo "Usage : DATABASE_URL='your-url' ./scripts/deploy-db.sh"
    exit 1
fi

# Afficher l'hôte de la base de données (masquer le mot de passe)
echo "Base de données cible : ${DATABASE_URL%%@*}@***"

# Générer le client Prisma
echo "Génération du client Prisma..."
npx prisma generate

# Appliquer les migrations
echo "Application des migrations..."
npx prisma migrate deploy

# Optionnel : Seed la base de données
read -p "Voulez-vous seed la base de données ? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Seeding de la base de données..."
    npx prisma db seed
fi

echo "Déploiement terminé avec succès !"
