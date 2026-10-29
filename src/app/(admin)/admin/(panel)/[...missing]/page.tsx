import { notFound } from "next/navigation";

/** Any other /admin path: the admin's own 404 inside the shell (after the layout's login check). */
export default function Missing() {
  notFound();
}
