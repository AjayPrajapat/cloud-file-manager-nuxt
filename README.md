# Nuxt 3 Cloud File Manager

A fully featured Nuxt 3 + Tailwind CSS starter for a Cloud File Manager / Document Management System (DMS). The project includes authentication, file/folder CRUD, search, metadata, AI-powered automation hooks, version history, and Supabase storage integration.

## Getting started

```bash
# install dependencies
npm install

# copy environment template
cp .env.example .env

# run the development server
npm run dev
```

Populate the `.env` file with your Supabase, JWT, and OpenAI credentials. When `MOCK_MODE=true`, uploads will skip Supabase and rely on in-memory sample data.

## Seeded data

The server boots with an in-memory dataset defined in `server/data/sample-data.ts`:

- Users: `admin@example.com` / `admin123`, `jane@example.com` / `password123`
- Folder structure: Root, Finance, Marketing, Design Assets
- Sample files: PDF report, Markdown guide, JPEG asset

## Features

- ✅ JWT-based login/signup with role-based permissions
- ✅ Drag & drop multi-file uploads with Supabase storage integration
- ✅ Folder tree navigation, search & filtering
- ✅ Document previews for PDF, images, and markdown
- ✅ AI endpoint placeholders for auto-tagging, summaries, and OCR
- ✅ Toast notifications, pagination, and responsive design

## API Routes

| Route | Method | Description |
| --- | --- | --- |
| `/api/auth` | POST | Login or signup (switch with `mode` body property) |
| `/api/files` | GET/POST/DELETE | File listing, upload metadata, and bulk delete |
| `/api/folders` | GET/POST/DELETE | Manage folders (delete requires admin role) |
| `/api/tags` | GET/POST | List or create document tags |
| `/api/ai` | POST | Proxy to OpenAI for tagging, summarizing, or OCR |

## Storage & AI configuration

- **Supabase Storage**: configure `SUPABASE_URL` and `SUPABASE_KEY` to upload files to a bucket (defaults to `documents`).
- **JWT Secret**: set `JWT_SECRET` to secure authentication tokens.
- **OpenAI**: set `OPENAI_API_KEY` to enable AI metadata generation via `/api/ai`.

## Project structure

Key files:

```
components/
  DocumentPreview.vue  # PDF/image/markdown previewer with metadata side panel
  FileUpload.vue       # Drag & drop uploader with progress indicator
  FileList.vue         # Grid-based file listing + pagination
  FolderTree.vue       # Recursive folder tree sidebar
composables/
  useAuth.ts           # Pinia store for auth state
  useFiles.ts          # Pinia store for files/folders/tags
  useToast.ts          # Lightweight toast system
pages/
  login.vue            # Auth page
  dashboard.vue        # Main file manager
  folder/[id].vue      # Folder focused view
  document/[id].vue    # Document preview route
server/api/            # Nitro server routes for auth, files, folders, tags, ai
server/utils/          # Mock database + Supabase helpers
```

## Extending

- Replace the in-memory database with Prisma, MongoDB, or Postgres by swapping the helpers in `server/utils/db.ts`.
- Integrate third-party OCR or summarization providers using the `/api/ai` hook.
- Add granular permissions, sharing links, and audit logs as needed.

Enjoy building! 🚀
