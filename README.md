# Portfolio (Express + MongoDB)

Contents:

- `index.html` — frontend (updated with resume contents)
- `server.js` — express server serving frontend and providing API
- `resume.json` — structured resume data
- `models/Contact.js` — Mongoose model for contact messages

Setup

1. Copy `.env.example` to `.env` and set `MONGODB_URI` to your MongoDB Atlas connection string.
2. Install dependencies:

```bash
npm install
```

3. Run the server in development:

```bash
npm run dev
```

APIs

- `GET /api/resume` — returns JSON resume
- `POST /api/contact` — save contact message (requires `MONGODB_URI`)
