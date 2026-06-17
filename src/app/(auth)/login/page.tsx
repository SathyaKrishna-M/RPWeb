"use client";

import { useActionState } from "react";
import { loginUser } from "@/server/actions/auth";
import Link from "next/link";

export default function LoginPage() {
  const [state, action, isPending] = useActionState(loginUser, undefined);

  return (
    <div className="app-shell">
      <main className="auth-container">
        <div className="auth-card">
          <h1>Log In</h1>
          <p>Welcome back to the story.</p>
          
          <form action={action}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" required />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" name="password" required />
            </div>

            {state?.error && (
              <div style={{ color: '#ef4444', fontSize: '0.875rem', marginBottom: '16px', textAlign: 'center' }}>
                {state.error}
              </div>
            )}

            <button type="submit" className="button" disabled={isPending}>
              {isPending ? "Logging in..." : "Log In"}
            </button>
          </form>
          
          <div className="auth-footer">
            Don't have an account? <Link href="/register">Register here</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
