import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import { PrismaClient } from "@prisma/client";
import { getToken } from "@auth/core/jwt";

const dev = process.env.NODE_ENV !== "production";
const hostname = "0.0.0.0";
const port = parseInt(process.env.PORT || "3000", 10);

const authSecret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;
if (!authSecret) {
  console.error(
    "Missing AUTH_SECRET (or NEXTAUTH_SECRET). Sessions cannot be signed. " +
      "Generate one with: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\""
  );
  process.exit(1);
}

// A dedicated client for socket authorisation checks. Next.js keeps its own
// instance; both are small pools and the realtime path only ever does key
// lookups.
const prisma = new PrismaClient();

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

/**
 * Reads the Auth.js session cookie off the websocket handshake.
 *
 * Auth.js prefixes the cookie with `__Secure-` whenever the site is served over
 * https, and the cookie name doubles as the encryption salt, so both variants
 * have to be tried rather than guessed from NODE_ENV (a proxy may terminate
 * TLS while the app itself speaks http).
 */
async function getUserIdFromHandshake(request) {
  const req = { headers: request.headers };
  for (const secureCookie of [true, false]) {
    try {
      const token = await getToken({ req, secret: authSecret, secureCookie });
      if (token?.id) return String(token.id);
    } catch {
      // Wrong cookie name for this request; fall through and try the other.
    }
  }
  return null;
}

app.prepare().then(() => {
  const httpServer = createServer(handler);

  // No `cors` option: the client is served from this same origin, so the
  // default same-origin policy is exactly what we want. Allowing "*" would let
  // any page on the internet open an authenticated socket using the visitor's
  // cookies.
  const io = new Server(httpServer);

  // Server Actions run in this same Node process, so they can reach the socket
  // server through globalThis to broadcast messages they have just persisted.
  // Clients are never trusted to broadcast on their own behalf.
  globalThis.__rpwebIO = io;

  io.use(async (socket, nextFn) => {
    socket.data.userId = await getUserIdFromHandshake(socket.request);
    // An unauthenticated socket is allowed to connect but can never join a
    // world room, so it receives nothing.
    nextFn();
  });

  io.on("connection", (socket) => {
    socket.on("join-world", async (worldId, ack) => {
      const userId = socket.data.userId;
      if (!userId || typeof worldId !== "string") {
        if (typeof ack === "function") ack({ ok: false });
        return;
      }

      try {
        // Membership is re-checked here rather than trusted from the client:
        // joining a room is what grants the socket sight of a world's messages.
        const member = await prisma.worldMember.findUnique({
          where: { worldId_userId: { worldId, userId } },
          select: { id: true },
        });

        if (!member) {
          if (typeof ack === "function") ack({ ok: false });
          return;
        }

        socket.join(`world-${worldId}`);
        if (typeof ack === "function") ack({ ok: true });
      } catch (err) {
        console.error("join-world failed", err);
        if (typeof ack === "function") ack({ ok: false });
      }
    });

    socket.on("leave-world", (worldId) => {
      if (typeof worldId === "string") socket.leave(`world-${worldId}`);
    });
  });

  httpServer.once("error", (err) => {
    console.error(err);
    process.exit(1);
  });

  httpServer.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });

  // Render sends SIGTERM on deploy and on spin-down; close cleanly so in-flight
  // requests finish and Postgres connections are released.
  const shutdown = (signal) => async () => {
    console.log(`Received ${signal}, shutting down.`);
    io.close();
    httpServer.close(() => {
      prisma.$disconnect().finally(() => process.exit(0));
    });
    setTimeout(() => process.exit(0), 10_000).unref();
  };
  process.on("SIGTERM", shutdown("SIGTERM"));
  process.on("SIGINT", shutdown("SIGINT"));
});
