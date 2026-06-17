import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (command === 'create') {
    await prisma.user.create({
      data: {
        username: 'BackupTestUser123',
        email: 'backuptest@example.com',
        passwordHash: 'dummy'
      }
    });
    console.log("✅ Created BackupTestUser123");
  } else if (command === 'verify') {
    const user = await prisma.user.findUnique({
      where: { email: 'backuptest@example.com' }
    });
    if (user) {
      console.log("✅ Verified: BackupTestUser123 exists! Restoration successful.");
    } else {
      console.error("❌ Verification failed: BackupTestUser123 is missing!");
      process.exit(1);
    }
  } else if (command === 'delete') {
    await prisma.user.deleteMany({});
    console.log("🗑️ Wiped all users (simulated data loss)");
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
