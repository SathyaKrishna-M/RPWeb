import { PageShell } from "@/components/layout/page-shell";

export default function DashboardPage() {
  return (
    <PageShell
      eyebrow="Workspace"
      title="Dashboard"
      description="Recent worlds, active scenes, and character activity will gather here."
    >
      <div className="workspace-grid">
        <section className="panel stack">
          <h2>Your Turn</h2>
          <p className="muted-list" style={{ marginTop: '8px' }}>
            <li>No scenes are waiting for your reply.</li>
          </p>
        </section>

        <section className="panel stack">
          <h2>My Roster</h2>
          <p className="muted-list" style={{ marginTop: '8px' }}>
            <li>No characters created yet.</li>
          </p>
        </section>
      </div>

      <div className="workspace-grid" style={{ marginTop: '24px' }}>
        <section className="panel stack" style={{ gridColumn: '1 / -1' }}>
          <h2>Recent Activity</h2>
          <p className="muted-list" style={{ marginTop: '8px' }}>
            <li>Welcome to RPWeb! Explore the worlds directory to get started.</li>
          </p>
        </section>
      </div>
    </PageShell>
  );
}
