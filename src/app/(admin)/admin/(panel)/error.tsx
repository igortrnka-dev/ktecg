"use client";

import { startTransition } from "react";
import { useRouter } from "next/navigation";

/** Keeps the sidebar when a page or a server action (save, Claude step) fails. */
export default function PanelError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const router = useRouter();
  const retry = () =>
    startTransition(() => {
      router.refresh();
      reset();
    });
  return (
    <section className="card" role="alert">
      <div className="card__head"><h2>Niečo sa pokazilo</h2></div>
      <div className="card__body">
        <p>
          Akciu sa nepodarilo dokončiť. Neuložené zmeny vo formulári sa mohli stratiť. Skúste to znova; ak chyba
          pretrváva, skontrolujte pripojenia v Nastaveniach.
        </p>
        {error.digest && <p className="mono muted">Kód chyby: {error.digest}</p>}
      </div>
      <div className="card__foot">
        <button type="button" className="abtn abtn--primary" onClick={retry}>Skúsiť znova</button>
      </div>
    </section>
  );
}
