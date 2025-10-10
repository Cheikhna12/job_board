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

## Tests API Users

### GET /api/users - Liste des utilisateurs (ADMIN seulement)
```http
GET /api/users?page=1&limit=10&search=john&role=USER
Cookie: next-auth.session-token=ADMIN_TOKEN
```

### POST /api/users - Créer un utilisateur (ADMIN seulement)
```http
POST /api/users
Content-Type: application/json
Cookie: next-auth.session-token=ADMIN_TOKEN

{
  "firstname": "John",
  "lastname": "Doe",
  "email": "john.doe@example.com",
  "phone": "+33123456789",
  "password": "password123",
  "role": "USER",
  "companyId": "cm1z8company123"
}
```

### GET /api/users/{id} - Détails d'un utilisateur
```http
GET /api/users/cm1z8example-user-id
Cookie: next-auth.session-token=USER_TOKEN
```

### PUT /api/users/{id} - Modifier un utilisateur
```http
PUT /api/users/cm1z8example-user-id
Content-Type: application/json
Cookie: next-auth.session-token=USER_TOKEN

{
  "firstname": "John Updated",
  "lastname": "Doe Updated",
  "email": "john.updated@example.com",
  "phone": "+33987654321"
}
```

### PUT /api/users/{id} - Changer le rôle (ADMIN seulement)
```http
PUT /api/users/cm1z8example-user-id
Content-Type: application/json
Cookie: next-auth.session-token=ADMIN_TOKEN

{
  "role": "RECRUITER",
  "companyId": "cm1z8company123"
}
```

### DELETE /api/users/{id} - Supprimer un utilisateur (ADMIN seulement)
```http
DELETE /api/users/cm1z8example-user-id
Cookie: next-auth.session-token=ADMIN_TOKEN
```

## Tests API Applications

### GET /api/applications - Liste des candidatures
```http
GET /api/applications
Cookie: next-auth.session-token=USER_TOKEN
```

### GET /api/applications - Toutes les candidatures (RECRUITER/ADMIN)
```http
GET /api/applications
Cookie: next-auth.session-token=RECRUITER_TOKEN
```

### POST /api/applications - Postuler à une offre (utilisateur connecté)
```http
POST /api/applications
Content-Type: application/json
Cookie: next-auth.session-token=USER_TOKEN

{
  "jobId": "cm1z8job123",
  "message": "Je suis très intéressé par ce poste car j'ai 5 ans d'expérience en développement React et Node.js. Mon profil correspond parfaitement aux exigences mentionnées.",
  "applicantName": "Marie Dupont",
  "applicantEmail": "marie.dupont@email.com",
  "applicantPhone": "+33123456789"
}
```

### POST /api/applications - Postuler anonyme (sans connexion)
```http
POST /api/applications
Content-Type: application/json

{
  "jobId": "cm1z8job123",
  "message": "Candidature spontanée pour le poste de développeur. Vous trouverez mon CV en pièce jointe.",
  "applicantName": "Jean Martin",
  "applicantEmail": "jean.martin@email.com",
  "applicantPhone": "+33987654321"
}
```

### PUT /api/applications/{id} - Changer statut candidature (RECRUITER/ADMIN)
```http
PUT /api/applications/cm1z8app123
Content-Type: application/json
Cookie: next-auth.session-token=RECRUITER_TOKEN

{
  "status": "ACCEPTEE"
}
```

### PUT /api/applications/{id} - Refuser candidature (RECRUITER/ADMIN)
```http
PUT /api/applications/cm1z8app123
Content-Type: application/json
Cookie: next-auth.session-token=RECRUITER_TOKEN

{
  "status": "REFUSEE"
}
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

### Succès - Liste des utilisateurs (ADMIN)
```json
{
  "success": true,
  "data": [
    {
      "id": "cm1z8user123",
      "firstname": "John",
      "lastname": "Doe",
      "email": "john.doe@example.com",
      "phone": "+33123456789",
      "role": "USER",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "companyId": null,
      "company": null,
      "_count": {
        "jobApplications": 3,
        "createdJobs": 0
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 15,
    "pages": 2
  }
}
```

### Succès - Détails utilisateur avec relations
```json
{
  "success": true,
  "data": {
    "id": "cm1z8user123",
    "firstname": "John",
    "lastname": "Doe",
    "email": "john.doe@example.com",
    "phone": "+33123456789",
    "role": "RECRUITER",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "companyId": "cm1z8company123",
    "company": {
      "id": "cm1z8company123",
      "compName": "TechCorp",
      "place": "Paris, France",
      "website": "https://techcorp.com"
    },
    "jobApplications": [
      {
        "id": "cm1z8app123",
        "message": "Je suis intéressé par ce poste...",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "job": {
          "id": "cm1z8job123",
          "title": "Développeur Full Stack",
          "company": {
            "compName": "TechCorp"
          }
        }
      }
    ],
    "createdJobs": [
      {
        "id": "cm1z8job456",
        "title": "Développeur Backend",
        "type": "CDI",
        "location": "Paris, France",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "_count": {
          "jobApplications": 8
        }
      }
    ],
    "_count": {
      "jobApplications": 2,
      "createdJobs": 3
    }
  }
}
```

### Succès - Liste des candidatures (USER)
```json
[
  {
    "id": "cm1z8app123",
    "message": "Je suis très intéressé par ce poste...",
    "applicantName": "Marie Dupont",
    "applicantEmail": "marie.dupont@email.com",
    "applicantPhone": "+33123456789",
    "status": "EN_ATTENTE",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "jobId": "cm1z8job123",
    "userId": "cm1z8user123",
    "job": {
      "id": "cm1z8job123",
      "title": "Développeur Full Stack",
      "company": {
        "compName": "TechCorp"
      }
    },
    "user": {
      "id": "cm1z8user123",
      "firstname": "Marie",
      "lastname": "Dupont",
      "email": "marie.dupont@email.com"
    }
  }
]
```

### Succès - Candidature créée
```json
{
  "id": "cm1z8app456",
  "message": "Candidature pour le poste de développeur...",
  "applicantName": "Jean Martin",
  "applicantEmail": "jean.martin@email.com",
  "applicantPhone": "+33987654321",
  "status": "EN_ATTENTE",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "jobId": "cm1z8job123",
  "userId": null
}
```

### Succès - Statut candidature mis à jour
```json
{
  "id": "cm1z8app123",
  "message": "Je suis très intéressé par ce poste...",
  "applicantName": "Marie Dupont",
  "applicantEmail": "marie.dupont@email.com",
  "applicantPhone": "+33123456789",
  "status": "ACCEPTEE",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T10:30:00.000Z",
  "jobId": "cm1z8job123",
  "userId": "cm1z8user123"
}
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
- La documentation se charge automatiquement

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


