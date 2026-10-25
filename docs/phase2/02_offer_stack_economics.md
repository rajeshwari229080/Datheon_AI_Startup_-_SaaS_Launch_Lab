# Phase 2 — Step 2: Offer Stack Design & Unit Economics Sustainability

## 1. Differentiated Tier Architecture

To maximize top-of-funnel adoption while capturing consumer surplus from serious teams, three distinct tiers are defined:

```
+-----------------------------------+-----------------------------------+-----------------------------------+
|               FREE                |                PRO                |         LIFETIME FOUNDER          |
|              $0 / mo              |             $39 / mo              |         $149 / one-time           |
+-----------------------------------+-----------------------------------+-----------------------------------+
| Target: Hackers & Early Tinkering | Target: Live Startups & Teams     | Target: Early Backers & Micro-SaaS|
|                                   |                                   |                                   |
| • 3 Automated Audits / month      | • Unlimited Automated Audits      | • All Pro Tier Features           |
| • Standard OWASP LLM Top 10 Suite | • Full OWASP LLM Suite + Custom   | • 1 Developer Seat Included       |
| • Web Dashboard Access            | • CI/CD Webhooks & GitHub Action  | • Lifetime Feature Updates        |
| • Community Discord Support       | • Exportable Audit Certificates   | • Priority Discord & Roadmap Vote |
| • Non-custodial local scans       | • Priority Email Support (<12h)   | • Strictly Capped to First 100    |
+-----------------------------------+-----------------------------------+-----------------------------------+
```

---

## 2. Operational & Financial Sustainability Assessment

A common failure mode of SaaS Lifetime Deals (LTDs) is infinite marginal compute liability leading to bankruptcy. AgentShield AI's architecture explicitly prevents this:

### Unit Cost Breakdown per Scan:
- Heuristic Rule Fuzzing Execution: Local/server-side regex and AST-based deterministic matching costs **~$0.0005 per scan**.
- LLM Verification Probe (Optional LLM-as-a-judge for complex semantic jailbreaks): Uses low-cost models (e.g. GPT-4o-mini / Claude 3.5 Haiku at $0.15 / 1M input tokens) costing **~$0.0018 per scan**.
- Database Persistence (SQLite/PostgreSQL): Negligible storage overhead (<2KB per scan audit).
- **Total Blended Cost per Scan**: **~$0.0023**.

### Lifetime Deal (LTD) Sustainability Model:
- **Price**: $149 one-time.
- **Stripe Processing Fee (2.9% + $0.30)**: $4.62.
- **Net Cash Received**: $144.38.
- **Fair-Usage Boundary**: 300 scans / month fair-use soft limit per seat (sufficient for 10 daily CI/CD builds).
- **Monthly Compute Cost at Max Fair Use**: 300 scans × $0.0023 = **$0.69 / month**.
- **Runway from Single $149 Purchase**: $144.38 ÷ $0.69/mo = **209 months (>17 years of continuous usage)**.
- **Gross Margin**: **> 94.5%**.

### Pro Monthly Subscription Sustainability:
- **Price**: $39 / month.
- **Net after Stripe**: $37.57 / month.
- **Average Usage per Pro Team**: ~450 scans / month = $1.04 / month compute cost.
- **Gross Margin**: **> 97.2%**.

---

## 3. Explicit Guardrails & Boundaries

1. **Anti-Abuse Cap**: Lifetime tier includes 1 named developer seat and 300 scans/month soft cap with fair-use auto-throttling against bot abuse.
2. **Refund Policy**: 14-day no-questions-asked refund policy for both Pro and Lifetime tiers.
3. **Price Evolution Strategy**: Upon reaching 100 Lifetime customers, the Lifetime tier will be retired permanently, and the Pro tier will adjust to $49/mo based on accumulated empirical usage data.
