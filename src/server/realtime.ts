import type { Server } from "socket.io"

/**
 * The Socket.IO server created by `server.mjs`, which runs in this same
 * process. It is absent when the app is started without the custom server
 * (e.g. plain `next start`), in which case realtime delivery is skipped and
 * clients still catch up when they reconnect or reload.
 */
function getIO(): Server | undefined {
  return (globalThis as { __rpwebIO?: Server }).__rpwebIO
}

export function broadcastToWorld(
  worldId: string,
  event: string,
  payload: unknown,
  /** The sender's socket, which already has the message and should not get an echo. */
  exceptSocketId?: string
) {
  try {
    const io = getIO()
    if (!io) return
    const room = io.to(`world-${worldId}`)
    if (exceptSocketId) {
      room.except(exceptSocketId).emit(event, payload)
    } else {
      room.emit(event, payload)
    }
  } catch (error) {
    // A failed broadcast must never fail the write that triggered it.
    console.error("broadcastToWorld failed", error)
  }
}
