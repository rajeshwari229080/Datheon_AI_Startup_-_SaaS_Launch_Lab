# Phase 2 — Step 4: A/B Testing Experiment Design & Telemetry Specification

## 1. Core Conversion Funnel & KPI Definitions

To rigorously measure customer interest without fabricated vanity metrics, the following baseline conversion funnel is instrumented:

```
[ Unique Landing Page Visitors ]
               │
               ▼  (Target: > 45% Click-Through)
[ Interactive Demo Execution / CTA Click ]
               │
               ▼  (Target: > 60% Form Completion)
[ Waitlist Form Start ]
               │
               ▼  (Target: > 5.0% Overall Conversion)
[ Successful Waitlist Submission ]
               │
               ▼  (Target: > 25% Paid Tier Preference)
[ Qualified Paid Tier Preference (Pro or LTD) ]
```

### Metrics Ledger:
1. **Visitor-to-Waitlist Conversion Rate**: `(Unique Waitlist Signups ÷ Unique Page Visitors) × 100`. Benchmark: 5.0%–8.0%.
2. **Demo Engagement Rate**: `(Demo Fuzzer Runs ÷ Page Visitors) × 100`. Benchmark: > 25.0%.
3. **Paid Intent Ratio**: `(Pro + Lifetime Selections) ÷ Total Signups`. Benchmark: > 20.0%.
4. **Form Completion Rate**: `(Signups ÷ Form Starts) × 100`. Benchmark: > 70.0%.

---

## 2. A/B Experiment Design: Headline & Value Proposition Test

To optimize visitor conversion, two controlled variants are defined:

### Variant A (Control: Fear-of-Loss / Security Risk)
- **Headline**: *“Stop Prompt Injections and Agent Leaks Before You Ship to Production.”*
- **Subheadline**: *“AgentShield AI continuously red-teams your LLM system prompts, RAG contexts, and tool definitions against the OWASP LLM Top 10 in under 60 seconds.”*
- **Primary CTA**: *“Get Early Access (Free 3 Scans/Mo)”*
- **Hypothesis**: Technical founders fear public embarrassment and catastrophic tool-calling bugs; loss-aversion messaging will yield higher urgency.

### Variant B (Challenger: Speed / Developer Productivity)
- **Headline**: *“The 60-Second Automated Security & Compliance Auditor for AI Engineers.”*
- **Subheadline**: *“Ship AI features with complete confidence. Instant adversarial vulnerability fuzzing, copy-paste guardrails, and zero runtime latency.”*
- **Primary CTA**: *“Audit Your Prompt in 60s”*
- **Hypothesis**: Developers are motivated by velocity and fast feedback loops; speed-oriented messaging will lower friction.

---

## 3. Sample Size & Statistical Rigor Calculations

Using standard two-tailed hypothesis testing:
- **Baseline Conversion Rate ($p_1$)**: 5.0% (0.05)
- **Minimum Detectable Effect (MDE)**: 30% relative lift (from 5.0% to 6.5%)
- **Statistical Significance Level ($\alpha$)**: 0.05 (95% Confidence Interval)
- **Statistical Power ($1 - \beta$)**: 0.80 (80% Power)

### Required Sample Size:
Using the standard sample size formula for two independent proportions:
$$n = \frac{(Z_{\alpha/2}\sqrt{2\bar{p}(1-\bar{p})} + Z_{\beta}\sqrt{p_1(1-p_1) + p_2(1-p_2)})^2}{(p_2 - p_1)^2}$$
- **Minimum Sample per Variant**: **1,420 unique visitors per variant** (2,840 total visitors).
- **Early-Stage Stopping Guardrail**: If after 300 visitors per variant the p-value remains > 0.40 and difference < 0.2%, retain Control to prevent premature optimization.

---

## 4. Experiment Execution Protocol & Tracking Schema

Client-side variant assignment will occur via deterministic hashing on visitor UUID stored in `localStorage` (`variant_a` vs `variant_b`).

```json
{
  "event": "experiment_impression",
  "experiment_id": "exp_headline_value_prop_v1",
  "variant": "variant_a",
  "timestamp": "2026-10-25T15:18:00Z"
}
```

No conclusion will be claimed until statistical significance criteria are met with real traffic.
