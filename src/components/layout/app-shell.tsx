import Link from "next/link";
import { auth, signOut } from "@/auth";
import { db } from "@/server/db";
import { cookies } from "next/headers";
import { CharacterSwitcher } from "./character-switcher";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "🏠" },
  { href: "/worlds", label: "Worlds", icon: "🌍" },
  { href: "/scenes", label: "Scenes", icon: "📖" },
  { href: "/characters", label: "Characters", icon: "🎭" },
];

export async function AppShell({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();
  
  let myCharacters: {id: string, name: string}[] = [];
  let activeId: string | undefined;

  if (session?.user?.id) {
    myCharacters = await db.character.findMany({
      where: { ownerUserId: session.user.id, isArchived: false },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });
    const cookieStore = await cookies();
    activeId = cookieStore.get("active_character")?.value;
  }

  return (
    <div className="app-shell">
      {/* Mobile Topbar */}
      <header className="topbar" style={{ display: "none" /* To be refined with media queries if needed */ }}>
        <div className="topbar-inner">
          <Link className="brand" href="/dashboard">RPWeb</Link>
        </div>
      </header>

      <div className="main-content">
        {/* Desktop Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-logo">
            <Link href="/dashboard">RPWeb</Link>
          </div>
          <nav className="sidebar-nav" aria-label="Primary navigation" style={{ flex: 1 }}>
            {navItems.map((item) => (
              <Link href={item.href} key={item.href}>
                <span style={{ marginRight: '12px' }}>{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>

          {session?.user && (
            <CharacterSwitcher characters={myCharacters} activeId={activeId} />
          )}

          {session?.user && (
            <div className="sidebar-nav" style={{ marginTop: 'auto', borderTop: '1px solid var(--line)', paddingTop: '16px' }}>
              <div style={{ padding: '12px 16px', color: 'var(--ink)', fontSize: '0.9rem' }}>
                Signed in as <strong>{session.user.name}</strong>
              </div>
              <Link href="/settings">⚙️ Settings</Link>
              <form action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}>
                <button type="submit" style={{ width: '100%', textAlign: 'left', background: 'transparent', border: 'none', color: 'var(--muted)', cursor: 'pointer', padding: '12px 16px' }}>
                  🚪 Log Out
                </button>
              </form>
            </div>
          )}
        </aside>

        {/* Main Workspace */}
        <main className="main">{children}</main>
      </div>

      {/* Mobile Bottom Nav */}
      <style dangerouslySetInnerHTML={{__html: `
        .mobile-bottom-nav { display: none; }
        @media (max-width: 768px) {
          .mobile-bottom-nav {
            display: flex;
            position: fixed;
            bottom: 0; left: 0; right: 0;
            background: var(--surface);
            border-top: 1px solid var(--line);
            padding: 12px 0;
            justify-content: space-around;
            z-index: 50;
          }
          .mobile-bottom-nav a {
            display: flex;
            flex-direction: column;
            align-items: center;
            font-size: 0.75rem;
            color: var(--muted);
          }
          .mobile-bottom-nav a span {
            font-size: 1.25rem;
            margin-bottom: 4px;
          }
          .topbar { display: block !important; }
        }
      `}} />

      <nav className="mobile-bottom-nav">
        {navItems.map((item) => (
          <Link href={item.href} key={item.href}>
            <span>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
