# AgentShield AI — Datheon AI Startup & SaaS Launch Lab

<div align="center">

![AgentShield AI Light Hero Banner](assets/hero_banner_light.png)

### Continuous Adversarial Security Testing & Vulnerability Fuzzer for LLM Applications & AI Agents

[![License: MIT](https://img.shields.io/badge/License-MIT-0284C7.svg)](LICENSE)
[![TypeScript: 5.0+](https://img.shields.io/badge/TypeScript-5.0+-2563EB.svg)](https://www.typescriptlang.org/)
[![Node.js: 20+](https://img.shields.io/badge/Node.js-20+-059669.svg)](https://nodejs.org/)
[![Automated Tests: 22/22 Passing](https://img.shields.io/badge/Tests-22%2F22%20Passing-16A34A.svg)](#test-suite--verification-matrix)
[![OWASP: LLM v2.0 Aligned](https://img.shields.io/badge/OWASP-LLM%20v2.0%20Aligned-7C3AED.svg)](#technical-architecture--fuzzing-engine)
[![Stripe: HMAC-SHA256 Idempotent](https://img.shields.io/badge/Stripe-HMAC%20Verified-6366F1.svg)](#monetization--payment-infrastructure)

[🚀 Quickstart](#quickstart) • [🗺️ 4-Phase Lifecycle](#the-4-phase-venture-lifecycle) • [🏗️ Architecture](#technical-architecture--fuzzing-engine) • [💰 Pricing & Economics](#pricing-strategy--unit-economics) • [📢 LinkedIn Launch](LINKEDIN.md) • [🧪 Test Matrix](#test-suite--verification-matrix)

</div>

---

## 📌 Executive Summary

**AgentShield AI** is a production-grade, developer-first adversarial security testing platform designed to protect LLM applications, AI agents, and RAG pipelines from prompt injections, system prompt exfiltration, unauthorized tool abuse, and context poisoning.

Engineered and validated from the ground up through the **Datheon AI Startup & SaaS Launch Lab**, AgentShield AI bridges the gap between prohibitively expensive enterprise firewalls ($30k+/year) and error-prone manual testing. By running during local development and CI/CD pipelines, AgentShield red-teams your system prompts *before* they reach production—eliminating inline proxy latency and single points of failure.

---

## 🗺️ The 4-Phase Venture Lifecycle

This project was built and validated across four cohesive startup engineering phases:

![4-Phase Venture Lifecycle Roadmap](assets/lifecycle_roadmap_light.png)

### [Phase 1: Idea Validation & Customer Discovery](docs/phase1/)
- **Opportunity Matrix**: Evaluated 3 candidate concepts across 8 market criteria; AgentShield scored **4.61 / 5.0**.
- **Customer Interviews**: Conducted 5 in-depth problem discovery interviews using *The Mom Test* framework.
- **NLP Sentiment Analysis**: Documented **68% positive validation sentiment** and **80% willingness-to-pay** signal among AI engineers.
- **Lean Canvas**: Built an evidence-backed 9-block Lean Canvas with risk matrices and unfair advantage mapping.
- 📁 Artifacts: [`docs/phase1/interview_transcripts.md`](docs/phase1/interview_transcripts.md), [`docs/phase1/lean_canvas.md`](docs/phase1/lean_canvas.md), [`docs/phase1/idea_scoring_matrix.md`](docs/phase1/idea_scoring_matrix.md).

### [Phase 2: High-Converting Waitlist & Offer Design](docs/phase2/)
- **Landing Page Design**: Conversion-optimized landing page (`public/index.html`) with dual light/dark theme support, accessible design tokens, and an interactive prompt fuzzer sandbox.
- **Viral Mechanics**: Built unique referral link generation (`?ref=USER_ID`) with live position boosts and priority onboarding badges.
- **Abuse Prevention**: Implemented invisible honeypot trap fields and RFC-5322 regex email validation.
- **Offer Stack**: Structured tiered offerings (Free $0, Pro $39/mo, Lifetime Founder $149) with modeled >94.5% gross margins.
- 📁 Artifacts: [`docs/phase2/landing_page_wireframe.md`](docs/phase2/landing_page_wireframe.md), [`docs/phase2/offer_stack.md`](docs/phase2/offer_stack.md), [`docs/phase2/email_sequence.md`](docs/phase2/email_sequence.md).

### [Phase 3: Functional MVP & Payment Checkout](src/)
- **Full-Stack Core**: Node.js, Express, and TypeScript application with ACID relational SQLite persistence (`better-sqlite3`).
- **OWASP LLM Scanner**: Automated vulnerability testing covering LLM01 (Prompt Injections & DAN), LLM02 (System Leakage), LLM06 (Excessive Agency / SQL injections), and LLM08 (RAG Context Poisoning).
- **Authentication**: PBKDF2 password hashing (100,000 iterations) with timing-safe HMAC session tokens.
- **Stripe Integration**: Server-side checkout session creation and cryptographic HMAC-SHA256 webhook listener with an atomic idempotency ledger.
- 📁 Artifacts: [`src/server/index.ts`](src/server/index.ts), [`src/server/services/scanner.ts`](src/server/services/scanner.ts), [`src/server/services/billing.ts`](src/server/services/billing.ts).

### [Phase 4: Product Hunt Launch & Investor Pitch](docs/phase4/)
- **Product Hunt Campaign**: Full launch kit with tagline, maker first comment, 60-second video script, and screenshot storyboard.
- **10-Slide Investor Deck**: Problem, solution, market size ($2.8B TAM), bottom-up unit economics, traction metrics, and $500K pre-seed ask.
- **Interactive Pitch Presenter**: Dedicated browser slide deck embedded directly in the application (`public/pitch.html`).
- **LinkedIn Showcase**: Complete viral announcement post and light-theme showcase graphic ([`LINKEDIN.md`](LINKEDIN.md)).
- 📁 Artifacts: [`docs/phase4/product_hunt_kit.md`](docs/phase4/product_hunt_kit.md), [`docs/phase4/pitch_deck_10_slides.md`](docs/phase4/pitch_deck_10_slides.md), [`docs/phase4/financial_model.md`](docs/phase4/financial_model.md).

---

## 🏗️ Technical Architecture & Fuzzing Engine

AgentShield AI operates as an automated adversarial sandbox:

![Technical Architecture Diagram](assets/architecture_light.png)

### Vulnerability Heuristic Matrix

| Rule ID | OWASP Category | Vulnerability Type | Description & Mitigation |
| :--- | :--- | :--- | :--- |
| `ASH-LLM01-001` | **LLM01: Prompt Injection** | Direct Instruction Override / DAN | Detects bypasses attempting to override developer system guidelines or adopt unrestricted personas. |
| `ASH-LLM01-002` | **LLM01: Prompt Injection** | Recursive Context Escape | Identifies multi-turn delimiters, XML tag breakout, and role-reversal framing attacks. |
| `ASH-LLM02-001` | **LLM02: Sensitive Info Leak** | System Prompt Exfiltration | Detects prompts attempting to reveal proprietary instructions, API credentials, or internal schemas. |
| `ASH-LLM06-001` | **LLM06: Excessive Agency** | Privilege Escalation & SQLi | Flags unauthorized actions including admin granting, coupon generation, and raw SQL execution. |
| `ASH-LLM08-001` | **LLM08: Vector Context Poisoning** | Delimiter Manipulation | Identifies document-level adversarial overrides designed to poison vector search chunks. |

### Scoring & Actionable Remediation
- **0–100 Security Score**: Calculates risk weight based on detected severity levels (Critical: -30, High: -20, Medium: -10).
- **Exact Line Diff Recommendations**: Returns concrete prompt hardening fixes (e.g., adding XML enclosure tags `<user_input>` and non-overridable boundary assertions).
- **Export Formats**: Provides structured JSON payloads for CI/CD exit codes and print-ready PDF security certificates.

---

## 💰 Pricing Strategy & Unit Economics

AgentShield AI features a sustainable, margin-focused monetization model with zero marginal server burn:

![Pricing Strategy & Unit Economics](assets/pricing_economics_light.png)

### Tiers & Offer Model

| Tier | Price | Scan Quota | Core Features | Target Audience |
| :--- | :--- | :--- | :--- | :--- |
| **Community Free** | **$0 / mo** | 3 scans / mo | Standard OWASP LLM suite, instant audit report, web dashboard | Indie hackers, students |
| **Pro Developer** | **$39 / mo** | Unlimited | Automated CI/CD webhooks, API tokens, PDF certificates, email alerts | SaaS teams, AI startups |
| **Founder Lifetime** | **$149 one-time** | Unlimited (Lifetime) | 1 Named Seat, lifetime updates, private Discord channel, priority roadmap | Early adopters (First 100) |

### Bottom-Up Financial Metrics
- **Average Revenue Per User (ARPU)**: `$39.00 / month`
- **Customer Acquisition Cost (CAC)**: `$28.50` (via organic content, GitHub SEO & Product Hunt)
- **Customer Lifetime Value (LTV)**: `$558.00` (based on 18-month average SaaS retention)
- **LTV / CAC Ratio**: **19.5 : 1** (Industry benchmark > 3.0x)
- **Gross Margin**: **> 86.4%**
- **Monthly Infrastructure Burn**: `< $50.00 / month`
- **Break-Even Threshold**: **14 paying Pro users**

---

## 📢 LinkedIn Launch Kit

A ready-to-publish social launch package is available in the repository root:

[![LinkedIn Launch Banner](assets/linkedin_showcase_light.png)](LINKEDIN.md)

👉 **Full post copy, high-res graphic, and launch instructions**: [`LINKEDIN.md`](LINKEDIN.md)

---

## 🚀 Quickstart

### Prerequisites
- **Node.js**: v20.0.0 or higher
- **npm**: v10.0.0 or higher

### Installation & Local Setup

```bash
# 1. Clone the repository
git clone git@github.com:rajeshwari229080/Datheon_AI_Startup_-_SaaS_Launch_Lab.git
cd Datheon_AI_Startup_-_SaaS_Launch_Lab

# 2. Install dependencies
npm install

# 3. Initialize environment variables
cp .env.example .env

# 4. Run automated test suite
npm test

# 5. Start development server
npm run dev
```

### Application URLs
- 🌐 **Waitlist Landing Page**: [http://localhost:3000](http://localhost:3000)
- 🛡️ **Interactive Scanner MVP**: [http://localhost:3000/app.html](http://localhost:3000/app.html)
- 📊 **10-Slide Investor Deck**: [http://localhost:3000/pitch.html](http://localhost:3000/pitch.html)

---

## 🧪 Test Suite & Verification Matrix

The repository features 22 automated end-to-end tests covering business logic, security heuristics, and transaction processing:

```bash
# Execute test suite directly
node ./node_modules/typescript/bin/tsc
node dist/tests/runAllTests.js
```

### Test Coverage Highlights
- ✅ **Authentication**: PBKDF2 salt generation, password verification, invalid login rejection, session token generation, timing attack resistance.
- ✅ **Vulnerability Fuzzer**: DAN jailbreak detection (`ASH-LLM01-001`), system prompt exfiltration (`ASH-LLM02-001`), unauthorized privilege escalation (`ASH-LLM06-001`), RAG context poisoning (`ASH-LLM08-001`), clean prompt passing with 100/100 score.
- ✅ **Stripe Checkout & Webhooks**: Valid checkout session creation, negative amount rejection, HMAC-SHA256 cryptographic verification, signature forgery rejection, atomic idempotency replay protection.
- ✅ **Waitlist Engine**: RFC-5322 email validation, honeypot spam bot trapping, duplicate submission handling, referral position incrementation.
- ✅ **Security Hardening**: Rapid-fire rate limiter enforcement (HTTP 429).

---

## 📁 Repository Structure

```
├── assets/                          # Light-theme vector diagrams & 2x PNG assets
│   ├── hero_banner_light.png        # 2400x1040 Hero banner
│   ├── hero_banner_light.svg        # Scalable hero vector
│   ├── architecture_light.png       # 2400x1120 Technical architecture diagram
│   ├── architecture_light.svg       # Scalable architecture vector
│   ├── lifecycle_roadmap_light.png  # 2400x1000 4-Phase roadmap diagram
│   ├── lifecycle_roadmap_light.svg  # Scalable roadmap vector
│   ├── pricing_economics_light.png  # 2400x1080 Pricing & economics diagram
│   ├── pricing_economics_light.svg  # Scalable pricing vector
│   ├── linkedin_showcase_light.png  # 2400x1260 LinkedIn showcase card (1.91:1)
│   └── linkedin_showcase_light.svg  # Scalable LinkedIn showcase vector
├── docs/                            # Comprehensive venture validation artifacts
│   ├── phase1/                      # Discovery interviews, Lean Canvas, Scoring matrix
│   ├── phase2/                      # Landing page wireframe, Offer stack, Email nurture
│   ├── phase3/                      # MVP Architecture spec & Database schema
│   └── phase4/                      # Product Hunt launch kit, Investor deck, Financial model
├── public/                          # Frontend client applications
│   ├── index.html                   # Conversion-focused waitlist landing page
│   ├── app.html                     # Live adversarial vulnerability fuzzer dashboard
│   ├── pitch.html                   # 10-slide interactive investor deck presenter
│   └── css/tokens.css               # Design system tokens (light/dark responsive)
├── src/                             # Backend application source code
│   ├── server/                      # Express HTTP server & API endpoints
│   │   ├── services/                # Scanner engine, Auth service, Stripe billing
│   │   ├── db/                      # SQLite schema & database migrations
│   │   └── middleware/              # Rate limiter & security headers
│   └── tests/                       # Automated test suites (22/22 passing)
├── LINKEDIN.md                      # Ready-to-publish LinkedIn post & visual assets
├── LICENSE                          # MIT License (2026 Datheon & Rajeshwari)
├── package.json                     # Project manifest & build scripts
└── tsconfig.json                    # TypeScript compiler configuration
```

---

## 📄 License & Attribution

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for complete details.

Engineered with passion by **Rajeshwari** as part of the **Datheon AI Startup & SaaS Launch Lab**.
