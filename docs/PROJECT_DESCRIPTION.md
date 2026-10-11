# TCL Guide — Project Description

Local discovery platform for Tachileik, Myanmar: one browsable directory of
food-related businesses (restaurants, cafes, bakeries, street-food stalls, bars,
hotels, shops), replacing scattered Telegram posts and social media threads.
Content is bilingual (Burmese + English) throughout.

## Public features

- **Map-first Places Explorer** (the home screen): a full-screen MapLibre map
  with a place list kept in sync. Tapping a marker highlights its list row;
  tapping a row flies the map to the marker and opens a preview.
- **Search & filtering**: text search across names, categories, and areas, plus
  one-tap category chips. Filters live in the URL, so any filtered view is
  shareable and bookmarkable.
- **Drawers, not pages, for the list**: on mobile a bottom drawer with
  peek/expanded snap points (opens expanded); on desktop a side drawer. Both
  are non-modal, so the map stays interactive underneath, each with its own
  trigger button next to the search bar.
- **Place detail pages**: photo gallery with click-to-expand, category/area
  chips, price level + note, tags (halal, vegetarian, delivery, wifi, …),
  address, hours, phone, description, a mini location map, and directions/call
  actions (sticky action bar on mobile).
- **Data vocabulary**: categories and areas are first-class relations (they
  evolve); price level is a coarse LOW/MID/HIGH tier plus a free-text note;
  tags are a fixed vocabulary validated in code. See `GLOSSARY.md` for terms.

## Admin features (`/dashboard`)

- **Overview**: directory stats (total places, published, areas covered).
- **Place management**: create, edit, publish/hide, and delete (confirmed)
  places; photo uploads go to Neon S3-compatible storage with preview-before-upload
  so closing the form early never orphans files; a click-or-drag map picker
  sets the location.
- **Category & area management**: full CRUD; deleting an area (or category)
  still referenced by places is blocked.
- **Settings page**: Light/Dark/System theme toggle plus admin profile
  (display name, password change).
- **Forms** built on shadcn components (selects, inputs, sheets, dialogs)
  with inline validation errors.

## Access model

Public browsing needs no account. All management is gated by Better Auth
(admin plugin); the first admin is bootstrapped from the `ADMIN_EMAIL`
environment variable, and the dashboard layout redirects non-admins away.

## Tech snapshot

- **Monorepo**: Turborepo + pnpm workspaces.
- **Web** (`apps/web`): Next.js + React + Tailwind CSS, shadcn/ui components
  (Base UI primitives) owned directly by the app.
- **API** (`apps/server`): NestJS modular monolith — business modules under
  `src/modules/*` (areas, categories, places, uploads), Prisma + PostgreSQL,
  Better Auth, REST with OpenAPI/Swagger.
- **Deploy**: Docker Compose (web + server).
- **Env**: each app owns a `.env.schema`; Varlock generates typed accessors.

See `README.md` for setup and scripts, `GLOSSARY.md` for domain language,
`TODO.md` for the current task list, and `docs/adr/` for decisions.
