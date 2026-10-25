// Waitlist API Routes (/api/waitlist)
import { Router, Request, Response } from 'express';
import * as crypto from 'crypto';
import { Database, WaitlistRow } from '../db/database';
import { validateWaitlistSubmission } from '../utils/waitlistValidation';

export const waitlistRouter = Router();

waitlistRouter.post('/', (req: Request, res: Response): void => {
  try {
    const { email, role, tier, _hp_shield } = req.body;
    const validation = validateWaitlistSubmission({
      email,
      role,
      tier,
      honeypot: _hp_shield
    });

    if (!validation.valid || !validation.sanitizedEmail) {
      res.status(400).json({ error: validation.error || 'Invalid submission' });
      return;
    }

    const entryId = `wtl_${crypto.randomBytes(8).toString('hex')}`;
    const ipAddress = (req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || '127.0.0.1').slice(0, 45);

    const newEntry: WaitlistRow = {
      id: entryId,
      email: validation.sanitizedEmail,
      role: role ? String(role).slice(0, 50) : 'Builder',
      tier: tier ? String(tier).slice(0, 50) : 'Free',
      ip_address: ipAddress,
      created_at: new Date().toISOString()
    };

    Database.addWaitlist(newEntry);
    res.status(201).json({ message: 'Successfully joined waitlist', id: entryId });
  } catch (err: any) {
    if (err.message && err.message.includes('already registered')) {
      res.status(409).json({ error: 'This email is already registered on the waitlist!' });
      return;
    }
    res.status(500).json({ error: 'Server error processing waitlist request.' });
  }
});

waitlistRouter.get('/count', (_req: Request, res: Response): void => {
  res.status(200).json({ count: Database.getWaitlistCount() });
});
