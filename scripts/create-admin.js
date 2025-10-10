const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createAdmin() {
  try {
    // Vérifier si un admin existe déjà
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    })

    if (existingAdmin) {
      console.log('Un administrateur existe déjà:', existingAdmin.email)
      return
    }

    // Créer un mot de passe hashé
    const hashedPassword = await bcrypt.hash('admin123', 12)

    // Créer l'utilisateur admin
    const admin = await prisma.user.create({
      data: {
        firstname: 'Admin',
        lastname: 'System',
        email: 'admin@jobboard.com',
        password: hashedPassword,
        role: 'ADMIN'
      }
    })

    console.log('Administrateur créé avec succès:')
    console.log('Email:', admin.email)
    console.log('Mot de passe: admin123')
    console.log('Rôle:', admin.role)

  } catch (error) {
    console.error('Erreur lors de la création de l\'admin:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()
