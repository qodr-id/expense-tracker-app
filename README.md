# TanStack Demo App

- `frontend`: React + TanStack Query + TanStack Router
- `backend`: Express + Drizzle ORM + SQLite

## Setup

Install dependency frontend:

```bash
cd frontend
npm install
```

Install dependency backend:

```bash
cd backend
npm install
```

Siapkan database dengan migration:

```bash
cd backend
npm run db:migrate
```

Kalau schema berubah, buat migration baru:

```bash
cd backend
npm run db:generate
npm run db:migrate
```

## Menjalankan

Terminal 1:

```bash
cd backend
npm run dev
```

Terminal 2:

```bash
cd frontend
npm run dev
```

Frontend berjalan di `http://localhost:5173`.
Backend berjalan di `http://localhost:3000`.

## Route Frontend

```txt
/          Home
/todo      Todo List
/notes     Notes dengan pagination
/threads   Threads dengan infinite scroll dan reaction emoji
```

## Struktur

```txt
frontend/src/features/todos
frontend/src/features/notes
frontend/src/features/threads
frontend/src/routes
frontend/src/shared

backend/src/features/todos
backend/src/features/notes
backend/src/features/threads
backend/src/db/schema
backend/src/shared
```

## API

```txt
GET    /todos
POST   /todos
PATCH  /todos/:id
DELETE /todos/:id

GET    /notes?page=1&limit=5
POST   /notes

GET    /threads?cursor=1&limit=5
POST   /threads
POST   /threads/:id/reactions
```
