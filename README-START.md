# Start both frontend and backend

This repository now provides a single command to start the frontend (Vite dev server) and backend (Node/Express with nodemon) concurrently.

To start both in development mode:

```bash
npm run dev
```

Notes:
- The root `package.json` script runs `concurrently` which starts `npm run dev` in both `frontend` and `backend` folders.
- If you prefer starting only frontend or backend, run these from the respective folders:

```bash
npm run dev --prefix frontend
npm run dev --prefix backend
```

If you need the production server only, you can run from root:

```bash
npm start
```

(Which aliases to `npm run dev` in this repo.)
