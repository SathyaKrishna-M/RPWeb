import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('Usage: npm run db:restore <filename>');
  process.exit(1);
}

const filename = args[0];
const BACKUP_DIR = path.join(process.cwd(), 'backups');
const filepath = path.join(BACKUP_DIR, filename);

if (!fs.existsSync(filepath)) {
  console.error(`[Restore] Error: File not found at ${filepath}`);
  process.exit(1);
}

const CONTAINER_NAME = 'rpweb-db-1';

console.log(`[Restore] Wiping current database schema to ensure a clean slate...`);
const wipeProcess = spawn('docker', ['exec', '-i', CONTAINER_NAME, 'psql', '-U', 'postgres', '-d', 'rpweb', '-c', 'DROP SCHEMA public CASCADE; CREATE SCHEMA public;']);

wipeProcess.on('close', (wipeCode) => {
  if (wipeCode !== 0) {
    console.error(`[Restore Error] Failed to wipe schema. Restoration aborted.`);
    process.exit(1);
  }

  console.log(`[Restore] Restoring from ${filename}...`);

  const restoreProcess = spawn('docker', [
    'exec',
    '-i',
    CONTAINER_NAME,
    'psql',
    '-U',
    'postgres',
    '-d',
    'rpweb'
  ]);

const readStream = fs.createReadStream(filepath);
readStream.pipe(restoreProcess.stdin);

restoreProcess.stderr.on('data', (data) => {
  // psql outputs lots of NOTICEs to stderr, we can optionally filter them
  const str = data.toString();
  if (str.includes('ERROR') || str.includes('FATAL')) {
    console.error(`[Restore Error]: ${str}`);
  } else {
    // console.log(`[psql]: ${str.trim()}`);
  }
});

restoreProcess.on('close', (code) => {
  if (code === 0) {
    console.log(`[Restore] Successfully restored database from ${filename}.`);
  } else {
    console.error(`[Restore] Process exited with code ${code}. Restoration may have failed.`);
  }
});
});
