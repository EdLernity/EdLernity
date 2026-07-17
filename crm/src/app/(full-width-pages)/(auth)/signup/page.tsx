import SignUpForm from "@/components/auth/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign up | EdLernity CRM",
  description: "EdLernity CRM",
  // other metadata
};

export default function SignUp() {
  return <SignUpForm />;
}
