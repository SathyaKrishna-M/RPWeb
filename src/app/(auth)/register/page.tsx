"use client";

import { useActionState } from "react";
import { registerUser } from "@/server/actions/auth";
import Link from "next/link";

export default function RegisterPage() {
  const [state, action, isPending] = useActionState(registerUser, undefined);

  return (
    <div className="app-shell">
      <main className="auth-container">
        <div className="auth-card">
          <h1>Join the Story</h1>
          <p>Who are you in this universe?</p>
          
          <form action={action}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input type="text" id="username" name="username" required minLength={3} maxLength={30} />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" required />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" name="password" required minLength={6} />
            </div>

            {state?.error && (
              <div style={{ color: '#ef4444', fontSize: '0.875rem', marginBottom: '16px', textAlign: 'center' }}>
                {state.error}
              </div>
            )}

            <button type="submit" className="button" disabled={isPending}>
              {isPending ? "Creating Account..." : "Register"}
            </button>
          </form>
          
          <div className="auth-footer">
            Already have an account? <Link href="/login">Log in here</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
