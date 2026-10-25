// AgentShield AI — Application Server
import express, { Request, Response, NextFunction } from 'express';
import * as path from 'path';
import { config } from './config';
import { Database } from './db/database';
import { authRouter } from './routes/authRoutes';
import { waitlistRouter } from './routes/waitlistRoutes';
import { scanRouter } from './routes/scanRoutes';
import { billingRouter } from './routes/billingRoutes';
import { analyticsRouter } from './routes/analyticsRoutes';

export function createApp(): express.Application {
  const app = express();

  // Initialize Database
  Database.initialize(config.databasePath);

  // Middleware
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true }));

  // API Routes
  app.use('/api/auth', authRouter);
  app.use('/api/waitlist', waitlistRouter);
  app.use('/api/scans', scanRouter);
  app.use('/api/billing', billingRouter);
  app.use('/api/analytics', analyticsRouter);

  // Serve static client assets
  const clientDir = path.join(process.cwd(), 'src', 'client');
  app.use(express.static(clientDir));

  // Health check
  app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'ok', service: 'AgentShield AI', timestamp: new Date().toISOString() });
  });

  // Client routing fallback
  app.get('/app', (_req: Request, res: Response) => {
    res.sendFile(path.join(clientDir, 'app.html'));
  });

  app.get('/pitch', (_req: Request, res: Response) => {
    res.sendFile(path.join(clientDir, 'pitch.html'));
  });

  app.get('*', (_req: Request, res: Response) => {
    res.sendFile(path.join(clientDir, 'index.html'));
  });

  // Global Error Handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error('[AgentShield Server Error]:', err);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
  });

  return app;
}

if (require.main === module) {
  const app = createApp();
  app.listen(config.port, () => {
    console.log(`🛡️ AgentShield AI Server running at http://localhost:${config.port}`);
    console.log(`🚀 Landing Page: http://localhost:${config.port}/`);
    console.log(`📊 MVP Console: http://localhost:${config.port}/app.html`);
    console.log(`📈 Investor Pitch: http://localhost:${config.port}/pitch.html`);
  });
}
