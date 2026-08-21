# KampungDigital — Execution Tracker

Updated: 2026-08-21

## Stage 0 — Discovery
- [x] Domain/IP confirmed.
- [x] Upstream repository cloned for audit.
- [x] MIT license and brand restrictions reviewed.
- [x] Stack and module inventory completed.
- [x] Initial security risks identified.

## Stage 1 — Foundation
- [x] Canonical blueprint created.
- [x] Source copied into clean project workspace (without `.git`).
- [x] Rebrand completed without upstream brand assets.
- [x] Base path `/kampungdigital` implemented.
- [x] Production env and deploy docs completed.

## Stage 2 — Security
- [x] Remove dummy/hard-coded credentials.
- [x] Disable password disclosure flow.
- [x] Bcrypt for new passwords.
- [x] Safe legacy hash upgrade path.
- [x] CORS/rate limit/helmet/body limit implemented.
- [x] Secret scan (no real secrets; insecure seed credentials removed).

## Stage 3 — Quality
- [x] Frontend lint: 0 errors (95 transitional warnings documented).
- [x] Frontend production build: Next 15.5.23, 22 static pages, type check enabled.
- [x] Backend install/check + password helper test.
- [x] TypeScript build checks enabled and passed.
- [x] Mobile/desktop screenshot inspection on the live HTTPS deployment (1440×1100 and 390×844); no overflow, broken assets, or visible rendering errors found.
- [x] Critical route and asset crawl on local standalone preview (15 routes + 16 discovered assets returned HTTP 200).
- [x] Live HTTPS crawl: 16 frontend/API routes + 16 discovered assets returned HTTP 200.
- [x] Live auth smoke: bcrypt admin login, JWT verification, and protected endpoint access passed.

## Verification notes
- Frontend production build: passed on Next 15.5.23, 22 static pages; no ignored TypeScript build errors. Rebuilt after final subpath asset corrections.
- Standalone runtime verified after copying `public/` and `.next/static` as performed by the production Dockerfile.
- Backend syntax: all JS passed `node --check`; bcrypt + legacy MD5 helper test passed.
- Backend npm audit: 0 vulnerabilities.
- Frontend dependencies upgraded: Next 15.5.23 and jsPDF 4.2.1. Remaining audit: 6 findings (1 moderate, 5 high), notably `xlsx@0.18.5` with no npm fix available plus transitive findings. Treat spreadsheet import/export as preview-only until xlsx replacement/migration is completed.
- Original local SVG mark created; no upstream brand asset is included.
- ByteRover curate blocked because no provider is connected.

## Stage 4 — External artifacts
- [x] Coret concept map created and shared: https://coret.id/share/957b3603bb8e48acc76141334fa6da0835195f1b85ab8d6d
- [x] Git repo initialized and remote connected.
- [x] Commit/push verified on `main` (`728026c`, then quality tracker fix `ae2d3bd`).

## Stage 5 — Deployment
- [x] DNS resolves to VPS.
- [x] SSH/sudo access verified.
- [x] Read-only preflight completed; reverse proxy identified as Caddy (not Nginx).
- [x] Existing Caddy configuration backed up before each change.
- [x] Dedicated ports allocated: frontend `127.0.0.1:3100`, backend `127.0.0.1:5106`, MariaDB `127.0.0.1:3306`.
- [x] Dedicated MariaDB database/user initialized; 8 tables and bcrypt operator account verified.
- [x] Isolated systemd services deployed and enabled: `kampungdigital-frontend`, `kampungdigital-backend`.
- [x] Dedicated Caddy host/subpath routing added; configuration validation and reload passed.
- [x] Let's Encrypt certificate issued; HTTPS health and application routes passed.
- [x] Existing services/ports remained active and no failed systemd units were introduced.
- [x] Rollback path and live deployment evidence documented in `docs/DEPLOYMENT-LIVE-20260821.md`.
