import SignUpForm from "@/components/auth/sign-up-form";
import { redirectIfAuthenticated } from "@/lib/admin-session";

export const dynamic = "force-dynamic";

export default async function SignUpPage() {
  await redirectIfAuthenticated();
  return <SignUpForm />;
}
