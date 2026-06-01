# Backend API smoke test

End-to-end smoke test for the backend endpoints the mobile app's `feature/v1.0-changes`
branch calls. It registers throwaway users against the **local Docker dev backend** and
walks the full flow: auth → identity → GraphQL feed → follow / message / report / block /
push token → (if a video exists) comments / reactions / view tracking.

It is a *smoke* test: it confirms each endpoint is reachable and returns a sane,
expected-shape response — not an exhaustive check of business logic.

## Prerequisites

The RushRanks dev env must be up:

```bash
# in reel100-backend/apps/api-server
npm run docker:dev      # Postgres (5432) + Redis (6379)
npm start               # NestJS API on :3000   <-- start this; the test waits for it
```

The test **waits** for the API to come up (default 3 min), so you can launch it after
starting the test, or before — either order works.

## Run

```bash
npm run smoke:backend
# or
node scripts/smoke/backend-smoke.mjs
```

Targets `http://localhost:3000` by default. Exits `0` if every step passes, `1` otherwise.

## How the email-verification gate is handled

`register` leaves a user `Pending`; logging in needs `Active`, which needs the 4-digit
`verificationToken`. The backend returns that token in the `register` response (no
serializer strips it), so the test reads it directly. If it's ever absent, it falls back
to reading `"verificationToken"` from the dev Postgres (`psql` locally, then `docker exec`).

## Environment variables

| Var | Default | Purpose |
| --- | --- | --- |
| `SMOKE_BASE_URL` | `http://localhost:3000` | API origin |
| `SMOKE_WAIT_MS` | `180000` | How long to wait for the server to come up |
| `SMOKE_DB_HOST` / `SMOKE_DB_PORT` | `127.0.0.1` / `5432` | Dev Postgres (verification-code fallback) |
| `SMOKE_DB_NAME` / `SMOKE_DB_USER` / `SMOKE_DB_PASSWORD` | `reel100` | Dev Postgres creds |
| `SMOKE_DB_CONTAINER` | auto-detect | Container to `docker exec psql` in |
| `NO_COLOR` | – | Disable ANSI colors |

## Notes

- Per the chosen "full flow" scope, the test **writes** to the dev DB: it creates two
  users plus a follow, message, report, block, and push token. It deletes what has a
  delete endpoint (follow, block, push token, comment, reaction); the two users, the
  message, and the report remain in the dev DB.
- Video-dependent steps (comments, reactions, track) are **skipped** (not failed) when the
  feed is empty. Seed/upload a video to exercise them.
