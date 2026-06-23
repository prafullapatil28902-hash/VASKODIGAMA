import type { Metadata } from "next";
import { AuthForm } from "@/components/forms/auth-form";

export const metadata: Metadata = {
  title: "Create Demonstration Account",
  description: "Simulated account creation for the Vaskodigama demonstration build.",
};

export default function SignupPage() {
  return (
    <div className="bg-grid flex min-h-[calc(100vh-4rem)] items-center px-5 py-16">
      <AuthForm mode="signup" />
    </div>
  );
}
