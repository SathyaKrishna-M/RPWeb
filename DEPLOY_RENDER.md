# RP Continuation MVP - Render Deployment Guide

This guide contains the exact steps to deploy your RP Continuation platform to Render for the first time. The platform uses Next.js 15, PostgreSQL, and Socket.IO.

## 1. Prerequisites

- A GitHub, GitLab, or Bitbucket account with your code pushed to a repository.
- A free [Render](https://render.com/) account.

## 2. Render Blueprint Deployment (Recommended)

This project contains a `render.yaml` file, which fully automates the infrastructure provisioning.

1. Go to your Render Dashboard.
2. Click **New +** and select **Blueprint**.
3. Connect your Git repository.
4. Render will automatically detect the `render.yaml` file and prepare to create:
   - A Free **PostgreSQL** database (`rpweb-db`).
   - A Free **Web Service** for the Node.js application (`rpweb`).
5. Click **Apply**. 

Render will begin provisioning the database and the web service.

## 3. Environment Variables

Render handles most of the configuration automatically:
- `DATABASE_URL`: Automatically passed from the PostgreSQL instance.
- `NEXTAUTH_SECRET`: Automatically generated securely.
- `NODE_ENV`: Set to `production`.

**You must manually add one variable:**
Once your Web Service is created, Render will assign it a public URL (e.g., `https://rpweb-xxxx.onrender.com`).

1. Go to your Web Service (`rpweb`) in the Render Dashboard.
2. Click on **Environment**.
3. Add a new variable:
   - **Key**: `NEXTAUTH_URL`
   - **Value**: `https://rpweb-xxxx.onrender.com` (Replace with your exact Render URL).
4. Save the changes. This will trigger a quick redeploy.

## 4. Under the Hood (Build & Start)

For your reference, the `render.yaml` executes the following commands:

- **Build Command**: `npm install && npx prisma generate && npx prisma db push && npm run build`
  - *This ensures dependencies are installed, the Prisma client is generated, your PostgreSQL database schema is automatically created/updated, and the Next.js production bundle is compiled.*
- **Start Command**: `npm run start`
  - *This executes `NODE_ENV=production node server.mjs`, starting the custom server that binds both Next.js and Socket.IO to the `process.env.PORT` provided by Render.*

## 5. Local Development vs PostgreSQL

Your `prisma/schema.prisma` is currently configured for production:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

If you wish to do local development without installing PostgreSQL, simply change the `provider` back to `"sqlite"` and change your local `.env` `DATABASE_URL` to `"file:./dev.db"`. **Be sure to change it back to `"postgresql"` before pushing to GitHub for deployment!**
