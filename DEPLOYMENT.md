# Deployment Guide

This project is configured to deploy directly to **Render** using a web service and a free PostgreSQL database.

## Steps to Deploy

1. Create a GitHub repository and push your code to it.
2. Sign up for [Render](https://render.com/).
3. On your Render dashboard, click **New +** and select **Blueprint**.
4. Connect your GitHub repository.
5. Render will detect the `render.yaml` file in your repository and automatically configure:
   - A PostgreSQL database instance.
   - A Node.js Web Service running Next.js and Socket.IO.

## Environment Variables

Render will automatically inject the `DATABASE_URL` and generate a secure `NEXTAUTH_SECRET`. 

**You must manually provide the following environment variable in the Render Dashboard:**

* `NEXTAUTH_URL` - Set this to the public URL Render gives your web service (e.g., `https://rpweb-1x2y.onrender.com`).

## First Time Setup

After deployment, Prisma will not automatically push your schema unless you configure a build command. Our `render.yaml` only runs `npm install && npm run build`.

To push your database schema to the newly provisioned PostgreSQL database on Render:
1. Go to your Web Service in the Render dashboard.
2. Click on **Shell**.
3. Run the following command:
   ```bash
   npx prisma db push
   ```
4. This ensures your tables exist before users try to log in.

Your MVP is now live!
