export async function emitToSocket(room: string, event: string, payload: any) {
  try {
    const port = process.env.PORT || 3000;
    const url = `http://localhost:${port}/api/socket/emit`;
    
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ room, event, payload }),
      // Don't wait or fail the action if the socket server is down
      // using a short timeout would be ideal but Next fetch doesn't support AbortController cleanly without extra code
    });
  } catch (error) {
    console.error("Failed to emit to socket:", error);
  }
}
