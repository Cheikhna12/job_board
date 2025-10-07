import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Début du seeding...')

  // Nettoyer la base de données
  await prisma.jobApplication.deleteMany()
  await prisma.job.deleteMany()
  await prisma.user.deleteMany()
  await prisma.company.deleteMany()

  // Créer des entreprises
  const companies = await Promise.all([
    prisma.company.create({
      data: {
        compName: 'TechCorp',
        place: 'Paris, France',
        information: 'Leader dans le développement de solutions logicielles innovantes.',
        website: 'https://techcorp.example.com',
      },
    }),
    prisma.company.create({
      data: {
        compName: 'DataSolutions',
        place: 'Lyon, France',
        information: 'Spécialiste en analyse de données et intelligence artificielle.',
        website: 'https://datasolutions.example.com',
      },
    }),
    prisma.company.create({
      data: {
        compName: 'WebAgency Pro',
        place: 'Marseille, France',
        information: 'Agence web créative et dynamique.',
        website: 'https://webagency.example.com',
      },
    }),
  ])

  console.log(`✅ ${companies.length} entreprises créées`)

  // Hasher les mots de passe
  const hashedPassword = await bcrypt.hash('password123', 10)

  // Créer un admin
  const admin = await prisma.user.create({
    data: {
      firstname: 'Admin',
      lastname: 'User',
      email: 'admin@jobboard.com',
      phone: '+33 1 23 45 67 89',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  console.log(`✅ Admin créé: ${admin.email}`)

  // Créer des recruteurs
  const recruiters = await Promise.all([
    prisma.user.create({
      data: {
        firstname: 'Marie',
        lastname: 'Dupont',
        email: 'marie.dupont@techcorp.com',
        phone: '+33 1 23 45 67 90',
        password: hashedPassword,
        role: 'RECRUITER',
        companyId: companies[0].id,
      },
    }),
    prisma.user.create({
      data: {
        firstname: 'Pierre',
        lastname: 'Martin',
        email: 'pierre.martin@datasolutions.com',
        phone: '+33 1 23 45 67 91',
        password: hashedPassword,
        role: 'RECRUITER',
        companyId: companies[1].id,
      },
    }),
  ])

  console.log(`✅ ${recruiters.length} recruteurs créés`)

  // Créer des candidats
  const users = await Promise.all([
    prisma.user.create({
      data: {
        firstname: 'Jean',
        lastname: 'Dubois',
        email: 'jean.dubois@example.com',
        phone: '+33 6 12 34 56 78',
        password: hashedPassword,
        role: 'USER',
      },
    }),
    prisma.user.create({
      data: {
        firstname: 'Sophie',
        lastname: 'Bernard',
        email: 'sophie.bernard@example.com',
        phone: '+33 6 12 34 56 79',
        password: hashedPassword,
        role: 'USER',
      },
    }),
  ])

  console.log(`✅ ${users.length} candidats créés`)

  // Créer des offres d'emploi
  const jobs = await Promise.all([
    prisma.job.create({
      data: {
        title: 'Développeur Full Stack',
        type: 'CDI',
        shortDescription: 'Nous recherchons un développeur full stack passionné pour rejoindre notre équipe dynamique.',
        description: `Nous recherchons un développeur full stack expérimenté pour travailler sur des projets innovants.

Responsabilités:
- Développer des applications web modernes avec React et Node.js
- Participer à la conception de l'architecture technique
- Collaborer avec l'équipe produit et design
- Assurer la qualité du code et les tests

Compétences requises:
- 3+ ans d'expérience en développement web
- Maîtrise de React, Node.js, TypeScript
- Expérience avec PostgreSQL
- Connaissance de Git et des méthodologies agiles

Avantages:
- Salaire attractif
- Télétravail flexible
- Formations continues
- Tickets restaurant`,
        salary: 45000.00,
        location: 'Paris, France',
        companyId: companies[0].id,
        createdBy: recruiters[0].id,
      },
    }),
    prisma.job.create({
      data: {
        title: 'Data Scientist',
        type: 'CDI',
        shortDescription: 'Rejoignez notre équipe data pour analyser et valoriser nos données.',
        description: `Nous cherchons un Data Scientist pour extraire des insights de nos données massives.

Missions:
- Analyser des données complexes
- Créer des modèles prédictifs
- Visualiser les résultats
- Collaborer avec les équipes métier

Profil recherché:
- Master en data science ou équivalent
- Python, pandas, scikit-learn
- SQL avancé
- Curiosité et esprit analytique

Nous offrons:
- Environnement stimulant
- Projets variés
- Équipe experte
- Package attractif`,
        salary: 50000.00,
        location: 'Lyon, France',
        companyId: companies[1].id,
        createdBy: recruiters[1].id,
      },
    }),
    prisma.job.create({
      data: {
        title: 'Designer UI/UX',
        type: 'CDD',
        shortDescription: 'Créez des expériences utilisateur exceptionnelles pour nos clients.',
        description: `Nous recherchons un designer UI/UX créatif pour nos projets web.

Votre rôle:
- Concevoir des interfaces intuitives
- Réaliser des wireframes et prototypes
- Conduire des tests utilisateurs
- Collaborer avec les développeurs

Compétences:
- Portfolio démontrant votre expertise
- Figma, Sketch, Adobe XD
- Connaissance du design system
- Sens du détail

Conditions:
- CDD 12 mois
- Possibilité de CDI
- Bureau moderne à Marseille
- Ambiance conviviale`,
        salary: 38000.00,
        location: 'Marseille, France',
        companyId: companies[2].id,
        createdBy: admin.id,
      },
    }),
    prisma.job.create({
      data: {
        title: 'Stage Développeur Web',
        type: 'Stage',
        shortDescription: 'Stage de 6 mois pour apprendre le développement web en situation réelle.',
        description: `Offre de stage développeur web pour étudiant motivé.

Ce que vous ferez:
- Participer au développement de nos applications
- Apprendre les bonnes pratiques
- Travailler en équipe agile
- Contribuer à des projets réels

Profil:
- Étudiant en informatique (Bac+3/4)
- Bases en HTML, CSS, JavaScript
- Motivation et curiosité
- Esprit d'équipe

Stage:
- 6 mois
- Gratification légale
- Possibilité d'embauche
- Mentorat personnalisé`,
        salary: 600.00,
        location: 'Paris, France',
        companyId: companies[0].id,
        createdBy: recruiters[0].id,
      },
    }),
  ])

  console.log(`✅ ${jobs.length} offres d'emploi créées`)

  // Créer des candidatures
  const applications = await Promise.all([
    prisma.jobApplication.create({
      data: {
        userId: users[0].id,
        jobId: jobs[0].id,
        message: 'Je suis très intéressé par ce poste de développeur full stack. Mon expérience de 4 ans en React et Node.js correspond parfaitement à vos besoins.',
        applicantName: `${users[0].firstname} ${users[0].lastname}`,
        applicantEmail: users[0].email,
        applicantPhone: users[0].phone,
      },
    }),
    prisma.jobApplication.create({
      data: {
        userId: users[1].id,
        jobId: jobs[1].id,
        message: 'Diplômée d\'un master en data science, je souhaite mettre mes compétences au service de votre équipe.',
        applicantName: `${users[1].firstname} ${users[1].lastname}`,
        applicantEmail: users[1].email,
        applicantPhone: users[1].phone,
      },
    }),
    prisma.jobApplication.create({
      data: {
        userId: users[0].id,
        jobId: jobs[3].id,
        message: 'Je cherche un stage pour valider ma dernière année d\'études. Votre entreprise m\'attire beaucoup.',
        applicantName: `${users[0].firstname} ${users[0].lastname}`,
        applicantEmail: users[0].email,
        applicantPhone: users[0].phone,
      },
    }),
    // Candidature non authentifiée
    prisma.jobApplication.create({
      data: {
        jobId: jobs[2].id,
        message: 'Bonjour, je suis designer freelance avec 5 ans d\'expérience. Je serais ravi de rejoindre votre équipe.',
        applicantName: 'Lucas Petit',
        applicantEmail: 'lucas.petit@example.com',
        applicantPhone: '+33 6 98 76 54 32',
      },
    }),
  ])

  console.log(`✅ ${applications.length} candidatures créées`)

  console.log('\n🎉 Seeding terminé avec succès!')
  console.log('\n📧 Comptes de test:')
  console.log('   Admin: admin@jobboard.com / password123')
  console.log('   Recruteur 1: marie.dupont@techcorp.com / password123')
  console.log('   Recruteur 2: pierre.martin@datasolutions.com / password123')
  console.log('   Candidat 1: jean.dubois@example.com / password123')
  console.log('   Candidat 2: sophie.bernard@example.com / password123')
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
