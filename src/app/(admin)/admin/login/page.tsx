import { missingSupabaseEnv } from "@/lib/supabase/config";
import LoginForm from "./LoginForm";

export const dynamic = "force-dynamic";

export default function Login() {
  return <LoginForm missing={missingSupabaseEnv()} />;
}
