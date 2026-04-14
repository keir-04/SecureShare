# SecureShare

SecureShare is a full-stack file-sharing web application built for students and small teams. It supports secure authentication, local file uploads, expiring public share links, download tracking, audit logs, and an admin panel for moderation.

## Overview

The project uses a monorepo-like layout with a React + Vite frontend and an Express + MongoDB backend. Files are stored locally on disk, while metadata, users, share links, and audit history live in MongoDB.

## Features

- User registration, login, logout, and session persistence with JWT in HTTP-only cookies
- Role support for standard users and admins
- Secure password hashing with `bcrypt`
- File upload, rename, delete, visibility toggle, search, filter, sort, and pagination
- Public share links with expiry times and optional password protection
- Download tracking for owned and shared files
- Audit logs for login, logout, upload, rename, delete, share creation, and downloads
- Admin dashboard with user blocking, file moderation, and audit log visibility
- Rate limiting, Helmet, CORS, centralized error handling, and validation
- Responsive dark-mode-enabled UI with reusable components and toast notifications

## Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- React Router
- Axios
- React Hot Toast

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- Multer
- JWT
- bcrypt
- express-validator
- dotenv

## Folder Structure

```text
SecureShare/
  client/
    public/
    src/
      api/
      components/
      context/
      hooks/
      pages/
      utils/
  server/
    scripts/
    src/
      config/
      controllers/
      middleware/
      models/
      routes/
      utils/
      validators/
    uploads/
  README.md
  .env.example
  package.json
```

## Setup Instructions

1. Install MongoDB locally or update the connection string to a running MongoDB instance.
2. Copy environment variables:
   - Copy `server/.env.example` to `server/.env`
   - Copy `client/.env.example` to `client/.env`
3. Install dependencies:

```bash
cd SecureShare/server
npm install

cd ../client
npm install
```

4. Seed the default admin account:

```bash
cd ../server
npm run seed:admin
```

5. Start the backend:

```bash
npm run dev
```

6. Start the frontend in another terminal:

```bash
cd ../client
npm run dev
```

## Environment Variables

### Server

- `NODE_ENV`: `development` or `production`
- `PORT`: backend port, default `5000`
- `CLIENT_URL`: frontend origin for CORS
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: JWT signing secret
- `JWT_EXPIRES_IN`: token duration
- `COOKIE_NAME`: auth cookie name
- `ADMIN_EMAIL`: seed admin email
- `ADMIN_PASSWORD`: seed admin password
- `MAX_FILE_SIZE_MB`: upload file size limit

### Client

- `VITE_API_URL`: backend API base URL, default `http://localhost:5000/api`

## API Overview

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Users

- `PUT /api/users/profile`

### Files

- `GET /api/files`
- `POST /api/files/upload`
- `GET /api/files/:id/download`
- `PUT /api/files/:id`
- `DELETE /api/files/:id`

### Share Links

- `GET /api/share/mine`
- `POST /api/share/:fileId`
- `DELETE /api/share/:id`
- `GET /api/share/public/:token`
- `POST /api/share/public/:token/download`

### Admin

- `GET /api/admin/dashboard`
- `GET /api/admin/users`
- `PATCH /api/admin/users/:id/block`
- `GET /api/admin/files`
- `DELETE /api/admin/files/:id`
- `GET /api/admin/audit-logs`

### Audit Logs

- `GET /api/audit-logs/me`

## Default Admin Seed

After running `npm run seed:admin` inside `server`, the backend creates:

- Email: `admin@secureshare.local`
- Password: `Admin123!`

Change these values in `server/.env` before using the project beyond local development.

## Screenshots

- Dashboard screenshot placeholder
- Shared link page screenshot placeholder
- Admin panel screenshot placeholder
- Public download page screenshot placeholder

## Security Features

- JWT session auth stored in HTTP-only cookies
- Password hashing with bcrypt
- Protected routes and admin-only routes
- Upload type and size validation
- Sanitized file names and stored file names
- Expiring share links with optional passwords
- Rate limiting on authentication routes
- Helmet middleware and configured CORS
- Centralized API error handling
- Audit logging for sensitive actions

## Future Improvements

- Drag-and-drop uploads
- Folder support and nested organization
- Email delivery for share links
- File previews for images and PDFs
- Cloud object storage support
- Background cleanup job for expired share links
