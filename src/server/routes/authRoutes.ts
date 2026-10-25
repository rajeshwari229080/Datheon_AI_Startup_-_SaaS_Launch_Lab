// Auth Routes (/api/auth)
import { Router, Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';

export const authRouter = Router();

authRouter.post('/register', (req: Request, res: Response): void => {
  try {
    const { email, password, role } = req.body;
    const result = AuthService.register(email, password, role);
    res.status(201).json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Registration failed' });
  }
});

authRouter.post('/login', (req: Request, res: Response): void => {
  try {
    const { email, password } = req.body;
    const result = AuthService.login(email, password);
    res.status(200).json(result);
  } catch (err: any) {
    res.status(401).json({ error: err.message || 'Invalid credentials' });
  }
});

authRouter.get('/me', requireAuth, (req: AuthenticatedRequest, res: Response): void => {
  res.status(200).json({ user: req.user });
});
