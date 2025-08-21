# Aspire Cards by Mayank Soni

A responsive banking cards UI that replicates the Aspire app experience: manage debit cards, view card details, and browse recent transactions. The app is built with modern React/Next patterns and a lightweight mock API persisted in `localStorage`.

## What this project is about
- Interactive debit card carousel with Show/Hide card numbers and freeze/unfreeze.
- "New card" flow: creates a card with a random number/expiry and auto-generates recent transactions tied to the new card.
- Recent transactions module with categories, credit/debit styling, and responsive mobile bottom sheet.
- Fully responsive: desktop layout with right column, mobile layout with a draggable bottom sheet.

## Tech stack
- Next.js 15 (App Router)
- React 19
- TypeScript (strict)
- Tailwind CSS v4
- Vitest + jsdom for unit tests

## Requirements
- Node.js 18+
- npm 9+

## Setup & run
```bash
# 1) Install deps
npm install

# 2) Start dev server (http://localhost:3000)
npm run dev

# 3) Build & start production
npm run build
npm start
```

## Tests
```bash
# Run test suite once
npm run test

# Watch mode
npm run test:watch
```

## Project structure
- `src/app/` – Next.js App Router entrypoints, global styles (`globals.css`), and layout
- `src/components/` – UI components (cards, carousel, actions, modal, sheets, transactions)
- `src/context/CardContext.tsx` – Global state: cards, selected card, visibility of numbers, transactions
- `src/lib/api.ts` – Mock API: seeding, card creation, random transactions, localStorage persistence
- `src/lib/storage.ts` – Safe localStorage helpers
- `src/types.ts` – Core domain types (`Card`, `Transaction`)
- `tests/` – Vitest tests for data layer

## Data & behavior
- On first load, the app seeds one card and recent transactions in `localStorage`.
- Creating a new card (`Add new card` button) will:
  - Generate a random 16-digit number and expiry
  - Persist the card to `localStorage`
  - Generate 4 random recent transactions associated with that card
- You can reset all data by clearing the site’s `localStorage` in your browser.

## Notes
- Styling is implemented with Tailwind CSS utilities and a small set of CSS variables (`globals.css`).
- The project intentionally avoids a backend; the mock API layer demonstrates realistic flows while staying fully client-side.
