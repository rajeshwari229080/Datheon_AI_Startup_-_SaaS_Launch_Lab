// Scan API Routes (/api/scans)
import { Router, Response } from 'express';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';
import { ScannerEngine } from '../services/scanner';
import { Database, ScanRow } from '../db/database';
import { ReportGenerator } from '../services/reportGenerator';

export const scanRouter = Router();

// Apply auth to all scan endpoints (Supports Bearer token or x-api-key)
scanRouter.use(requireAuth);

scanRouter.post('/', (req: AuthenticatedRequest, res: Response): void => {
  try {
    const user = req.user!;
    const { promptTitle, promptContent, targetType } = req.body;

    if (!promptContent || typeof promptContent !== 'string') {
      res.status(400).json({ error: 'promptContent string is required.' });
      return;
    }

    // Quota Enforcement
    if (user.tier === 'FREE' && user.scans_used >= 3) {
      res.status(403).json({
        error: 'Monthly free quota reached (3/3 scans used). Upgrade to Pro for unlimited adversarial audits.',
        upgradeRequired: true
      });
      return;
    }

    // Execute Adversarial Fuzzer
    const result = ScannerEngine.scan(promptContent, targetType || 'system_prompt');

    // Persist scan record
    const scanRow: ScanRow = {
      id: result.scanId,
      user_id: user.id,
      prompt_title: promptTitle ? String(promptTitle).slice(0, 100) : 'Prompt Security Audit',
      prompt_content: promptContent.slice(0, 5000), // bounded storage
      target_type: result.targetType,
      status: result.status,
      cvss_score: result.overallCvssScore,
      severity: result.highestSeverity,
      vulnerabilities_json: JSON.stringify(result.findings),
      remediations_json: JSON.stringify(result.remediations),
      execution_time_ms: result.executionTimeMs,
      created_at: result.scannedAt
    };

    Database.createScan(scanRow);
    const updatedCount = Database.incrementUserScans(user.id);

    res.status(201).json({
      scan: result,
      scansUsed: updatedCount
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Internal scanning engine error: ' + err.message });
  }
});

scanRouter.get('/', (req: AuthenticatedRequest, res: Response): void => {
  try {
    const user = req.user!;
    const scans = Database.findScansByUserId(user.id);
    res.status(200).json({ scans });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve scan history.' });
  }
});

scanRouter.get('/:id', (req: AuthenticatedRequest, res: Response): void => {
  try {
    const user = req.user!;
    const scan = Database.findScanById(req.params.id);
    if (!scan || scan.user_id !== user.id) {
      res.status(404).json({ error: 'Scan record not found.' });
      return;
    }
    res.status(200).json({ scan });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve scan.' });
  }
});

scanRouter.get('/:id/report.md', (req: AuthenticatedRequest, res: Response): void => {
  try {
    const user = req.user!;
    const scan = Database.findScanById(req.params.id);
    if (!scan || scan.user_id !== user.id) {
      res.status(404).send('Scan record not found.');
      return;
    }

    const reconstructedResult = {
      scanId: scan.id,
      targetType: scan.target_type,
      status: scan.status as any,
      totalVulnerabilities: JSON.parse(scan.vulnerabilities_json).length,
      highestSeverity: scan.severity,
      overallCvssScore: scan.cvss_score,
      findings: JSON.parse(scan.vulnerabilities_json),
      remediations: JSON.parse(scan.remediations_json),
      executionTimeMs: scan.execution_time_ms,
      scannedAt: scan.created_at
    };

    const markdown = ReportGenerator.generateMarkdownAuditReport(reconstructedResult, scan.prompt_title);
    res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
    res.status(200).send(markdown);
  } catch (err: any) {
    res.status(500).send('Error generating markdown report.');
  }
});
