import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function LandingPage() {
  const session = await auth();
  
  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-inner" style={{ justifyContent: 'center' }}>
          <div className="brand" style={{ fontSize: '1.5rem', fontFamily: '"Playfair Display", serif' }}>
            RPWeb
          </div>
        </div>
      </header>
      
      <main className="main" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <section className="hero">
          <h1>Enter the World in Progress</h1>
          <p>
            A story-first roleplay platform designed for immersion, character-driven narrative, 
            and collaborative worldbuilding. Escape the clutter and join the story.
          </p>
          <div className="hero-buttons">
            <Link href="/register" className="button">
              Join the Story
            </Link>
            <Link href="/login" className="button secondary">
              Log In
            </Link>
          </div>
        </section>

        <section className="workspace-grid" style={{ marginTop: '20px' }}>
          <div className="panel stack">
            <h2>Immersive Worlds</h2>
            <p className="muted-list">Discover deep lore, rich timelines, and active casts of characters waiting for your addition.</p>
          </div>
          <div className="panel stack">
            <h2>Character Driven</h2>
            <p className="muted-list">Maintain multiple personas with distinct avatars, traits, and intricate relationships.</p>
          </div>
          <div className="panel stack">
            <h2>Focused Scenes</h2>
            <p className="muted-list">Write without distractions. A clean interface tailored specifically for collaborative storytelling.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
