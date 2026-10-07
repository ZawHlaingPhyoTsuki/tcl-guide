import SignInForm from "@/components/auth/sign-in-form";
import { redirectIfAuthenticated } from "@/lib/admin-session";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  await redirectIfAuthenticated();
  return <SignInForm />;
}
