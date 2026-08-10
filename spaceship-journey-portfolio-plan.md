# Spaceship Journey Portfolio — Full Build Plan
### 3D scroll-driven portfolio + a custom admin panel to manage it

---

## 0. Design North Star

Awwards-caliber sites rarely win on concept alone — the spaceship idea is strong, but what separates "cool demo" from "winner" is craft in the details. Treat these as non-negotiable:

- **First 3 seconds decide everything.** The preloader and launch sequence must feel intentional, not like a loading spinner.
- **Nothing snaps.** Every camera move, hover, and transition uses a deliberate easing curve — no default linear/ease CSS.
- **Sound is part of the design**, not an afterthought — subtle engine hum, UI beeps, docking sounds — muted by default, one clear toggle.
- **It's fast despite being 3D.** Judges bounce off slow loads faster than they admire polygons.
- **It degrades gracefully.** A recruiter on a 3-year-old laptop or a phone should still get the full story, just in a lighter form.
- **Every micro-detail is designed**: cursor, scrollbar, favicon, OG image, 404 page, empty states, focus rings.

---

## 1. System Architecture

Two applications share one content model. The portfolio never talks to a database directly — it goes through a thin **content service** interface. Early phases return mock data from that interface; the final phase swaps the implementation to hit real APIs. The 3D scene, camera path, and scroll logic never need to change.

```
                         ┌─────────────────────────┐
                         │      Content Model        │
                         │  (TypeScript interfaces)  │
                         └────────────┬───────────────┘
                                      │
                 ┌────────────────────┼────────────────────┐
                 │                                          │
     ┌───────────▼────────────┐                ┌────────────▼────────────┐
     │   lib/content.ts         │                │  Admin Panel (/admin)    │
     │  (content service)       │                │  auth-gated, CRUD UI     │
     │                           │                │                          │
     │  Phase 1–7:  mock data    │                │  Built in final phase    │
     │  Phase 8:    real API ────┼──────► Postgres ◄──── writes/updates      │
     └───────────┬───────────────┘        (via Prisma)                      │
                 │                                                          │
     ┌───────────▼────────────┐
     │  Public Portfolio site   │
     │  (R3F spaceship journey) │
     └───────────────────────────┘
```

**Why one Next.js app with two route groups, not two separate apps:** for a portfolio-scale project, a single repo with `app/(site)` and `app/(admin)` route groups gives you real separation (different layouts, different auth, different look) without monorepo overhead. If this ever grows into a multi-tenant product, splitting into a Turborepo monorepo later is a clean migration — call this out but don't build it prematurely.

---

## 2. Tech Stack

### 2.1 Public Portfolio (frontend)

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 14+ (App Router) + TypeScript | SSR for SEO on overlay text, RSC for fast initial paint |
| 3D engine | React Three Fiber + drei | Declarative Three.js, huge ecosystem of helpers |
| Post-processing | `@react-three/postprocessing` (bloom, chromatic aberration, vignette, noise/grain) | This is what makes the scene look "awwards" instead of "tutorial" |
| Camera path | `THREE.CatmullRomCurve3` + custom hook, or drei `CameraControls` | Smooth spline through storyboarded waypoints |
| Scroll engine | Lenis (smooth scroll) + GSAP ScrollTrigger | Buttery scroll feel; ScrollTrigger drives the `t` value along the curve |
| UI micro-animation | Framer Motion | Overlay panels, hover states, page/section transitions |
| Styling | Tailwind CSS + CSS variables for theming | Fast iteration, easy to theme from admin panel later |
| State (client) | Zustand | Lightweight store for scroll progress, audio state, active waypoint |
| Data fetching | TanStack Query | Caching layer once real API is wired in Phase 8 |
| Assets | `.glb` models, Draco-compressed via `gltf-pipeline` | Biggest performance lever in the whole project |
| Audio | Howler.js | Sound-sprite support (one file, multiple cues), handles browser autoplay restrictions, tiny footprint |
| Fonts | Variable font (e.g. self-hosted, `next/font`) | Avoids FOUT, keeps typography crisp |

### 2.2 Admin Panel (frontend)

| Layer | Choice | Why |
|---|---|---|
| Framework | Same Next.js app, `app/(admin)` route group | Shares types/content model with the site, one deploy |
| UI kit | shadcn/ui (Radix + Tailwind) | Accessible primitives, fast to build real CRUD screens |
| Tables | TanStack Table | Sortable/filterable lists for projects, experience, skills |
| Forms | React Hook Form + Zod | Type-safe validation shared with the DB schema |
| Rich text | Tiptap | Editing bio, project descriptions, without a heavy CMS |
| Reordering | dnd-kit | Drag-and-drop reorder of experience timeline / project order |
| Image upload | `react-dropzone` + Supabase Storage (or Cloudinary) | Drag-drop upload with preview and automatic optimization |
| Auth | Supabase Auth (or NextAuth + credentials) | Single/small number of admin users, magic-link or email+password |

### 2.3 Shared Backend / Data Layer

| Layer | Choice | Why |
|---|---|---|
| Database | Postgres via Supabase | Free tier is enough for a portfolio; gives DB + Auth + Storage in one place |
| ORM | Prisma | Type-safe schema, easy migrations, generates types shared by site + admin |
| File/image storage | Supabase Storage or Cloudinary | Cloudinary if you want on-the-fly image transforms/CDN optimization |
| Email (contact form) | Resend | Simple transactional email API, generous free tier |
| Hosting | Vercel | Native Next.js support, edge caching, preview deployments per PR |

### 2.4 Tooling & Ops

| Purpose | Tool |
|---|---|
| Design / moodboard / wireframes | Figma |
| 3D modeling | Blender (free) |
| 3D asset sourcing | Sketchfab, Poly Haven (verify commercial-use license on anything downloaded) |
| Model compression | `gltf-pipeline` (Draco), `gltfjsx` to convert `.glb` → JSX components |
| Performance testing | Chrome DevTools, Lighthouse, WebPageTest, PageSpeed Insights |
| Error monitoring | Sentry |
| Analytics | Plausible or PostHog (privacy-friendly, no cookie banner needed) |
| Version control / CI | GitHub + GitHub Actions (lint, typecheck, build on PR) |
| Environments | Vercel preview deployments for every PR |

---

## 3. Content Model (what the admin panel edits)

Defining this schema up front — before writing any 3D code — is the single most important step. Everything else is built against it.

| Entity | Key fields |
|---|---|
| **SiteSettings** | accent color, audio-on-by-default, SEO title/description, OG image, maintenance mode |
| **About** | headline, bio (rich text), profile photo, resume/CV file, social links (GitHub, LinkedIn, X, etc.) |
| **Experience[]** | company, role, start date, end date, description, tech tags, logo, display order |
| **Project[]** | title, summary, description (rich text), cover image, gallery images[], tech tags[], live URL, repo URL, featured (bool), display order, "docking" camera notes (optional) |
| **Skill[]** | category (Navigation / Shields / Comms etc.), name, proficiency %, icon, display order |
| **ContactSubmission[]** | name, email, message, submitted at, read (bool) — read-only inbox in admin |

Ship every mock-data file (`mock/about.ts`, `mock/projects.ts`, etc.) in exactly this shape from day one. The admin panel in Phase 8 becomes "a UI that edits these same shapes in a database" — not a redesign.

---

## 4. Recommended Repo Structure

```
/app
  /(site)              → public portfolio route group
    /page.tsx           → the spaceship journey
  /(admin)
    /admin
      /login
      /about
      /experience
      /projects
      /skills
      /messages
      /settings
  /api
    /content/[...]      → REST/route handlers, added in Phase 8
/components
  /scene                → R3F components (Ship, Planet, AsteroidField, Cockpit…)
  /overlays              → HTML overlay UI synced to scroll progress
  /admin                 → shadcn-based CRUD UI
/lib
  content.ts             → content service interface (mock → real swap point)
  db.ts                  → Prisma client (added Phase 8)
  auth.ts                → admin auth helpers (added Phase 8)
/mock
  about.ts, experience.ts, projects.ts, skills.ts
/prisma
  schema.prisma          → added Phase 8
/public/models            → compressed .glb assets
```

---

## 5. Step-by-Step Development

### Phase 1 — Design & Storyboard
- Moodboard in Figma: color grading, typography pairing, reference sites (this is where "awwards or not" gets decided).
- Storyboard the full camera path: sketch where each waypoint (About / Experience / Projects / Skills / Contact) sits along the spline.
- Lock the **content model** (Section 3) as TypeScript interfaces.
- Write mock data files matching those interfaces.
- Define the performance budget (Section 9) now, not later.

### Phase 2 — Core 3D Scene & Assets
- Source or model low-poly ship + 3–5 planet/station meshes + starfield + asteroid cluster. Keep poly counts low.
- Compress every model with Draco via `gltf-pipeline`; convert to JSX with `gltfjsx`.
- Scaffold the Next.js + R3F project: `<Canvas>`, camera, lighting, starfield background, `<Suspense>` + `<Preload>`.
- Get one waypoint rendering end-to-end before adding the rest.

### Phase 3 — Camera Path & Scroll Binding
- Build the Catmull-Rom spline through the storyboarded waypoints.
- Bind Lenis smooth-scroll (or a "throttle" drag control) to a `t` value (0–1) driving camera position/rotation along the curve via GSAP ScrollTrigger.
- Tune easing until it feels cinematic, not mechanical — this is worth disproportionate time.

### Phase 4 — Content Overlays (against mock data)
- Add each waypoint model at its path position with a subtle idle animation (rotation, glow pulse).
- Layer HTML overlays (drei `<Html>` or absolutely-positioned Tailwind synced to scroll progress) pulling from `lib/content.ts` (mock implementation).
- Build: About viewscreen, Experience waypoint sequence, Projects station, Skills cockpit dashboard, Contact transmission panel.
- Build the sound sprite and wire Howler.js per the trigger map in **Section 7**: ambient loop gated behind the "Launch" gesture, waypoint-approach chimes, mute toggle.

### Phase 5 — Docking & Interaction Transitions
- Projects: camera "docks" toward a project pod on click/proximity; overlay expands to full project detail (title, gallery, tags, links).
- Skills: cockpit HUD with animated "operational" status bars per skill.
- Contact: "transmit" styled form, wired to a Resend API route once Phase 8 lands (stub it earlier).
- Wire docking, UI hover/click, and "transmit" sound cues (Section 7) to their respective interactions.

### Phase 6 — Awwards Polish Pass
Run through the full checklist in **Section 8** end to end, including final sound mix/levels. This phase is what actually moves the needle on award-site judging — budget real time for it, don't treat it as a buffer.

### Phase 7 — Performance & Fallback
- Build the low-power / reduced-motion fallback: a lighter 2D "map" version or a static scroll page with identical content, auto-detected via a device/perf check or manual toggle.
- Test frame rate on mid-range phones and load size on throttled 4G.
- Hit the budgets defined in Section 9 before moving on — don't let this slip to "later."

### Phase 8 — Admin Panel
- Set up Supabase (Postgres + Auth + Storage) and Prisma schema mirroring the content model.
- Build admin auth (login-gated `/admin`, single/small admin user list).
- Build CRUD screens per entity: About, Experience (with drag-reorder), Projects (with image upload + gallery), Skills (with drag-reorder), Site Settings.
- Build a read-only Contact Submissions inbox.
- Swap `lib/content.ts` from the mock implementation to real API calls — the site components require **zero changes** if the interfaces were respected.
- Add a "Preview" link in admin so changes can be checked on the live camera path before considering them final.

### Phase 9 — QA, SEO & Launch
- Cross-browser/cross-device pass (Safari iOS is usually where 3D scenes break first).
- SEO: metadata, OG image, sitemap, robots.txt.
- Accessibility pass: keyboard nav for overlays, reduced-motion respected, sufficient contrast on overlay text.
- Final Lighthouse pass against the budget in Section 9.
- Deploy to Vercel, connect custom domain.

---

## 6. Roadmap

| Phase | Duration | Focus |
|---|---|---|
| 1. Design & storyboard | 6–8 days | Moodboard, camera path storyboard, content model, mock data |
| 2. Core 3D scene & assets | 5–6 days | Canvas, models, compression, lighting |
| 3. Scroll binding | 3–4 days | Camera path + scroll/drag easing |
| 4. Content overlays | 5–6 days | HTML overlays for all sections, synced to journey position |
| 5. Docking & interactions | 4–5 days | Project docking, cockpit dashboard, transmit form |
| 6. Awwards polish pass | 5–7 days | Cursor, preloader, sound, transitions, type, grading |
| 7. Fallback & performance | 4–5 days | Low-power fallback, load optimization, device testing |
| 8. Admin panel | 7–9 days | Auth, DB, CRUD screens, uploads, mock→real data swap |
| 9. QA, SEO & launch | 3–4 days | Cross-device QA, accessibility, SEO, deploy |

**Total: ~6.5–8 weeks** solo, working steadily. The 3D portfolio (Phases 1–7) is the harder, riskier chunk; the admin panel (Phase 8) is comparatively mechanical once the content model was respected from day one.

---

## 7. Sound Design

Mentioned as a principle earlier — here's the actual spec.

### 7.1 Trigger Map

| Moment | Sound | Notes |
|---|---|---|
| "Launch" click (first user gesture) | Low rumble + whoosh, one-shot | Ambient loop also starts here — never before a gesture |
| Ambient loop (whole journey) | Continuous low engine hum | Looped; volume automated slightly per scene (a touch louder near the asteroid field, lower near About) |
| Waypoint approach (About / Experience / Skills / Contact) | Soft chime / "signal lock" blip | One-shot, plays once per waypoint entry |
| Project docking | Mechanical clunk + hydraulic hiss | One-shot, tied to the docking camera transition |
| UI hover (buttons, project cards, nav) | Short high-frequency blip, <100ms, low volume | Skip on touch devices — hover doesn't exist there |
| UI click / "Transmit" send | Confirmation beep | |
| Mute / unmute toggle | Subtle click | Always audible even when muted — confirms the toggle worked |
| Contact form success | "Transmission received" chime | |

### 7.2 Implementation
- Build one compressed sound sprite (a single audio file with mapped start/end offsets per cue) via Howler.js, rather than many small files — fewer HTTP requests, smaller total payload.
- Preload the sprite alongside the 3D assets during the loading sequence, but **never auto-play anything before a user gesture** — Chrome/Safari block autoplay-with-sound; gate the ambient loop behind the "Launch" interaction.
- Store mute state in the Zustand store and persist it (e.g. `localStorage`) so it holds across a return visit.
- `SiteSettings.audioOnByDefault` (already in the content model, Section 3) only controls what position the toggle *starts in* after the user's first interaction — it never triggers sound on page load itself.
- Target total sprite payload: **under ~300KB** compressed (`.mp3`/`.ogg` pair, Howler picks the supported format).

### 7.3 Sourcing Assets
- Pull one-shot SFX and a loopable ambient bed from a royalty-free library (Freesound with a permissive license, or a paid pack) — verify commercial-use terms, same diligence as the 3D models.
- Keep it subtle — "quiet cockpit," not "action movie." Tasteful, restrained sound reads as more premium than loud sound.

---

## 8. Awwards Craft Checklist

Go through this deliberately in Phase 6 — it's the difference between "nice project" and "award submission":

- [ ] Custom cursor (context-aware: changes near interactive waypoints)
- [ ] Preloader with real progress (tied to actual asset load %, not fake)
- [ ] Launch sequence feels cinematic (engine ignite → camera pull-back → starfield reveal)
- [ ] Every transition uses a custom easing curve, no default linear/ease
- [ ] Ambient sound design, muted by default, one visible toggle
- [ ] Post-processing pass (subtle bloom, grain, vignette) — not overdone
- [ ] Distinct typography pairing, variable font, no default system font left in
- [ ] Scroll indicator / progress cue for where you are in the journey
- [ ] Designed empty/loading/error states (not framework defaults)
- [ ] Custom 404 page in the same visual language
- [ ] Designed favicon + OG image
- [ ] Micro-copy has personality ("Transmit" not "Submit", "Docking…" not "Loading…")
- [ ] Reduced-motion and low-power fallback doesn't feel like a downgrade — it feels like a deliberate alternate mode

---

## 9. Performance Budgets

Set these now, hold to them in Phase 7:

- Initial JS bundle (excluding 3D assets): **< 200KB gzipped**
- Total compressed 3D model payload: **< 5MB**, loaded progressively (ship + nearest waypoint first)
- LCP on mid-tier 4G: **< 2.5s**
- Target frame rate: **60fps desktop, 30fps+ mobile** (fallback kicks in below this)
- Lighthouse Performance score: **90+**

---

## 10. Watch-outs

- **Load time is still the #1 risk.** A heavy first download loses visitors before the ship even launches — budget real time for asset optimization, don't treat it as cleanup.
- **A lightweight fallback is mandatory**, not optional — for low-end devices and for recruiters who just want the resume fast.
- **3D asset licensing** — verify commercial-use terms on anything not modeled yourself (Sketchfab in particular).
- **Respect the content model from day one.** If mock data doesn't match what the admin panel will eventually write, Phase 8 turns into a rewrite instead of a data-source swap.
- **Admin auth is a real attack surface**, even for a portfolio — don't skip proper auth just because it "isn't the main product."
- **Scope creep in Phase 6.** The polish checklist can expand indefinitely — timebox it and ship.

---

## 11. Build Order, Summarized

Design → mock content model → 3D scene → camera/scroll → overlays (mock data) → interactions/docking → polish pass → performance/fallback → **admin panel (real data)** → QA & launch.
