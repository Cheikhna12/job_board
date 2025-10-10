const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function listUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        firstname: true,
        lastname: true,
        email: true,
        role: true,
        createdAt: true,
        company: {
          select: {
            compName: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    console.log('=== LISTE DES UTILISATEURS ===')
    console.log(`Total: ${users.length} utilisateur(s)\n`)

    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.firstname} ${user.lastname}`)
      console.log(`   Email: ${user.email}`)
      console.log(`   Rôle: ${user.role}`)
      console.log(`   Entreprise: ${user.company?.compName || 'Aucune'}`)
      console.log(`   Créé le: ${user.createdAt.toLocaleDateString('fr-FR')}`)
      console.log('')
    })

  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error)
  } finally {
    await prisma.$disconnect()
  }
}

listUsers()
