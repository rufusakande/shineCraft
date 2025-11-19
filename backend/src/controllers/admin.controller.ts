import { Request, Response } from 'express';
import User from '../models/User';
import AdminSettings from '../models/AdminSettings';
import { AuthRequest } from '../middlewares/auth.middleware';

class AdminProfileController {
  /**
   * GET /api/admin/profile
   * Récupère les informations du profil administrateur connecté
   */
  async getProfile(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId;
      
      const user = await User.findByPk(userId, {
        attributes: {
          exclude: ['password']
        }
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'Administrateur non trouvé'
        });
      }

      return res.status(200).json({
        success: true,
        data: {
          id: user.id,
          name: user.name,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          avatar: user.avatar,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      });
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error);
      return res.status(500).json({
        success: false,
        error: 'Erreur serveur'
      });
    }
  }

  /**
   * PUT /api/admin/profile
   * Met à jour les informations du profil administrateur
   */
  async updateProfile(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId;
      const { firstName, lastName, email, phone, avatar } = req.body;

      // Validation
      if (!firstName || !lastName) {
        return res.status(400).json({
          success: false,
          error: 'Le prénom et le nom sont obligatoires'
        });
      }

      if (!email) {
        return res.status(400).json({
          success: false,
          error: 'L\'email est obligatoire'
        });
      }

      // Vérifier si l'email est déjà utilisé par un autre utilisateur
      const existingUser = await User.findOne({
        where: {
          email,
          id: { [require('sequelize').Op.ne]: userId }
        }
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: 'Cet email est déjà utilisé'
        });
      }

      // Mettre à jour l'utilisateur
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'Administrateur non trouvé'
        });
      }

      await user.update({
        firstName,
        lastName,
        email,
        phone: phone || null,
        avatar: avatar || null,
        name: `${firstName} ${lastName}` // Mise à jour du champ name pour compatibilité
      });

      return res.status(200).json({
        success: true,
        message: 'Profil mis à jour avec succès',
        data: {
          id: user.id,
          name: user.name,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          avatar: user.avatar,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      return res.status(500).json({
        success: false,
        error: 'Erreur serveur'
      });
    }
  }
}

class AdminSettingsController {
  /**
   * GET /api/admin/settings
   * Récupère les paramètres d'administration
   */
  async getSettings(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId;

      let settings = await AdminSettings.findOne({
        where: { userId }
      });

      // Si les paramètres n'existent pas, créer les valeurs par défaut
      if (!settings) {
        const defaultSettings = {
          notifications: {
            orders: true,
            users: true,
            products: true,
            email: true,
          },
          security: {
            twoFactor: false,
            sessionTimeout: 60,
          },
          preferences: {
            theme: 'light',
            language: 'fr',
          },
        };

        return res.status(200).json({
          success: true,
          data: defaultSettings
        });
      }

      return res.status(200).json({
        success: true,
        data: {
          notifications: settings.notifications || {},
          security: settings.security || {},
          preferences: settings.preferences || {},
        }
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des paramètres:', error);
      return res.status(500).json({
        success: false,
        error: 'Erreur serveur'
      });
    }
  }

  /**
   * PUT /api/admin/settings
   * Met à jour les paramètres d'administration
   */
  async updateSettings(req: AuthRequest, res: Response) {
    try {
      const userId = req.userId;
      const { notifications, security, preferences } = req.body;

      // Validation
      if (!notifications || !security || !preferences) {
        return res.status(400).json({
          success: false,
          error: 'Les paramètres notifications, security et preferences sont obligatoires'
        });
      }

      // Validation du délai de session
      if (security.sessionTimeout && security.sessionTimeout < 15) {
        return res.status(400).json({
          success: false,
          error: 'Le délai de session doit être au minimum 15 minutes'
        });
      }

      // Chercher ou créer les paramètres
      let settings = await AdminSettings.findOne({
        where: { userId }
      });

      if (!settings) {
        settings = await AdminSettings.create({
          userId,
          notifications,
          security,
          preferences,
        });
      } else {
        await settings.update({
          notifications: {
            ...settings.notifications,
            ...notifications,
          },
          security: {
            ...settings.security,
            ...security,
          },
          preferences: {
            ...settings.preferences,
            ...preferences,
          },
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Paramètres mis à jour avec succès',
        data: {
          notifications: settings.notifications,
          security: settings.security,
          preferences: settings.preferences,
        }
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour des paramètres:', error);
      return res.status(500).json({
        success: false,
        error: 'Erreur serveur'
      });
    }
  }
}

export const adminProfileController = new AdminProfileController();
export const adminSettingsController = new AdminSettingsController();
