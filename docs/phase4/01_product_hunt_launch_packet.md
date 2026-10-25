# Phase 4 — Step 1: Product Hunt Launch Campaign Packet

## 1. Core Listing Metadata

- **Product Name**: AgentShield AI
- **Tagline**: Automated adversarial security audits for AI agents & LLMs
- **One-Line Pitch**: Continuous OWASP LLM security audits and pre-deployment fuzzing in under 60 seconds with zero runtime latency.
- **Category Tags**: `Developer Tools`, `Artificial Intelligence`, `Cybersecurity`, `SaaS`
- **Pricing Status**: Free Plan Available ($0/mo for 3 scans/mo), $39/mo Pro, $149 Lifetime Early-Bird.

---

## 2. Product Descriptions

### Short Description (Max 260 characters):
> AgentShield AI automatically red-teams LLM system prompts, RAG context, and tool definitions against the OWASP LLM Top 10. Catch prompt injections, system prompt leaks, and unsafe tool calling before shipping to production. 100% non-custodial.

### Long Description:
> **Every AI startup is one clever prompt injection away from a viral PR disaster or an empty bank account.**
>
> When you deploy generative AI features or autonomous agents, traditional Web Application Firewalls (WAFs) are completely blind to semantic vulnerabilities. Competitors can extract your proprietary system prompts with basic jailbreaks, and indirect prompt injections can hijack your agent tools to execute unauthorized database queries or discount codes.
>
> **AgentShield AI** solves this at the root: during development and CI/CD.
>
> 🚀 **What AgentShield AI Does:**
> 1. **Automated Adversarial Fuzzing**: Audits your prompts, endpoints, and tool schemas against direct injections, DAN jailbreaks, sensitive data leaks, and unsafe SQL/shell commands.
> 2. **OWASP LLM Top 10 Aligned**: Quantitative CVSS v3.1 severity scoring (Clean, Low, Medium, High, Critical) tailored to generative models.
> 3. **Copy-Paste Remediations**: Delivers exact defensive prompt wrappers and input validation regexes instead of generic warnings.
> 4. **Zero Runtime Latency**: Audits happen during build time and CI/CD—no inline proxy slowing down your live user requests.
> 5. **100% Non-Custodial**: Your production customer databases and conversation histories never touch our servers.

---

## 3. Maker Comment (First Comment on Product Hunt)

> *“Hey Product Hunt community! 👋 I’m Rajeshwari, founder of AgentShield AI.*
>
> *Over the past year, nearly every developer I know has built an AI feature or deployed an agent using OpenAI, Claude, or open-source models. But when I asked how they tested their prompts against jailbreaks or prompt extraction, the universal answer was: ‘I manually typed a few bypasses in ChatGPT and hoped for the best.’*
>
> *Enterprise solutions like Lakera or Snyk start at $20k+/year and require endless enterprise procurement meetings. Solo founders, bootstrappers, and seed-stage AI startups had literally zero automated, self-serve security tools.*
>
> *We built **AgentShield AI** to fix that. In under 60 seconds, you can paste any system prompt or agent schema, run an automated adversarial fuzzing suite aligned with the OWASP LLM Top 10, and get immediate, copy-paste defensive guardrails.*
>
> *We’re offering a permanent **Free Tier (3 audits/month)** for all builders, plus a strictly limited **Lifetime Founder deal ($149)** for the first 100 hunters.*
>
> *I’d love your feedback, brutal critiques, and feature requests. What’s the weirdest prompt injection your app has encountered? Let’s chat in the comments! 🛡️”*

---

## 4. Product Gallery Storyboard & Visual Captions

| Slide # | Visual Asset Description | Overlay Caption |
| :---: | :--- | :--- |
| **Slide 1 (Hero)** | Clean UI mockup showing dashboard scanning a DAN jailbreak with electric blue and red severity badges. | *Stop Prompt Injections & Agent Leaks Before You Ship to Production.* |
| **Slide 2** | Real-time scan log terminal output displaying matched signatures and CVSS 9.3 severity rating. | *OWASP LLM Top 10 Vulnerability Fuzzing in Under 60 Seconds.* |
| **Slide 3** | Split screen showing vulnerable prompt vs. copy-paste defensive guardrail wrapper snippet. | *Actionable Code Remediations, Not Just Abstract Scores.* |
| **Slide 4** | GitHub Actions terminal running automated `agentshield-audit` on Pull Request with pass/fail gate. | *Continuous CI/CD Regression Testing for System Prompts.* |
| **Slide 5** | Pricing table highlighting Community Free ($0/mo), Pro ($39/mo), and Founder Lifetime ($149). | *Transparent, Developer-Friendly Pricing with Zero Enterprise Gates.* |

---

## 5. 60-Second Video Demo Script

- **[0:00–0:10] Hook**: *“You spent months building your AI agent. But in 30 seconds, a user inputs a DAN jailbreak and tricks it into generating free coupon codes or leaking your entire system prompt.”*
- **[0:10–0:25] The Problem**: *“Why? Because traditional firewalls don't understand LLM semantics, and enterprise AI security costs $40k a year.”*
- **[0:25–0:45] The Solution (Live Screen Share)**: *“Here is AgentShield AI. Paste your system prompt, select your target type, and click 'Run Adversarial Audit'. In 12 milliseconds, our fuzzer checks 12 OWASP attack vectors, pinpoints the vulnerability, and gives you the exact copy-paste defensive guardrail to patch it.”*
- **[0:45–1:00] Call-to-Action**: *“Try the free interactive fuzzer today at agentshield.ai. Build with confidence.”*
