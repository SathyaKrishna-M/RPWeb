import { createServer } from 'node:http';
import next from 'next';
import { Server } from 'socket.io';
import fs from 'node:fs';
import path from 'node:path';
import cron from 'node-cron';
import { PrismaClient } from '@prisma/client';
import { spawn } from 'node:child_process';

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || '0.0.0.0';
const port = process.env.PORT || 3000;

// ==============================
// Safety Checks & Startup Hooks
// ==============================
const BACKUP_DIR = path.join(process.cwd(), 'backups');
if (!fs.existsSync(BACKUP_DIR)) {
  console.warn("⚠️ Backups directory is missing. Creating one now.");
  fs.mkdirSync(BACKUP_DIR);
}

const prisma = new PrismaClient();
prisma.$connect()
  .then(() => console.log("✅ Database connection verified."))
  .catch((e) => {
    console.error("❌ Database connection failed. Please check if PostgreSQL is running.");
    console.error("If using Docker, run: docker-compose up -d");
  });

// Schedule Automatic Daily Backups (3:00 AM)
cron.schedule('0 3 * * *', () => {
  console.log("🕒 Running scheduled daily backup...");
  const child = spawn('node', ['scripts/backup.mjs'], { stdio: 'inherit' });
  child.on('close', (code) => {
    if (code !== 0) console.error("❌ Scheduled backup failed.");
  });
});

// Initialize Next.js
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(async (req, res) => {
    try {
      // Render Health Check
      if (req.url === '/api/health') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('OK');
        return;
      }

      // Intercept internal emit calls from Server Actions
      if (req.method === 'POST' && req.url === '/api/socket/emit') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
          try {
            const data = JSON.parse(body);
            if (data.room && data.event) {
              io.to(data.room).emit(data.event, data.payload);
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true }));
          } catch (err) {
            console.error('Emit parse error:', err);
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid payload' }));
          }
        });
        return;
      }
      
      // Let Next.js handle all other requests
      await handler(req, res);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('Internal server error');
    }
  });

  const io = new Server(httpServer, {
    cors: { origin: '*' }
  });

  io.on('connection', (socket) => {
    socket.on('join_scene', (sceneId) => {
      socket.join(`scene:${sceneId}`);
    });

    socket.on('leave_scene', (sceneId) => {
      socket.leave(`scene:${sceneId}`);
    });
  });

  httpServer.once('error', (err) => {
    console.error(err);
    process.exit(1);
  });

  httpServer.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
