"use client";

import { useActionState } from "react";
import { signIn } from "../actions";

export default function LoginForm({ missing, demo }: { missing: string[]; demo: boolean }) {
  const [error, action, pending] = useActionState(signIn, null);
  const off = missing.length > 0;
  return (
    <main className="login">
      <form action={action} className="login__card">
        <div className="brand">KTechnology<sup>®</sup> <span>Sales</span></div>
        {demo && !off && (
          <p className="notice notice--demo" role="status">
            Ukážkový režim: vymyslené firmy a testovacie dáta, beží len na tomto počítači.
          </p>
        )}
        {off && (
          <p className="notice" role="status">
            Admin ešte nie je nastavený: v <code>.env.local</code> chýba {missing.map((m, i) => (
              <span key={m}>{i > 0 && ", "}<code>{m}</code></span>
            ))}. {demo ? "Doplňte heslo pre ukážkový admin." : "Doplňte kľúče zo Supabase a reštartujte server."}
          </p>
        )}
        <label className="afield">
          <span>E-mail</span>
          <input name="email" type="email" required autoComplete="email" disabled={off} />
        </label>
        <label className="afield">
          <span>Heslo</span>
          <input name="password" type="password" required autoComplete="current-password" disabled={off} />
        </label>
        {error && !off && <p className="error">{error}</p>}
        <button className="abtn abtn--primary" disabled={pending || off}>{pending ? "Prihlasujem…" : "Prihlásiť sa"}</button>
      </form>
    </main>
  );
}
