// AgentShield AI — MVP Console Dashboard Controller
document.addEventListener('DOMContentLoaded', () => {
  const tokenKey = 'agentshield_user_token';
  let currentToken = localStorage.getItem(tokenKey);
  let currentUser = null;

  // UI Elements
  const authContainer = document.getElementById('auth-modal');
  const dashboardContainer = document.getElementById('dashboard-main');
  const userEmailDisplay = document.getElementById('user-email-display');
  const userTierBadge = document.getElementById('user-tier-badge');
  const scansQuotaDisplay = document.getElementById('scans-quota-display');
  const scanHistoryTableBody = document.getElementById('scan-history-tbody');

  const scanForm = document.getElementById('new-scan-form');
  const scanSubmitBtn = document.getElementById('scan-submit-btn');
  const scanReportCard = document.getElementById('scan-report-card');

  // Auth Form Handlers
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const showRegisterLink = document.getElementById('show-register-link');
  const showLoginLink = document.getElementById('show-login-link');
  const logoutBtn = document.getElementById('logout-btn');

  if (showRegisterLink && showLoginLink) {
    showRegisterLink.addEventListener('click', (e) => {
      e.preventDefault();
      loginForm.style.display = 'none';
      registerForm.style.display = 'block';
    });
    showLoginLink.addEventListener('click', (e) => {
      e.preventDefault();
      registerForm.style.display = 'none';
      loginForm.style.display = 'block';
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem(tokenKey);
      currentToken = null;
      currentUser = null;
      showAuthModal();
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value;
      const pass = document.getElementById('login-password').value;
      const errorDiv = document.getElementById('login-error');
      errorDiv.style.display = 'none';

      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password: pass })
        });
        const data = await res.json();
        if (res.ok) {
          localStorage.setItem(tokenKey, data.token);
          currentToken = data.token;
          currentUser = data.user;
          initDashboard();
        } else {
          errorDiv.textContent = data.error || 'Login failed';
          errorDiv.style.display = 'block';
        }
      } catch (err) {
        errorDiv.textContent = 'Server connection error.';
        errorDiv.style.display = 'block';
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('reg-email').value;
      const pass = document.getElementById('reg-password').value;
      const role = document.getElementById('reg-role').value;
      const errorDiv = document.getElementById('reg-error');
      errorDiv.style.display = 'none';

      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password: pass, role })
        });
        const data = await res.json();
        if (res.ok) {
          localStorage.setItem(tokenKey, data.token);
          currentToken = data.token;
          currentUser = data.user;
          initDashboard();
        } else {
          errorDiv.textContent = data.error || 'Registration failed';
          errorDiv.style.display = 'block';
        }
      } catch (err) {
        errorDiv.textContent = 'Server connection error.';
        errorDiv.style.display = 'block';
      }
    });
  }

  // Check Existing Session
  async function checkSession() {
    if (!currentToken) {
      showAuthModal();
      return;
    }

    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${currentToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        currentUser = data.user;
        initDashboard();
      } else {
        localStorage.removeItem(tokenKey);
        showAuthModal();
      }
    } catch (e) {
      showAuthModal();
    }
  }

  function showAuthModal() {
    if (authContainer) authContainer.style.display = 'flex';
    if (dashboardContainer) dashboardContainer.style.display = 'none';
  }

  function initDashboard() {
    if (authContainer) authContainer.style.display = 'none';
    if (dashboardContainer) dashboardContainer.style.display = 'block';

    if (userEmailDisplay) userEmailDisplay.textContent = currentUser.email;
    if (userTierBadge) {
      userTierBadge.textContent = currentUser.tier;
      userTierBadge.className = currentUser.tier === 'PRO' || currentUser.tier === 'LIFETIME' 
        ? 'badge badge-cyan' 
        : 'badge badge-green';
    }

    updateQuotaDisplay();
    loadPastScans();
  }

  function updateQuotaDisplay() {
    if (scansQuotaDisplay && currentUser) {
      if (currentUser.tier === 'PRO' || currentUser.tier === 'LIFETIME') {
        scansQuotaDisplay.textContent = 'Unlimited Audits Unlocked (Active)';
      } else {
        scansQuotaDisplay.textContent = `${currentUser.scans_used || 0} / 3 scans used this month`;
      }
    }
  }

  // Load Scan History
  async function loadPastScans() {
    if (!currentToken || !scanHistoryTableBody) return;
    try {
      const res = await fetch('/api/scans', {
        headers: { Authorization: `Bearer ${currentToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        renderHistoryTable(data.scans || []);
      }
    } catch (e) {}
  }

  function renderHistoryTable(scans) {
    if (!scanHistoryTableBody) return;
    if (scans.length === 0) {
      scanHistoryTableBody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: 20px;">No security scans executed yet. Run your first audit above!</td></tr>`;
      return;
    }

    scanHistoryTableBody.innerHTML = scans.map(s => {
      const badgeClass = s.severity === 'CRITICAL' || s.severity === 'HIGH' 
        ? 'badge-red' 
        : s.severity === 'MEDIUM' 
          ? 'badge-yellow' 
          : 'badge-green';

      return `
        <tr>
          <td><strong>${escapeHtml(s.prompt_title)}</strong></td>
          <td><code>${escapeHtml(s.target_type)}</code></td>
          <td><span class="badge ${badgeClass}">${s.severity}</span></td>
          <td><strong>${s.cvss_score.toFixed(1)}</strong></td>
          <td>${new Date(s.created_at).toLocaleDateString()}</td>
        </tr>
      `;
    }).join('');
  }

  // Submit New Scan
  if (scanForm) {
    scanForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const title = document.getElementById('scan-title').value.trim();
      const targetType = document.getElementById('scan-target-type').value;
      const content = document.getElementById('scan-content').value.trim();

      if (!content) {
        alert('Please provide prompt content to scan.');
        return;
      }

      scanSubmitBtn.disabled = true;
      scanSubmitBtn.innerHTML = '⚡ Scanning against OWASP LLM Heuristics...';

      try {
        const res = await fetch('/api/scans', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${currentToken}`
          },
          body: JSON.stringify({ promptTitle: title, targetType, promptContent: content })
        });
        const data = await res.json();

        if (res.ok) {
          currentUser.scans_used = data.scansUsed;
          updateQuotaDisplay();
          renderScanReport(data.scan);
          loadPastScans();
        } else {
          alert(data.error || 'Scan failed.');
        }
      } catch (err) {
        alert('Error connecting to scan service.');
      } finally {
        scanSubmitBtn.disabled = false;
        scanSubmitBtn.innerHTML = '⚡ Execute Adversarial Security Audit';
      }
    });
  }

  function renderScanReport(scan) {
    if (!scanReportCard) return;

    const findings = scan.findings || [];
    const isClean = findings.length === 0;

    let findingsHtml = '';
    if (isClean) {
      findingsHtml = `
        <div class="result-box safe">
          <h4>✅ Clean Bill of Health</h4>
          <p>Zero prompt injection, exfiltration, or unauthorized tool-calling vectors detected.</p>
        </div>
      `;
    } else {
      findingsHtml = findings.map(f => `
        <div class="result-box ${f.severity === 'CRITICAL' || f.severity === 'HIGH' ? 'danger' : 'warning'}">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <span class="badge ${f.severity === 'CRITICAL' || f.severity === 'HIGH' ? 'badge-red' : 'badge-cyan'}">${f.owaspCategory}</span>
            <span class="cvss-score">CVSS: ${f.cvssScore.toFixed(1)}</span>
          </div>
          <h4>${escapeHtml(f.title)}</h4>
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 6px 0;">${escapeHtml(f.description)}</p>
          <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 8px;">
            <strong>Detected Signature:</strong> <code>${escapeHtml(f.matchedPattern)}</code>
          </div>
          <div class="code-remediation">
            <div class="remediation-header">Recommended Patch:</div>
            <pre><code>${escapeHtml(f.remediationSnippet)}</code></pre>
          </div>
        </div>
      `).join('');
    }

    scanReportCard.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 8px;">
        <div>
          <h3>Audit Report: ${escapeHtml(scan.targetType)}</h3>
          <p style="color: var(--text-muted); font-size: 0.85rem;">Scan ID: <code>${scan.scanId}</code> • Executed in ${scan.executionTimeMs}ms</p>
        </div>
        <div style="display: flex; gap: 8px; align-items: center;">
          <span class="badge ${scan.highestSeverity === 'CRITICAL' || scan.highestSeverity === 'HIGH' ? 'badge-red' : 'badge-green'}" style="font-size: 0.9rem; padding: 6px 14px;">
            ${scan.highestSeverity} (CVSS ${scan.overallCvssScore.toFixed(1)})
          </span>
          <button id="download-report-btn" class="btn btn-secondary" style="padding: 6px 12px; font-size: 0.8rem;">📥 Export JSON</button>
        </div>
      </div>
      <div>${findingsHtml}</div>
    `;

    scanReportCard.style.display = 'block';
    scanReportCard.scrollIntoView({ behavior: 'smooth' });

    // Download export handler
    const dlBtn = document.getElementById('download-report-btn');
    if (dlBtn) {
      dlBtn.addEventListener('click', () => {
        const blob = new Blob([JSON.stringify(scan, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `agentshield_audit_${scan.scanId}.json`;
        a.click();
        URL.revokeObjectURL(url);
      });
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, (m) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[m]));
  }

  checkSession();
});
