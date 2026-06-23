import type { Metadata } from "next";
import { AuthForm } from "@/components/forms/auth-form";

export const metadata: Metadata = {
  title: "Demonstration Sign-In",
  description: "Simulated sign-in for the Vaskodigama demonstration build.",
};

export default function LoginPage() {
  return (
    <div className="bg-grid flex min-h-[calc(100vh-4rem)] items-center px-5 py-16">
      <AuthForm mode="login" />
    </div>
  );
}
