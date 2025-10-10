/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: Endpoints d'authentification
 *   - name: Companies
 *     description: Gestion des entreprises
 *   - name: Jobs
 *     description: Gestion des offres d'emploi
 *   - name: Applications
 *     description: Gestion des candidatures
 *   - name: Users
 *     description: Gestion des utilisateurs
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags: [Authentication]
 *     summary: Inscription d'un nouvel utilisateur
 *     description: Créer un nouveau compte utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstname
 *               - lastname
 *               - email
 *               - password
 *             properties:
 *               firstname:
 *                 type: string
 *                 example: "John"
 *               lastname:
 *                 type: string
 *                 example: "Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john.doe@example.com"
 *               phone:
 *                 type: string
 *                 example: "+33123456789"
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 example: "password123"
 *     responses:
 *       201:
 *         description: Compte créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Compte créé avec succès"
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Données invalides
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Email déjà utilisé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/companies:
 *   get:
 *     tags: [Companies]
 *     summary: Liste des entreprises
 *     description: Récupère la liste paginée des entreprises avec recherche optionnelle
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Numéro de page
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Nombre d'éléments par page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Terme de recherche (nom, information, lieu)
 *     responses:
 *       200:
 *         description: Liste des entreprises récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/PaginatedResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Company'
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   post:
 *     tags: [Companies]
 *     summary: Créer une entreprise
 *     description: Créer une nouvelle entreprise (ADMIN seulement)
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - compName
 *               - place
 *             properties:
 *               compName:
 *                 type: string
 *                 minLength: 2
 *                 example: "TechCorp"
 *               place:
 *                 type: string
 *                 minLength: 1
 *                 example: "Paris, France"
 *               information:
 *                 type: string
 *                 example: "Entreprise technologique innovante"
 *               website:
 *                 type: string
 *                 format: uri
 *                 example: "https://techcorp.com"
 *     responses:
 *       201:
 *         description: Entreprise créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Entreprise créée avec succès"
 *                 data:
 *                   $ref: '#/components/schemas/Company'
 *       400:
 *         description: Données invalides ou entreprise déjà existante
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Non authentifié
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Accès refusé (ADMIN requis)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/jobs:
 *   get:
 *     summary: Liste toutes les offres d'emploi
 *     tags: [Jobs]
 *     responses:
 *       200:
 *         description: Liste des offres d'emploi récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 allOf:
 *                   - $ref: '#/components/schemas/Job'
 *                   - type: object
 *                     properties:
 *                       company:
 *                         $ref: '#/components/schemas/Company'
 *                       creator:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           firstname:
 *                             type: string
 *                           lastname:
 *                             type: string
 *                           email:
 *                             type: string
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   post:
 *     summary: Créer une nouvelle offre d'emploi
 *     tags: [Jobs]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - type
 *               - shortDescription
 *               - description
 *               - salary
 *               - location
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Développeur Full Stack"
 *               type:
 *                 type: string
 *                 enum: [CDI, CDD, Stage, Freelance]
 *                 example: "CDI"
 *               shortDescription:
 *                 type: string
 *                 example: "Rejoignez notre équipe de développement"
 *               description:
 *                 type: string
 *                 example: "Nous recherchons un développeur expérimenté en React et Node.js..."
 *               salary:
 *                 type: number
 *                 example: 45000
 *               location:
 *                 type: string
 *                 example: "Paris, France"
 *     responses:
 *       201:
 *         description: Offre d'emploi créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Job'
 *       400:
 *         description: Données invalides ou utilisateur sans entreprise
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Accès refusé - Rôle RECRUITER ou ADMIN requis
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/jobs/{id}:
 *   get:
 *     summary: Récupère les détails d'une offre d'emploi
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'offre d'emploi
 *     responses:
 *       200:
 *         description: Détails de l'offre d'emploi
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Job'
 *                 - type: object
 *                   properties:
 *                     company:
 *                       $ref: '#/components/schemas/Company'
 *                     creator:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         firstname:
 *                           type: string
 *                         lastname:
 *                           type: string
 *                         email:
 *                           type: string
 *                     jobApplications:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/JobApplication'
 *       404:
 *         description: Offre d'emploi non trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   put:
 *     summary: Modifier une offre d'emploi
 *     tags: [Jobs]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'offre d'emploi
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Développeur Full Stack Senior"
 *               type:
 *                 type: string
 *                 enum: [CDI, CDD, Stage, Freelance]
 *                 example: "CDI"
 *               shortDescription:
 *                 type: string
 *                 example: "Poste senior dans notre équipe"
 *               description:
 *                 type: string
 *                 example: "Description mise à jour..."
 *               salary:
 *                 type: number
 *                 example: 55000
 *               location:
 *                 type: string
 *                 example: "Lyon, France"
 *     responses:
 *       200:
 *         description: Offre d'emploi modifiée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Job'
 *       403:
 *         description: Accès refusé - Rôle RECRUITER ou ADMIN requis
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   delete:
 *     summary: Supprimer une offre d'emploi
 *     tags: [Jobs]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'offre d'emploi
 *     responses:
 *       200:
 *         description: Offre d'emploi supprimée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Offre supprimée"
 *       403:
 *         description: Accès refusé - Rôle RECRUITER ou ADMIN requis
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Liste tous les utilisateurs (ADMIN seulement)
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Numéro de page
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Nombre d'éléments par page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Recherche par nom, prénom ou email
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [USER, RECRUITER, ADMIN]
 *         description: Filtrer par rôle
 *     responses:
 *       200:
 *         description: Liste des utilisateurs récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 *       403:
 *         description: Accès refusé - Rôle ADMIN requis
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   post:
 *     summary: Créer un nouvel utilisateur (ADMIN seulement)
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstname
 *               - lastname
 *               - email
 *               - password
 *             properties:
 *               firstname:
 *                 type: string
 *                 example: "John"
 *               lastname:
 *                 type: string
 *                 example: "Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john.doe@example.com"
 *               phone:
 *                 type: string
 *                 example: "+33123456789"
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: "password123"
 *               role:
 *                 type: string
 *                 enum: [USER, RECRUITER, ADMIN]
 *                 default: USER
 *                 example: "USER"
 *               companyId:
 *                 type: string
 *                 example: "cm1z8company123"
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/User'
 *       400:
 *         description: Données invalides
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Accès refusé - Rôle ADMIN requis
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Email déjà utilisé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Récupère les détails d'un utilisateur
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur
 *     responses:
 *       200:
 *         description: Détails de l'utilisateur récupérés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/User'
 *       403:
 *         description: Accès refusé - Vous ne pouvez voir que votre propre profil
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Utilisateur non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   put:
 *     summary: Modifier un utilisateur
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstname:
 *                 type: string
 *                 example: "John"
 *               lastname:
 *                 type: string
 *                 example: "Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john.doe@example.com"
 *               phone:
 *                 type: string
 *                 example: "+33123456789"
 *               role:
 *                 type: string
 *                 enum: [USER, RECRUITER, ADMIN]
 *                 example: "RECRUITER"
 *               companyId:
 *                 type: string
 *                 example: "cm1z8company123"
 *     responses:
 *       200:
 *         description: Utilisateur modifié avec succès
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/User'
 *       400:
 *         description: Données invalides
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Accès refusé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Utilisateur non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Email déjà utilisé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   delete:
 *     summary: Supprimer un utilisateur (ADMIN seulement)
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur
 *     responses:
 *       200:
 *         description: Utilisateur supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Vous ne pouvez pas supprimer votre propre compte
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Accès refusé - Rôle ADMIN requis
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Utilisateur non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/applications:
 *   get:
 *     summary: Liste des candidatures
 *     tags: [Applications]
 *     security:
 *       - cookieAuth: []
 *     description: |
 *       - **USER**: Voit seulement ses propres candidatures
 *       - **RECRUITER/ADMIN**: Voit toutes les candidatures
 *     responses:
 *       200:
 *         description: Liste des candidatures récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 allOf:
 *                   - $ref: '#/components/schemas/JobApplication'
 *                   - type: object
 *                     properties:
 *                       job:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           title:
 *                             type: string
 *                           company:
 *                             type: object
 *                             properties:
 *                               compName:
 *                                 type: string
 *                       user:
 *                         type: object
 *                         nullable: true
 *                         properties:
 *                           id:
 *                             type: string
 *                           firstname:
 *                             type: string
 *                           lastname:
 *                             type: string
 *                           email:
 *                             type: string
 *       403:
 *         description: Non autorisé - Authentification requise
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   post:
 *     summary: Créer une candidature
 *     tags: [Applications]
 *     description: Permet de postuler à une offre d'emploi. Peut être fait par un utilisateur connecté ou anonyme.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - jobId
 *               - message
 *               - applicantName
 *               - applicantEmail
 *             properties:
 *               jobId:
 *                 type: string
 *                 example: "cm1z8job123"
 *                 description: ID de l'offre d'emploi
 *               message:
 *                 type: string
 *                 example: "Je suis très intéressé par ce poste car..."
 *                 description: Message de motivation
 *               applicantName:
 *                 type: string
 *                 example: "Marie Dupont"
 *                 description: Nom complet du candidat
 *               applicantEmail:
 *                 type: string
 *                 format: email
 *                 example: "marie.dupont@email.com"
 *                 description: Email du candidat
 *               applicantPhone:
 *                 type: string
 *                 example: "+33123456789"
 *                 description: Téléphone du candidat (optionnel)
 *     responses:
 *       201:
 *         description: Candidature créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JobApplication'
 *       400:
 *         description: Champs obligatoires manquants
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/applications/{id}:
 *   put:
 *     summary: Modifier le statut d'une candidature (RECRUITER/ADMIN)
 *     tags: [Applications]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la candidature
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [EN_ATTENTE, ACCEPTEE, REFUSEE]
 *                 example: "ACCEPTEE"
 *                 description: Nouveau statut de la candidature
 *     responses:
 *       200:
 *         description: Statut de la candidature mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/JobApplication'
 *       400:
 *         description: Statut manquant ou invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Non autorisé - Rôle RECRUITER/ADMIN requis
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/companies/{id}:
 *   get:
 *     tags: [Companies]
 *     summary: Détails d'une entreprise
 *     description: Récupère les détails d'une entreprise avec ses jobs et recruteurs
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'entreprise
 *     responses:
 *       200:
 *         description: Détails de l'entreprise récupérés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   allOf:
 *                     - $ref: '#/components/schemas/Company'
 *                     - type: object
 *                       properties:
 *                         jobs:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Job'
 *                         users:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/User'
 *       404:
 *         description: Entreprise non trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   put:
 *     tags: [Companies]
 *     summary: Modifier une entreprise
 *     description: Modifier une entreprise (ADMIN ou RECRUITER de l'entreprise)
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'entreprise
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               compName:
 *                 type: string
 *                 minLength: 2
 *               compDescription:
 *                 type: string
 *               compAddress:
 *                 type: string
 *               compPhone:
 *                 type: string
 *               compEmail:
 *                 type: string
 *                 format: email
 *               compWebsite:
 *                 type: string
 *                 format: uri
 *     responses:
 *       200:
 *         description: Entreprise modifiée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Entreprise modifiée avec succès"
 *                 data:
 *                   $ref: '#/components/schemas/Company'
 *       400:
 *         description: Données invalides
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Non authentifié
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Accès refusé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Entreprise non trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     tags: [Companies]
 *     summary: Supprimer une entreprise
 *     description: Supprimer une entreprise (ADMIN seulement)
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'entreprise
 *     responses:
 *       200:
 *         description: Entreprise supprimée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Entreprise supprimée avec succès"
 *       400:
 *         description: Impossible de supprimer (dépendances existantes)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Non authentifié
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Accès refusé (ADMIN requis)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Entreprise non trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
