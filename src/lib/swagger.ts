import swaggerJSDoc from 'swagger-jsdoc'

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Job Board API',
    version: '1.0.0',
    description: 'API pour la plateforme d\'offres d\'emploi Job Board',
    contact: {
      name: 'Équipe Job Board',
      email: 'contact@jobboard.com',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Serveur de développement',
    },
  ],
  tags: [
    {
      name: 'Companies',
      description: 'Gestion des entreprises',
    },
    {
      name: 'Jobs',
      description: 'Gestion des offres d\'emploi',
    },
  ],
  components: {
    securitySchemes: {
      cookieAuth: {
        in: 'cookie',
        name: 'next-auth.session-token',
        description: 'Cookie de session NextAuth.js',
      },
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'cm1z8abc123' },
          firstname: { type: 'string', example: 'John' },
          lastname: { type: 'string', example: 'Doe' },
          email: { type: 'string', format: 'email', example: 'john.doe@example.com' },
          phone: { type: 'string', example: '+33123456789' },
          role: { type: 'string', enum: ['USER', 'RECRUITER', 'ADMIN'], example: 'USER' },
          companyId: { type: 'string', nullable: true, example: 'cm1z8company123' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      Company: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'cm1z8company123' },
          compName: { type: 'string', example: 'TechCorp' },
          place: { type: 'string', example: 'Paris, France' },
          information: { type: 'string', nullable: true, example: 'Entreprise technologique innovante' },
          website: { type: 'string', format: 'uri', nullable: true, example: 'https://techcorp.com' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
          _count: {
            type: 'object',
            properties: {
              jobs: { type: 'integer', example: 5 },
              users: { type: 'integer', example: 3 },
            },
          },
        },
      },
      Job: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'cm1z8job123' },
          title: { type: 'string', example: 'Développeur Full Stack' },
          type: { 
            type: 'string', 
            enum: ['CDI', 'CDD', 'Stage', 'Freelance'],
            example: 'CDI' 
          },
          shortDescription: { type: 'string', example: 'Rejoignez notre équipe de développement' },
          description: { type: 'string', example: 'Nous recherchons un développeur expérimenté...' },
          salary: { type: 'number', nullable: true, example: 45000 },
          location: { type: 'string', example: 'Paris, France' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
          companyId: { type: 'string', example: 'cm1z8company123' },
          createdBy: { type: 'string', example: 'cm1z8user123' },
          company: { $ref: '#/components/schemas/Company' },
          creator: {
            type: 'object',
            properties: {
              id: { type: 'string', example: 'cm1z8user123' },
              firstname: { type: 'string', example: 'John' },
              lastname: { type: 'string', example: 'Doe' },
              email: { type: 'string', example: 'john.doe@company.com' },
            },
          },
          _count: {
            type: 'object',
            properties: {
              jobApplications: { type: 'integer', example: 12 },
            },
          },
        },
      },
      JobApplication: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'cm1z8app123' },
          message: { type: 'string', example: 'Je suis très intéressé par ce poste...' },
          applicantName: { type: 'string', example: 'Marie Dupont' },
          applicantEmail: { type: 'string', example: 'marie.dupont@email.com' },
          applicantPhone: { type: 'string', nullable: true, example: '+33123456789' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
          jobId: { type: 'string', example: 'cm1z8job123' },
          userId: { type: 'string', nullable: true, example: 'cm1z8user123' },
        },
      },
      Application: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'cm1z8app123' },
          userId: { type: 'string', example: 'cm1z8user123' },
          jobId: { type: 'string', example: 'cm1z8job123' },
          status: { type: 'string', enum: ['PENDING', 'ACCEPTED', 'REJECTED'], example: 'PENDING' },
          coverLetter: { type: 'string', example: 'Je suis très intéressé par ce poste...' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      ApiResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Opération réussie' },
          error: { type: 'string', example: 'Message d\'erreur' },
        },
      },
      PaginatedResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          data: { type: 'array', items: {} },
          pagination: {
            type: 'object',
            properties: {
              page: { type: 'integer', example: 1 },
              limit: { type: 'integer', example: 10 },
              total: { type: 'integer', example: 25 },
              pages: { type: 'integer', example: 3 },
            },
          },
        },
      },
      Error: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          error: { type: 'string', example: 'Message d\'erreur' },
          details: { type: 'array', items: { type: 'object' } },
        },
      },
    },
  },
  security: [
    {
      cookieAuth: [],
    },
  ],
}

const options = {
  definition: swaggerDefinition,
  apis: [
    './src/app/api/**/*.ts', // Chemins vers les fichiers API
    './src/lib/swagger-docs.ts', // Documentation supplémentaire
  ],
}

export const swaggerSpec = swaggerJSDoc(options)
