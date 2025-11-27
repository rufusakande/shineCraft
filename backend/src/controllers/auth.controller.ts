import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models';
import { AuthRequest } from '../middlewares/auth.middleware';
import emailService from '../services/email.service';

interface RegisterBody {
  username?: string;
  name?: string;
  email: string;
  password: string;
}

interface LoginBody {
  email: string;
  password: string;
}

class AuthController {
  private generateToken(user: any) {
    return jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );
  }

  async register(req: Request<{}, {}, RegisterBody>, res: Response) {
    try {
      const { name, username, email, password } = req.body;

      // Use username as name if name is not provided
      const displayName = name || username || email.split('@')[0];

      // Check if user exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already registered' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = await User.create({
        name: displayName,
        email,
        password: hashedPassword,
        role: 'customer', // Default role for registration
      });

      // Send welcome email (fire and forget - don't wait for it)
      emailService
        .sendWelcomeEmail(user.email, user.name)
        .catch((err) => console.error('Failed to send welcome email:', err));

      // Generate token
      const token = this.generateToken(user);

      // Return response
      return res.status(201).json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error('Registration error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async login(req: Request<{}, {}, LoginBody>, res: Response) {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Check password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate token
      const token = this.generateToken(user);

      // Return response
      return res.status(200).json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getMe(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Not authenticated' });
      }

      return res.status(200).json({
        user: req.user,
      });
    } catch (error) {
      console.error('GetMe error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}

export default new AuthController();