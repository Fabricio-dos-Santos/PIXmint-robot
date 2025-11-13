# PIXmint Frontend (scaffold)

Minimal Vite + React + TypeScript scaffold that consumes the backend `/employees` endpoint.

Quick start:

```bash
cd frontend
npm install
npm run dev
```

Then open http://localhost:5173 and go to `/employees` to see the list.

Notes:
- The API base URL defaults to `http://localhost:3000`. You can override with `VITE_API_BASE_URL` env var.
- To run the frontend together with the backend from the repo root use `npm run dev:all` (opens two PowerShell windows) or `npm run dev:all:bg` (runs both in background and streams logs to the current terminal).
- Run frontend tests:

```powershell
cd frontend
npm test
```
- This is a minimal scaffold: add linting, Tailwind, or additional libraries as needed.
