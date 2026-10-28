"use client";

import { useActionState } from "react";
import { signIn } from "../actions";

export default function Login() {
  const [error, action, pending] = useActionState(signIn, null);
  return (
    <main className="login">
      <form action={action} className="login__card">
        <div className="brand">KTechnology<sup>®</sup> <span>Sales</span></div>
        <label className="afield">
          <span>E-mail</span>
          <input name="email" type="email" required autoComplete="email" />
        </label>
        <label className="afield">
          <span>Heslo</span>
          <input name="password" type="password" required autoComplete="current-password" />
        </label>
        {error && <p className="error">{error}</p>}
        <button className="abtn abtn--primary" disabled={pending}>{pending ? "Prihlasujem…" : "Prihlásiť sa"}</button>
      </form>
    </main>
  );
}
