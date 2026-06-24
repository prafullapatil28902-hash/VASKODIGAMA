"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { ArrowRight, Loader2 } from "lucide-react";
import { CoordinateMark } from "@/components/brand/logo";
import { Badge } from "@/components/ui/badge";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
const signupSchema = loginSchema.extend({
  name: z.string().min(2, "Please enter your name"),
});

type Errors = Record<string, string>;

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const [errors, setErrors] = useState<Errors>({});
  const [pending, setPending] = useState(false);

  const isSignup = mode === "signup";
  const schema = isSignup ? signupSchema : loginSchema;

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd) as Record<string, string>;
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      const errs: Errors = {};
      for (const issue of parsed.error.issues) errs[String(issue.path[0])] = issue.message;
      setErrors(errs);
      return;
    }
    setErrors({});
    setPending(true);
    // Simulate a session / account creation. No real auth, no password stored.
    try {
      sessionStorage.setItem("vkd.session", JSON.stringify({ email: data.email, at: Date.now() }));
    } catch { /* ignore */ }
    setTimeout(() => router.push("/dashboard"), 700);
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-6 flex flex-col items-center text-center">
        <CoordinateMark className="h-11 w-11" />
        <h1 className="mt-4 text-2xl font-semibold tracking-tight text-ink">
          {isSignup ? "Create Demonstration Account" : "Demonstration Sign-In"}
        </h1>
        <p className="mt-1.5 text-[14px] text-muted">
          {isSignup
            ? "No real account is created and no password is stored."
            : "No real authentication — this simulates a session for the demo."}
        </p>
        <div className="mt-3"><Badge tone="account" /></div>
      </div>

      <form onSubmit={onSubmit} noValidate className="panel space-y-4 p-6">
        {isSignup && (
          <Field label="Name" name="name" placeholder="Your full name" error={errors.name} />
        )}
        <Field label="Email" name="email" type="email" placeholder="you@company.com" error={errors.email} />
        <Field label="Password" name="password" type="password" placeholder="••••••••" error={errors.password} />

        <button type="submit" disabled={pending}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-signal text-[14px] font-semibold text-on-signal transition-colors hover:bg-signal-bright disabled:opacity-70">
          {pending ? <><Loader2 size={16} className="animate-spin" /> Simulating…</> : <>{isSignup ? "Create Account" : "Sign In"} <ArrowRight size={16} /></>}
        </button>

        <p className="text-center text-[13px] text-muted">
          {isSignup ? (
            <>Already exploring? <Link href="/login" className="text-signal hover:underline">Sign in</Link></>
          ) : (
            <>New here? <Link href="/signup" className="text-signal hover:underline">Create a demo account</Link></>
          )}
        </p>
      </form>

      <p className="mono mt-4 text-center text-[11px] text-dim">
        Credentials are never sent to a server in this demonstration build.
      </p>
    </div>
  );
}

function Field({ label, name, type = "text", placeholder, error }: { label: string; name: string; type?: string; placeholder?: string; error?: string }) {
  return (
    <div>
      <label className="mb-1.5 block text-[12px] font-medium text-ink-soft">{label}</label>
      <input name={name} type={type} placeholder={placeholder}
        className="h-10 w-full rounded-lg border border-line bg-void/50 px-3 text-[14px] text-ink placeholder:text-dim focus:border-signal/50 focus:outline-none" />
      {error && <p className="mt-1 text-[12px] text-down">{error}</p>}
    </div>
  );
}
