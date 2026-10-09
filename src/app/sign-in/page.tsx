"use client";

// Sign in by emailed 6-digit code. No passwords, and no links to tap, so it works the same in a browser and inside
// the iPhone/Android apps. Crew members never sign in; they sign on the presenter's phone.
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useSession } from "@/lib/session";
import { NotConfigured } from "@/components/Guard";
import { Button, Eyebrow, Field, Notice, Shell, Title, inputClass } from "@/components/ui";

export default function SignIn() {
  const s = useSession();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"email" | "code">("email");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (s.status === "signed-in") router.replace("/");
  }, [s.status, router]);

  if (s.status === "not-configured") return <NotConfigured message={s.error} />;

  const sendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const addr = email.trim();
    if (!/^\S+@\S+\.\S+$/.test(addr)) return setError("Enter a full email address, like name@company.com.");
    setBusy(true);
    const { error } = await supabase().auth.signInWithOtp({ email: addr, options: { shouldCreateUser: true } });
    setBusy(false);
    if (error) return setError(`Couldn't send the code: ${error.message}`);
    setStep("code");
  };

  const verify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const token = code.replace(/\D/g, "");
    if (token.length !== 6) return setError("The code is 6 digits.");
    setBusy(true);
    const { error } = await supabase().auth.verifyOtp({ email: email.trim(), token, type: "email" });
    setBusy(false);
    if (error) return setError("That code didn't work. Check the latest email, or send a new code.");
    // The session listener loads the user's companies and the effect above moves on.
  };

  return (
    <Shell tabs={false}>
      <Eyebrow>Sign in</Eyebrow>
      <Title>{step === "email" ? "Get a sign-in code" : "Enter your code"}</Title>

      {step === "email" ? (
        <form onSubmit={sendCode} className="mt-5 flex flex-col gap-4" noValidate>
          <p className="text-muted">For owners, safety managers and anyone who gives talks. Team members don&apos;t need an account.</p>
          <Field label="Work email" id="email">
            <input id="email" type="email" inputMode="email" autoComplete="email" className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} />
          </Field>
          {error && <Notice tone="error">{error}</Notice>}
          <Button type="submit" disabled={busy}>{busy ? "Sending…" : "Email me a code"}</Button>
        </form>
      ) : (
        <form onSubmit={verify} className="mt-5 flex flex-col gap-4" noValidate>
          <p className="text-muted">We sent a 6-digit code to <b className="text-fg">{email.trim()}</b>.</p>
          <Field label="Code" id="code">
            <input
              id="code"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              className={`${inputClass} font-display text-3xl tracking-[0.3em] tracking-tight`}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            />
          </Field>
          {error && <Notice tone="error">{error}</Notice>}
          <Button type="submit" disabled={busy}>{busy ? "Checking…" : "Sign in"}</Button>
          <Button type="button" variant="ghost" size="sm" onClick={() => { setStep("email"); setCode(""); setError(null); }}>
            Use a different email or send a new code
          </Button>
        </form>
      )}
    </Shell>
  );
}
