import { missingSupabaseEnv } from "@/lib/supabase/config";
import { isDemo } from "@/lib/demo/mode";
import LoginForm from "./LoginForm";

export const dynamic = "force-dynamic";

export default function Login() {
  const demo = isDemo();
  const missing = demo ? (process.env.DEMO_ADMIN_PASSWORD ? [] : ["DEMO_ADMIN_PASSWORD"]) : missingSupabaseEnv();
  return <LoginForm missing={missing} demo={demo} />;
}
