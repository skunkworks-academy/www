# Course Apps Monorepo Migration Plan

## Overview
Consolidate all interactive course UIs (CompTIA, Microsoft, OWASP) into a unified React monorepo at `course-apps/` with shared tooling, styling, and build configuration.

## Current State
```
skunkworks-academy/.github/
├── comptia/                           # React app ✓
│   ├── package.json
│   ├── public/
│   ├── src/
│   └── ...
├── self-paced/
│   ├── microsoft/                     # Static HTML + inline JS
│   │   ├── ms-saas-plan-101/
│   │   ├── d365-ce-bp-101/
│   │   └── ms-mp-bp-101/
│   ├── security/                      # Static HTML + inline JS
│   │   └── skw-owasp-top10-2025/
│   └── ...
└── package.json                       # New root workspace
```

## Target State
```
skunkworks-academy/.github/
├── course-apps/                       # New monorepo root
│   ├── package.json                   # Root workspace
│   ├── packages/                      # Shared packages
│   │   ├── shared-ui/                 # React components, styles, hooks
│   │   └── course-sdk/                # Course model, progress tracking, etc.
│   ├── apps/
│   │   ├── comptia/                   # Migrated from root
│   │   │   ├── package.json           # Workspace member
│   │   │   └── src/
│   │   ├── microsoft/                 # New React app
│   │   │   ├── package.json
│   │   │   ├── public/
│   │   │   ├── src/
│   │   │   └── courses/
│   │   │       ├── ms-saas-plan-101/
│   │   │       ├── d365-ce-bp-101/
│   │   │       └── ms-mp-bp-101/
│   │   └── security/                  # New React app
│   │       ├── package.json
│   │       ├── public/
│   │       ├── src/
│   │       └── courses/
│   │           └── skw-owasp-top10-2025/
│   ├── turbo.json                     # Build orchestration
│   └── ...
└── self-paced/                        # Keeps LMS/catalogue integration
    ├── index.html                     # Still main entry point
    └── microsoft/ → ../course-apps/apps/microsoft/dist/ (symlink or build output)
```

## Phase 1: Foundation (Week 1)

### 1.1 Create Monorepo Structure
**Files to create:**
- `course-apps/package.json` — Root workspace with npm workspaces
- `course-apps/turbo.json` — Monorepo build orchestration
- `course-apps/packages/shared-ui/package.json` — Shared React components
- `course-apps/packages/course-sdk/package.json` — Shared course logic
- `course-apps/apps/comptia/package.json` — Migrated React app (symlink)

**Key decisions:**
- Use npm workspaces (no Yarn, no Lerna — keep it simple)
- Use Turbo for build caching and task orchestration
- Shared UI: Storybook for component library
- Course SDK: TypeScript for type safety

**Estimated effort:** 2-3 hours

### 1.2 Create Shared UI Package
**Deliverables:**
- Button, Card, Modal, Layout components
- Global stylesheet (Tailwind or CSS Modules)
- Theme provider (light/dark mode)
- Accessibility helpers

**Files:**
- `course-apps/packages/shared-ui/src/components/`
- `course-apps/packages/shared-ui/src/styles/`
- `course-apps/packages/shared-ui/src/hooks/`
- `course-apps/packages/shared-ui/package.json` (exports as npm package)

**Estimated effort:** 4-6 hours

### 1.3 Create Course SDK Package
**Deliverables:**
- Course model (TypeScript interfaces)
- Progress tracker (localStorage → DB-ready)
- Assessment engine (randomized quizzes, scoring)
- Capstone evaluator

**Files:**
- `course-apps/packages/course-sdk/src/types/` (Course, Module, Quiz, etc.)
- `course-apps/packages/course-sdk/src/progress/`
- `course-apps/packages/course-sdk/src/assessment/`

**Estimated effort:** 6-8 hours

---

## Phase 2: App Migration (Week 2)

### 2.1 Migrate CompTIA
**Steps:**
1. Move `comptia/` → `course-apps/apps/comptia/`
2. Update imports to use `@skunkworks/shared-ui` and `@skunkworks/course-sdk`
3. Replace inline styles with Tailwind classes
4. Test build and deployment
5. Update deployment path in `package.json` (`"homepage": "..."`), if needed

**Estimated effort:** 3-4 hours

### 2.2 Create Microsoft App
**Steps:**
1. Create `course-apps/apps/microsoft/` React app
2. Port course content from static HTML files:
   - `ms-saas-plan-101/index.html` → `src/courses/MsSaasPlan101.tsx`
   - `d365-ce-bp-101/index.html` → `src/courses/D365CeBp101.tsx`
   - `ms-mp-bp-101/index.html` → `src/courses/MsMpBp101.tsx`
3. Use shared UI components and course SDK
4. Add React Router for navigation
5. Test and build

**Estimated effort:** 8-10 hours (includes porting 3 courses)

### 2.3 Create Security App
**Steps:**
1. Create `course-apps/apps/security/` React app
2. Port OWASP course from static HTML:
   - `skw-owasp-top10-2025/index.html` → `src/courses/OwasoTop102025.tsx`
   - Extract modules, labs, assessments
3. Use shared UI + course SDK
4. Integrate vulnerable-app lab server
5. Test and build

**Estimated effort:** 6-8 hours

---

## Phase 3: Integration & Deployment (Week 3)

### 3.1 Update Deployment Pipeline
**Current:** Each app deploys independently to different domains
- `comptia/` → `courses.skunkworks.africa/comptia`
- Microsoft courses → `skunkworksacademy.com/self-paced/microsoft/...`
- OWASP → `skunkworksacademy.com/self-paced/security/...`

**New:** Single monorepo build outputs to all destinations
- Create `scripts/deploy.sh` that:
  1. Runs `npm run build` (Turbo orchestrates all builds)
  2. Copies `course-apps/apps/*/dist/` to respective paths
  3. Deploys via GitHub Pages or hosting provider

**Files:**
- `.github/workflows/deploy-courses.yml` — New CI/CD
- `scripts/deploy.sh` — Deployment orchestrator
- `turbo.json` — Build task graph

**Estimated effort:** 3-4 hours

### 3.2 Update LMS Integration
**Current:** `self-paced/index.html` links to course pages

**New:** Update catalogue links to point to React apps:
- `microsoft/` → `../course-apps/apps/microsoft/dist/index.html` (or symlink)
- `security/` → `../course-apps/apps/security/dist/index.html` (or symlink)

**Files:**
- `self-paced/index.html` — Update course card links
- `self-paced/microsoft/index.html` → Link to React app or redirect
- `self-paced/security/index.html` → Link to React app or redirect

**Estimated effort:** 1-2 hours

### 3.3 Documentation & Testing
**Deliverables:**
- `course-apps/README.md` — Setup & development guide
- `course-apps/ARCHITECTURE.md` — Design decisions
- Migration checklist (all 3 apps tested end-to-end)
- Performance benchmarks (before/after)

**Estimated effort:** 3-4 hours

---

## Phase 4: Cleanup & Optimization (Ongoing)

### 4.1 Deprecate Old Static Files
- Archive or remove `self-paced/microsoft/*.html` files
- Archive or remove `self-paced/security/*.html` files
- Keep `self-paced/index.html` (catalogue) if it still serves as entry point

### 4.2 Performance Optimization
- Code splitting per course (lazy load modules)
- Bundle size analysis (webpack-bundle-analyzer)
- Service worker for offline access (PWA)

### 4.3 Feature Backlog
- [ ] Shared analytics (track course completions, quiz scores)
- [ ] User authentication (if needed)
- [ ] Course notifications/reminders
- [ ] Mobile responsive design enhancements

---

## File Structure (Detailed)

```
course-apps/
├── package.json
│   workspaces: ["packages/*", "apps/*"]
├── turbo.json
├── .eslintrc.json
├── tsconfig.base.json
├── README.md
├── ARCHITECTURE.md
│
├── packages/
│   ├── shared-ui/
│   │   ├── package.json
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── Modal.tsx
│   │   │   │   └── Layout.tsx
│   │   │   ├── styles/
│   │   │   │   ├── globals.css
│   │   │   │   └── tailwind.css
│   │   │   ├── hooks/
│   │   │   │   ├── useCourseProgress.ts
│   │   │   │   └── useTheme.ts
│   │   │   └── index.ts (exports)
│   │   ├── Storybook/
│   │   └── tsconfig.json
│   │
│   └── course-sdk/
│       ├── package.json
│       ├── src/
│       │   ├── types/
│       │   │   ├── course.ts
│       │   │   ├── module.ts
│       │   │   ├── assessment.ts
│       │   │   └── progress.ts
│       │   ├── progress/
│       │   │   └── ProgressTracker.ts
│       │   ├── assessment/
│       │   │   ├── QuizEngine.ts
│       │   │   └── Scorer.ts
│       │   └── index.ts (exports)
│       └── tsconfig.json
│
├── apps/
│   ├── comptia/
│   │   ├── package.json (points to @skunkworks/shared-ui, @skunkworks/course-sdk)
│   │   ├── public/
│   │   ├── src/
│   │   │   ├── pages/
│   │   │   ├── components/
│   │   │   └── App.tsx
│   │   ├── build (output)
│   │   └── tsconfig.json
│   │
│   ├── microsoft/
│   │   ├── package.json
│   │   ├── public/
│   │   ├── src/
│   │   │   ├── pages/
│   │   │   │   ├── Home.tsx
│   │   │   │   ├── CoursePage.tsx
│   │   │   │   └── Assessment.tsx
│   │   │   ├── courses/
│   │   │   │   ├── MsSaasPlan101/
│   │   │   │   │   ├── modules.ts
│   │   │   │   │   ├── quizzes.ts
│   │   │   │   │   └── index.ts
│   │   │   │   ├── D365CeBp101/
│   │   │   │   └── MsMpBp101/
│   │   │   ├── components/
│   │   │   ├── App.tsx
│   │   │   └── Router.tsx
│   │   ├── build (output → self-paced/microsoft/)
│   │   └── tsconfig.json
│   │
│   └── security/
│       ├── package.json
│       ├── public/
│       ├── src/
│       │   ├── pages/
│       │   ├── courses/
│       │   │   └── OwasoTop102025/
│       │   │       ├── modules.ts
│       │   │       ├── labs.ts
│       │   │       ├── assessments.ts
│       │   │       └── index.ts
│       │   ├── components/
│       │   ├── App.tsx
│       │   └── Router.tsx
│       ├── build (output → self-paced/security/)
│       └── tsconfig.json
│
└── scripts/
    └── deploy.sh
```

---

## Risk Mitigation

| Risk | Mitigation |
|---|---|
| Breaking existing links during migration | Keep old URLs working via redirects or symlinks for 2 weeks |
| Deployment failures | Test each app independently before monorepo integration |
| Performance regression | Use Lighthouse CI to track metrics before/after |
| Team unfamiliarity with Turbo/monorepo | Start with documentation, run team workshop |
| Merge conflicts during active development | Use feature branches, merge to `main` incrementally |

---

## Timeline Summary

| Phase | Duration | Effort |
|---|---|---|
| **Phase 1: Foundation** | Week 1 | 14-18 hours |
| **Phase 2: Migration** | Week 2 | 17-22 hours |
| **Phase 3: Integration** | Week 3 | 7-10 hours |
| **Phase 4: Cleanup** | Ongoing | Variable |
| **Total** | 3 weeks | ~38-50 hours (1 full-time dev) |

---

## Success Criteria

- ✅ All 3 course apps deploy from single `npm run build` command
- ✅ Shared UI components used across all apps (reduces code duplication by 30%)
- ✅ Bundle size reduced by 20% (code splitting + shared dependencies)
- ✅ Build time < 2 minutes (with Turbo caching)
- ✅ Zero downtime migration (old URLs still work during transition)
- ✅ All courses pass end-to-end tests
- ✅ Documentation updated for new developers
