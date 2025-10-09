# Swagger UI & Tests API - Job Board

## Accès à Swagger UI

### URL de la documentation interactive
```
http://localhost:3000/api-docs
```

### URL de la spec JSON
```
http://localhost:3000/api/swagger
```

## Authentification pour les tests

### 1. Se connecter comme Admin
```http
POST /api/auth/callback/credentials
Content-Type: application/x-www-form-urlencoded

email=admin@jobboard.com&password=password123&redirect=false
```

### 2. Récupérer le cookie de session
Dans la réponse, copiez la valeur du cookie `next-auth.session-token`

## Tests API Companies (Schéma Prisma Réel)

### GET /api/companies - Liste des entreprises
```http
GET /api/companies?page=1&limit=5&search=tech
```

### POST /api/companies - Créer une entreprise (ADMIN)
```http
POST /api/companies
Content-Type: application/json
Cookie: next-auth.session-token=VOTRE_TOKEN

{
  "compName": "TechCorp Innovation",
  "place": "Paris, France", 
  "information": "Entreprise spécialisée dans l'innovation technologique",
  "website": "https://techcorp-innovation.com"
}
```

### GET /api/companies/{id} - Détails d'une entreprise
```http
GET /api/companies/cm1z8example-company-id
```

### PUT /api/companies/{id} - Modifier une entreprise
```http
PUT /api/companies/cm1z8example-company-id
Content-Type: application/json
Cookie: next-auth.session-token=VOTRE_TOKEN

{
  "compName": "TechCorp Innovation Modifiée",
  "place": "Lyon, France",
  "information": "Description mise à jour"
}
```

###  DELETE /api/companies/{id} - Supprimer une entreprise (ADMIN)
```http
DELETE /api/companies/cm1z8example-company-id
Cookie: next-auth.session-token=ADMIN_TOKEN
```

## Tests API Jobs

### GET /api/jobs - Liste des offres d'emploi
```http
GET /api/jobs
```

### POST /api/jobs - Créer une offre d'emploi (RECRUITER/ADMIN)
```http
POST /api/jobs
Content-Type: application/json
Cookie: next-auth.session-token=RECRUITER_TOKEN

{
  "title": "Développeur Full Stack",
  "type": "CDI",
  "shortDescription": "Rejoignez notre équipe de développement",
  "description": "Nous recherchons un développeur expérimenté en React et Node.js pour rejoindre notre équipe dynamique...",
  "salary": 45000,
  "location": "Paris, France"
}
```

### GET /api/jobs/{id} - Détails d'une offre d'emploi
```http
GET /api/jobs/cm1z8example-job-id
```

### PUT /api/jobs/{id} - Modifier une offre d'emploi (RECRUITER/ADMIN)
```http
PUT /api/jobs/cm1z8example-job-id
Content-Type: application/json
Cookie: next-auth.session-token=RECRUITER_TOKEN

{
  "title": "Développeur Full Stack Senior",
  "type": "CDI",
  "shortDescription": "Poste senior dans notre équipe",
  "description": "Description mise à jour...",
  "salary": 55000,
  "location": "Lyon, France"
}
```

### DELETE /api/jobs/{id} - Supprimer une offre d'emploi (RECRUITER/ADMIN)
```http
DELETE /api/jobs/cm1z8example-job-id
Cookie: next-auth.session-token=RECRUITER_TOKEN
```

## Réponses Attendues

### Succès - Liste des entreprises
```json
{
  "success": true,
  "data": [
    {
      "id": "cm1z8company123",
      "compName": "TechCorp",
      "place": "Paris, France",
      "information": "Entreprise technologique",
      "website": "https://techcorp.com",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "_count": {
        "jobs": 5,
        "users": 3
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

### Succès - Liste des offres d'emploi
```json
[
  {
    "id": "cm1z8job123",
    "title": "Développeur Full Stack",
    "type": "CDI",
    "shortDescription": "Rejoignez notre équipe de développement",
    "description": "Nous recherchons un développeur expérimenté...",
    "salary": 45000,
    "location": "Paris, France",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "companyId": "cm1z8company123",
    "createdBy": "cm1z8user123",
    "company": {
      "id": "cm1z8company123",
      "compName": "TechCorp",
      "place": "Paris, France"
    },
    "creator": {
      "id": "cm1z8user123",
      "firstname": "John",
      "lastname": "Doe",
      "email": "john.doe@techcorp.com"
    }
  }
]
```

### Erreur - Non authentifié
```json
{
  "success": false,
  "error": "Non authentifié"
}
```

### Erreur - Données invalides
```json
{
  "success": false,
  "error": "Données invalides",
  "details": [
    {
      "code": "too_small",
      "minimum": 1,
      "type": "string",
      "inclusive": true,
      "exact": false,
      "message": "Le lieu est requis",
      "path": ["place"]
    }
  ]
}
```

## Utilisation de Swagger UI

### 1. Ouvrir Swagger UI
- Aller sur http://localhost:3000/api-docs
- La documentation interactive se charge automatiquement

### 2. Authentification dans Swagger
- Cliquer sur le bouton "Authorize" 
- Dans le champ "Value", entrer : `next-auth.session-token=VOTRE_TOKEN`
- Cliquer sur "Authorize"

### 3. Tester les endpoints
- Développer un endpoint (ex: POST /api/companies)
- Cliquer sur "Try it out"
- Remplir les paramètres requis
- Cliquer sur "Execute"
- Voir la réponse en temps réel

## Avantages de Swagger UI

### Documentation Interactive
- Visualisation claire de tous les endpoints
- Schémas de données détaillés
- Exemples de requêtes/réponses

### Tests en Direct
- Exécution des requêtes directement depuis l'interface
- Gestion automatique des headers
- Validation des données en temps réel

### Collaboration Équipe
- Documentation toujours à jour
- Partage facile avec l'équipe
- Standards OpenAPI 3.0

## Configuration Avancée

### Variables d'environnement Swagger
```javascript
// Dans swagger.ts
servers: [
  {
    url: 'http://localhost:3000',
    description: 'Développement',
  },
  {
    url: 'https://votre-domaine.com',
    description: 'Production',
  },
]
```

### Personnalisation UI
```css
/* Styles personnalisés dans api-docs/page.tsx */
.swagger-ui .topbar { display: none; }
.swagger-ui .opblock.opblock-post { 
  border-color: #49cc90; 
  background: rgba(73, 204, 144, 0.1); 
}
```

## Notes Importantes

1. **Authentification** : Toujours se connecter avant de tester les endpoints protégés
2. **Schéma Prisma** : Les champs correspondent exactement au modèle Company dans schema.prisma
3. **Validation** : Zod valide automatiquement les données côté serveur
4. **Permissions** : Respecter les rôles (ADMIN/RECRUITER/USER) pour chaque endpoint

## Prêt à tester !

API Companies est documentée et testable via Swagger UI ! 
Accédez à http://localhost:3000/api-docs pour commencer. 
