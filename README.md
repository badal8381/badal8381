# Badal Sahani

**Senior Software Engineer / Tech Lead** — I build revenue-grade platforms: ERP and payments at the core, with the AI tooling, realtime systems, and cloud infrastructure around them. Currently leading 8–10 engineers on a multi-tenant education ERP built on **Frappe/ERPNext**, and still hands-on every day — from schema to Terraform to the LLM pipeline that reviews our PRs.

🔗 **[badal-sahani.vercel.app](https://badal-sahani.vercel.app)** · [LinkedIn](https://linkedin.com/in/badalsahani) · badalsahani194@gmail.com

## Journal · FY 2023 – present

| Particulars | Amount |
| :-- | --: |
| Annual fee collections processed — plans, EMI, refunds, GL postings | **₹100+ Cr / yr** |
| Daily collection volume | **₹40–50 L / day** |
| Users served across 4–5 institutions, one multi-tenant core | **20–30k** |
| Payment gateways behind one pluggable, HMAC-verified router | **6** |
| Bank payout rails, incl. ISO 20022 over GPG-encrypted SFTP | **8** |
| Heaviest API latency, before → after (EXPLAIN + Redis) | **4–5s → <500ms** |
| Documented infrastructure cost reduction | **−43%** |

## Four disciplines

- **System design** — multi-tenant architecture where correctness is the feature: idempotent webhooks, single-writer settlement, two-tier caching, graceful degradation as a default.
- **AI engineering** — AI as infrastructure, not garnish: an LLM review pipeline that reads every PR with repo context before a human does; Claude Code and Copilot in the daily loop.
- **DevOps & platform** — ~9k lines of Terraform (EKS, Multi-AZ RDS MariaDB, IRSA, KMS), Helm + ArgoCD GitOps, zero plaintext secrets, and a multi-tenant Docker dev kit for Frappe benches.
- **Payments engineering** — ₹100+ crore a year through code I own: every rupee posted, verified, and reconcilable; settlement files auto-posted as Journal Entries.

## Selected work

| System | What it is |
| :-- | :-- |
| **Fees & Finance Engine** | 40+ DocTypes on ERPNext: payment plans, instalments, deferrals, discounts posting GL entries — re-architected as v2 with zero-downtime migration |
| **Multi-Tenant ERP Core** | 25+ custom Frappe apps, 250+ DocTypes, 500+ REST endpoints — overlay-app architecture, no forks, no monkey-patching |
| **LLM Review Pipeline** | Every pull request read by an LLM, grounded in the changed code's context, before human review |
| **Cloud & GitOps Platform** | Terraform-provisioned EKS, Helm + ArgoCD, DragonflyDB, External Secrets Operator |
| **Realtime Bus Tracking** | Redis pub/sub → Socket.IO → React, with graceful WebSocket-to-polling degradation |

Public repos: [frappe_toolkit](https://github.com/badal8381/frappe_toolkit) (reusable Frappe/ERPNext utilities) · [chatnext](https://github.com/badal8381/chatnext) (AI chat app, Next.js) · [chatpdf](https://github.com/badal8381/chatpdf) (chat with your documents) · [looma](https://github.com/badal8381/looma) (D2C storefront, Next.js 16)

*Client and institution names are kept private. The numbers are real — and happily discussed in an interview.*

## Stack

`Python` `TypeScript` `Frappe/ERPNext` `MariaDB` `Redis` `React` `Socket.IO` `AWS (EKS · RDS · S3)` `Kubernetes` `Terraform` `Helm` `ArgoCD` `Docker` `Nginx` `Claude Code` `LLM APIs`

---

![Badal's GitHub stats](https://github-readme-stats.vercel.app/api?username=badal8381&show_icons=true&hide_border=true&count_private=true)
