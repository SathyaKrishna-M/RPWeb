import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

const BACKUP_DIR = path.join(process.cwd(), 'backups');
const CONTAINER_NAME = 'rpweb-db-1'; // Ensure this matches docker ps

// Ensure backups dir exists
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR);
}

// Generate timestamp filename
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const filename = `rpweb_backup_${timestamp}.sql`;
const filepath = path.join(BACKUP_DIR, filename);

console.log(`[Backup] Starting backup to ${filename}...`);

// Spawn docker exec
const dumpProcess = spawn('docker', [
  'exec',
  '-i',
  CONTAINER_NAME,
  'pg_dump',
  '-U',
  'postgres',
  'rpweb'
]);

const writeStream = fs.createWriteStream(filepath);

dumpProcess.stdout.pipe(writeStream);

dumpProcess.stderr.on('data', (data) => {
  console.error(`[Backup Error]: ${data}`);
});

dumpProcess.on('close', (code) => {
  if (code === 0) {
    console.log(`[Backup] Successfully created ${filename}.`);
    pruneOldBackups();
  } else {
    console.error(`[Backup] Process exited with code ${code}.`);
    // Delete the empty/corrupt file
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }
  }
});

function pruneOldBackups() {
  const files = fs.readdirSync(BACKUP_DIR)
    .filter(f => f.endsWith('.sql'))
    .map(f => ({
      name: f,
      time: fs.statSync(path.join(BACKUP_DIR, f)).mtime.getTime()
    }))
    .sort((a, b) => b.time - a.time); // newest first

  if (files.length > 7) {
    const toDelete = files.slice(7);
    console.log(`[Backup] Pruning ${toDelete.length} old backups...`);
    toDelete.forEach(file => {
      fs.unlinkSync(path.join(BACKUP_DIR, file.name));
      console.log(`[Backup] Deleted old backup: ${file.name}`);
    });
  } else {
    console.log(`[Backup] ${files.length} backups exist. No pruning needed.`);
  }
}
