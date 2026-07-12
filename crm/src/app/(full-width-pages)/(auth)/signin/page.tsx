import { Suspense } from "react";
import SignInForm from "@/components/auth/SignInForm";

export default function SignIn() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <SignInForm />
    </Suspense>
  );
}
