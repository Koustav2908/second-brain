## Frontend

```ini
frontend/
├── public/
│   └── favicon.ico
├── src/
│   ├── assets/            # Images, SVGs
│   ├── components/        # Small reusable components
│   │   ├── Navbar.tsx
│   │   ├── Button.tsx
│   │   └── Navbar.css     # Optional: Keep component-specific CSS here
│   ├── pages/             # Full pages used in React Router
│   │   ├── Home.tsx
│   │   ├── About.tsx
│   │   └── Home.css       # Optional: Page-specific styling
│   ├── animations/        # Custom hooks or motion configs (optional)
│   ├── css/
│   │   └── global.css     # Contains Tailwind imports
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css          # Or just use this for Tailwind imports
├── tailwind.config.js
├── postcss.config.js
└── vite.config.ts
```

## Backend

```ini
backend/
├── app/
│   ├── __init__.py              # App factory
│   ├── routes/
│   │   └── notes.py             # Routes for CRUD and query
│   ├── models/
│   │   └── note.py              # Optional: Note schema for validation
│   ├── services/
│   │   └── vector_store.py      # Vector DB logic (FAISS/Chroma/etc.)
│   ├── db.py                    # MongoDB connection
│   ├── config.py                # App configs
│   └── extensions.py            # CORS, other extensions
├── .env                         # Environment variables (e.g. DB URIs)
├── requirements.txt             # Pip dependencies
├── run.py                       # Main app runner
├── venv/                        # Virtual environment
└── README.md

```
