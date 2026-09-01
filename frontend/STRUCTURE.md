# Frontend architecture

Feature-based structure for maintainability.

```
src/
├── app entry
│   ├── main.jsx
│   └── App.jsx                 # routes only
│
├── features/                   # domain modules
│   ├── projects/
│   │   ├── api/projectApi.js
│   │   ├── hooks/useProjects.js
│   │   └── pages/ProjectsPage.jsx
│   └── tickets/
│       ├── api/ticketApi.js
│       ├── components/
│       ├── constants/status.js
│       ├── hooks/useTickets.js
│       └── pages/
│
└── shared/                     # cross-feature UI & utils
    ├── components/
    │   ├── layout/PageShell.jsx
    │   └── ui/                 # Button, Modal, Card, Badge…
    ├── lib/                    # axios, cn
    └── utils/format.js
```

## Conventions

- **Features** own their API, hooks, and pages.
- **Shared** holds reusable UI with no domain knowledge.
- Status logic lives in `features/tickets/constants/status.js` (single source of truth).
- Animations use **framer-motion** (page enter, lists, modal, buttons).
- Prefer hooks for data fetching; keep pages thin.

## Run

```bash
cd frontend
npm install
npm run dev
```

## Legacy paths

Older files under `src/pages`, `src/service`, `src/components` are unused.
Safe to delete after verifying the new routes work.
