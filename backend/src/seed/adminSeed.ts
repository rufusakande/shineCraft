import { User } from '../models';
import bcrypt from 'bcrypt';

export const seedAdmin = async () => {
  try {
    // Vérifie si un admin existe déjà
    const existingAdmin = await User.findOne({
      where: {
        role: 'admin',
        email: 'akanderufus51@gmail.com'
      }
    });

    if (existingAdmin) {
      console.log('👑 Admin user already exists');
      return;
    }

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash('@Azertyuiop@', 10);

    // Création de l'admin
    await User.create({
      name: 'Admin User',
      email: 'akanderufus51@gmail.com',
      password: hashedPassword,
      role: 'admin'
    });

    console.log('👑 Admin user created successfully');
  } catch (error) {
    console.error('Error seeding admin user:', error);
    throw error;
  }
};

// Si le script est exécuté directement (npm run seed)
if (require.main === module) {
  seedAdmin()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}