# Data Persistence and Backup Strategy

This document outlines how the database is protected against data loss and provides instructions on how to manually manage backups.

## Automated Backups
RPWeb includes an automated daily backup system. Every day at **3:00 AM**, the server automatically triggers the backup script (`scripts/backup.mjs`).
- Backups are stored locally in the `/backups` directory.
- Files are named sequentially by timestamp: `rpweb_backup_YYYY-MM-DDTHH-MM-SS.sql`
- **Retention**: The automated system maintains a 7-day rolling window. Whenever a new backup is generated, the oldest backup is automatically pruned to save storage space.

## Safety Checks
The `server.mjs` entry point performs pre-flight safety checks when booting up:
1. It validates the `/backups` folder exists.
2. It attempts a dummy connection to PostgreSQL to ensure the container is healthy and responding. If it fails, the server throws an explicit connection warning.

## Manual Commands

### Create a Manual Backup
You can trigger a manual backup snapshot at any time without shutting down the server.
```bash
npm run db:backup
```
*This command safely creates a dump of the active database inside the Docker container and saves it directly to your host machine's `/backups` folder.*

### Restore from a Backup
> [!CAUTION]
> Restoring a database overwrites the current database state. Ensure you know exactly which file you are restoring.

```bash
npm run db:restore rpweb_backup_YYYY-MM-DD.sql
```

## Danger Zone: Commands that Destroy Data

Because we use Docker Named Volumes (`pgdata:/var/lib/postgresql/data`), the database will naturally survive `docker-compose down`, `npm run dev` restarts, and OS reboots. 

However, **running any of the following commands will permanently wipe your Roleplay history:**

1. `docker-compose down -v` *(The `-v` flag destroys volumes)*
2. `npx prisma db push --force-reset` *(Hard resets the schema, dropping all data)*
3. `npx prisma migrate reset` *(Drops the entire database and recreates it)*
4. `docker volume prune` *(Destroys unused volumes—if RPWeb is stopped, this deletes `pgdata`)*

If you accidentally run one of these commands, you must immediately locate your latest backup in the `/backups` folder and run `npm run db:restore`.
