// AgentShield AI — Security Audit Certificate & Report Generator
import { ScanResult } from './scanner';

export class ReportGenerator {
  static generateMarkdownAuditReport(scan: ScanResult, appName = 'AI Agent System'): string {
    const timestamp = new Date(scan.scannedAt).toUTCString();
    const findingsList = scan.findings.length > 0
      ? scan.findings.map((f, i) => `
### Finding ${i + 1}: ${f.title} (${f.owaspCategory})
- **Severity**: \`${f.severity}\` (CVSS: **${f.cvssScore.toFixed(1)}**)
- **Description**: ${f.description}
- **Detected Attack Signature**: \`${f.matchedPattern}\`

#### Recommended Patch:
\`\`\`typescript
${f.remediationSnippet}
\`\`\`
`).join('\n')
      : '\n> **Result**: No prompt injection, sensitive data leakage, or unsafe tool-calling vectors detected across standard OWASP heuristics.\n';

    return `# AgentShield AI Security Audit Certificate
**Target System**: ${appName}  
**Audit ID**: \`${scan.scanId}\`  
**Date of Audit**: ${timestamp}  
**Execution Latency**: ${scan.executionTimeMs} ms  
**Compliance Standard**: OWASP Top 10 for Large Language Model Applications (v2.0)  

---

## Executive Summary

| Security Metric | Value |
| :--- | :--- |
| **Overall Security Status** | **${scan.status}** |
| **Composite CVSS v3.1 Score** | **${scan.overallCvssScore.toFixed(1)} / 10.0** |
| **Highest Risk Severity** | **${scan.highestSeverity}** |
| **Total Vulnerabilities Detected** | **${scan.totalVulnerabilities}** |

---

## Technical Findings Detail
${findingsList}

---

## Verification & Remediation Guidance
- **Defensive System Prompt Guardrail**:
\`\`\`
${scan.remediations.systemPromptGuardrail}
\`\`\`

---
*Generated autonomously by AgentShield AI Engine v1.0. Zero user data retained.*
`;
  }
}
