# Development Workflow

This document describes the engineering practices, validation standards, and git branching strategies for contributors to the **ZIVAH International Website**.

---

## 🛠️ Prerequisites

- **Node.js**: 18.18.0 or higher (Node 22 LTS recommended)
- **Package Manager**: `pnpm` (Corepack enabled)
- **Database**: PostgreSQL 13+ instance running locally or via Docker
- **Git**: Git 2.30+

---

## 💻 Local Setup

```bash
# 1. Install dependencies
pnpm install

# 2. Configure environment
cp .env.example .env.local

# 3. Setup database
pnpm db:generate
pnpm db:push
pnpm db:seed

# 4. Launch development server
pnpm dev
```

---

## 🧪 Quality Gates & Validation Standards

Before pushing commits or opening pull requests, always execute the following verification steps:

```bash
# 1. Code Formatting
pnpm format:check

# 2. TypeScript Typecheck
pnpm type-check

# 3. ESLint Verification
pnpm lint

# 4. Production Build Verification
pnpm build

# 5. Git Cleanliness
git diff --check
```

### Auto-Formatting

To automatically format the repository with Prettier:

```bash
pnpm format
```

---

## 🌿 Branching & Commit Conventions

### Branch Strategy

- **`main`**: Production releases. Deploys to the production domain.
- **`develop`**: Active integration branch for new features and fixes.
- **`feature/<name>`**: New user features.
- **`fix/<name>`**: Bug fixes.
- **`chore/<name>`**: Tooling, dependencies, and docs.

### Commit Conventions (Conventional Commits)

Commit messages must adhere to the format:

```
<type>(<scope>): <description>
```

- **Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `ci`
- **Common Scopes**: `auth`, `catalog`, `quote`, `admin`, `db`, `ui`, `i18n`, `deps`
- **Example**: `feat(quote): add support for master carton measurement units`

---

## 🤖 Spec-Kit & AI-Assisted Development

This repository integrates the **Spec-Kit** methodology for spec-driven development. Prompts and skills are configured under `.github/skills/`, `.kiro/prompts/`, `.agents/`, and `.specify/`.

### The Spec-Driven Workflow:

1. **Specify (`speckit-specify`)**: Draft the functional specification for the new requirement.
2. **Clarify (`speckit-clarify`)**: Identify edge cases, questions, and ambiguous requirements.
3. **Plan (`speckit-plan`)**: Generate technical implementation plans conforming to the architecture.
4. **Tasks (`speckit-tasks`)**: Create an ordered checklist of discrete development tasks.
5. **Implement (`speckit-implement`)**: Execute the implementation against the task list.
6. **Analyze (`speckit-analyze`)**: Verify consistency and pass all quality gates.
