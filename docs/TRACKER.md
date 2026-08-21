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
- [x] Frontend lint after workspace redesign: 0 errors (87 transitional warnings documented).
- [x] Frontend production build: Next 15.5.23, 22 static pages, type check enabled.
- [x] Backend install/check + password helper test.
- [x] TypeScript build checks enabled and passed.
- [x] Mobile/desktop screenshot inspection on the live HTTPS deployment (1440×1100 and 390×844); no overflow, broken assets, or visible rendering errors found.
- [x] Critical route and asset crawl on local standalone preview (15 routes + 16 discovered assets returned HTTP 200).
- [x] Live HTTPS crawl: 16 frontend/API routes + 16 discovered assets returned HTTP 200.
- [x] Live auth smoke: bcrypt Super Admin login, JWT verification, and protected endpoint access passed.
- [x] Workspace UI/UX redesign completed: grouped role-aware sidebar, responsive header/search, new emerald design system, and operational Super Admin control center.
- [x] Final authenticated browser verification passed at 1440×1000 and 390×844: no horizontal overflow, broken images, console/page errors, stale loading state, or incorrect dashboard counts.
- [x] Self-hosted deployment no longer requests Vercel Analytics; local application icon added to remove favicon 404 noise.
- [x] Public product showcase added at `/kampungdigital` with 7 narrative sections, 6 feature modules, authentic dashboard visuals, role explanation, workflow, open-source/MIT attribution, responsive CTA, and SEO/OpenGraph metadata.
- [x] Login moved cleanly to `/kampungdigital/login`; all logout, idle timeout, and unauthenticated dashboard redirects updated to the dedicated login route.
- [x] Showcase preview verified at 1440×1000 and 390×844: no horizontal overflow, missing HTTP assets, broken layout, or invalid login links; final visual audit verdict GO.
- [x] Public showcase now exposes a clear upstream lineage: `heri99123/nalarin-dapung` → `remek8787/kampungdigital`, with MIT attribution and appreciation to Heri Tico.

## Verification notes
- Frontend production build: passed on Next 15.5.23, 22 static pages; no ignored TypeScript build errors. Rebuilt after final subpath asset corrections and the 2026-08-21 workspace redesign.
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
- [x] Redesigned release promoted atomically to `/opt/kampungdigital/releases/20260821-1412-redesign`; previous release pointer and systemd units backed up under `/opt/kampungdigital/backups/`.
- [x] Post-promotion checks passed for 10 frontend routes, 5 authenticated API endpoints, unauthenticated 401 boundary, root-host 404 isolation, four KampungDigital/Caddy/MariaDB services, and protected existing ports `18789`, `19081`, `5901`, `6081`.
- [x] Showcase release `/opt/kampungdigital/releases/20260821-1510-showcase` promoted atomically; backup pointer `current-before-showcase-20260821-232759.txt` created and post-deployment smoke test passed.
