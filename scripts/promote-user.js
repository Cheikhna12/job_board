const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function promoteUser() {
  const email = process.argv[2]
  
  if (!email) {
    console.log('Usage: node scripts/promote-user.js <email>')
    console.log('Exemple: node scripts/promote-user.js hamedcheick933@gmail.com')
    return
  }

  try {
    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      console.log(`Utilisateur avec l'email ${email} non trouvé`)
      return
    }

    // Promouvoir l'utilisateur en ADMIN
    const updatedUser = await prisma.user.update({
      where: { email },
      data: { role: 'ADMIN' }
    })

    console.log('Utilisateur promu avec succès:')
    console.log(`Nom: ${updatedUser.firstname} ${updatedUser.lastname}`)
    console.log(`Email: ${updatedUser.email}`)
    console.log(`Nouveau rôle: ${updatedUser.role}`)

  } catch (error) {
    console.error('Erreur lors de la promotion:', error)
  } finally {
    await prisma.$disconnect()
  }
}

promoteUser()
