// AgentShield AI Authentication Middleware
import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';
import { UserRow } from '../db/database';

export interface AuthenticatedRequest extends Request {
  user?: Omit<UserRow, 'password_hash'>;
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  const apiKeyHeader = req.headers['x-api-key'] as string;

  // 1. Check API Key header for CI/CD pipelines
  if (apiKeyHeader) {
    const apiUser = AuthService.validateApiKey(apiKeyHeader);
    if (apiUser) {
      req.user = apiUser;
      return next();
    }
  }

  // 2. Check Bearer Session Token
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const sessionUser = AuthService.validateSession(token);
    if (sessionUser) {
      req.user = sessionUser;
      return next();
    }
  }

  // 3. Check Cookie (if provided)
  const cookieHeader = req.headers.cookie;
  if (cookieHeader) {
    const match = cookieHeader.match(/agentshield_token=([^;]+)/);
    if (match && match[1]) {
      const cookieUser = AuthService.validateSession(match[1]);
      if (cookieUser) {
        req.user = cookieUser;
        return next();
      }
    }
  }

  res.status(401).json({ error: 'Unauthorized: Valid authentication token or API key required.' });
}
