import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { signupUser } from "@/lib/signup.functions";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Get started — AddVal" },
      { name: "description", content: "Set up your AddVal account in 4 quick steps." },
    ],
  }),
  component: Onboarding,
});

type Slug = "impala-rfc" | "soul-sisters";

const PROFILE_OPTIONS: Record<Slug, { value: string; label: string }[]> = {
  "impala-rfc": [
    { value: "fan", label: "Fan" },
    { value: "player", label: "Player" },
    { value: "vet", label: "Impala Vet (Alumni)" },
  ],
  "soul-sisters": [
    { value: "sister", label: "Member" },
    { value: "supporter", label: "Supporter" },
  ],
};

function normalizePhone(input: string): string | null {
  const digits = input.replace(/\D/g, "");
  let candidate = digits;
  if (digits.startsWith("0") && digits.length === 10) candidate = "254" + digits.slice(1);
  else if (digits.startsWith("254")) candidate = digits;
  else if (digits.startsWith("7") || digits.startsWith("1")) candidate = "254" + digits;
  if (!/^254(7|1)\d{8}$/.test(candidate)) return null;
  return "+" + candidate;
}

function Onboarding() {
  const navigate = useNavigate();
  const signup = useServerFn(signupUser);

  const [step, setStep] = useState(1);
  const [slug, setSlug] = useState<Slug>("impala-rfc");
  const [phoneRaw, setPhoneRaw] = useState("");
  const [phoneE164, setPhoneE164] = useState("");
  const [phoneErr, setPhoneErr] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [pin, setPin] = useState(["", "", "", ""]);
  const [pinConfirm, setPinConfirm] = useState(["", "", "", ""]);
  const [pinErr, setPinErr] = useState("");
  const [profileType, setProfileType] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitErr, setSubmitErr] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const s = localStorage.getItem("community_slug");
    if (s === "impala-rfc" || s === "soul-sisters") setSlug(s);
    else navigate({ to: "/" });
  }, [navigate]);

  const accent = slug === "impala-rfc" ? "bg-impala text-white" : "bg-soul text-white";
  const accentText = slug === "impala-rfc" ? "text-impala" : "text-soul";
  const ring = slug === "impala-rfc" ? "focus:ring-impala" : "focus:ring-soul";

  const handlePhone = () => {
    const e164 = normalizePhone(phoneRaw);
    if (!e164) {
      setPhoneErr("Enter a valid Kenyan number (+2547… or +2541…)");
      return;
    }
    setPhoneE164(e164);
    setPhoneErr("");
    setStep(2);
  };

  const handleOtp = () => {
    if (otp.some((d) => !/^\d$/.test(d))) return;
    setStep(3);
  };

  const handlePin = () => {
    const a = pin.join("");
    const b = pinConfirm.join("");
    if (a.length !== 4 || b.length !== 4) {
      setPinErr("Enter your 4-digit PIN twice.");
      return;
    }
    if (a !== b) {
      setPinErr("PINs don't match. Try again.");
      return;
    }
    setPinErr("");
    setStep(4);
  };

  const handleFinish = async () => {
    if (!profileType) return;
    setSubmitting(true);
    setSubmitErr("");
    try {
      await signup({
        data: {
          phone: phoneE164,
          pin: pin.join(""),
          profile_type: profileType as never,
          community_slug: slug,
        },
      });
      navigate({ to: "/home" });
    } catch (e) {
      setSubmitErr(e instanceof Error ? e.message : "Sign up failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto max-w-md">
        <div className={`rounded-2xl ${accent} px-5 py-4 mb-6 shadow`}>
          <p className="text-xs uppercase tracking-wider opacity-80">Step {step} of 4</p>
          <h1 className="text-xl font-semibold">
            {step === 1 && "Your phone number"}
            {step === 2 && "Enter the 6-digit code"}
            {step === 3 && "Create a 4-digit PIN"}
            {step === 4 && "Tell us who you are"}
          </h1>
        </div>

        {step === 1 && (
          <section className="space-y-4">
            <label className="block text-sm font-medium text-foreground">
              Your phone number
            </label>
            <input
              type="tel"
              value={phoneRaw}
              onChange={(e) => setPhoneRaw(e.target.value)}
              placeholder="+254 7XX XXX XXX"
              className={`w-full rounded-xl border border-input bg-card px-4 py-3 text-lg outline-none focus:ring-2 ${ring}`}
            />
            {phoneErr && <p className="text-sm text-destructive">{phoneErr}</p>}
            <button
              onClick={handlePhone}
              className={`w-full rounded-xl ${accent} font-semibold py-3`}
            >
              Send code
            </button>
          </section>
        )}

        {step === 2 && (
          <section className="space-y-4">
            <DigitGroup values={otp} onChange={setOtp} length={6} ringClass={ring} />
            <p className="text-xs text-muted-foreground">
              Demo build — any 6 digits will work.
            </p>
            <button
              onClick={handleOtp}
              disabled={otp.some((d) => !d)}
              className={`w-full rounded-xl ${accent} font-semibold py-3 disabled:opacity-50`}
            >
              Verify
            </button>
          </section>
        )}

        {step === 3 && (
          <section className="space-y-5">
            <div>
              <p className="mb-2 text-sm font-medium">PIN</p>
              <DigitGroup values={pin} onChange={setPin} length={4} mask ringClass={ring} />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium">Confirm PIN</p>
              <DigitGroup
                values={pinConfirm}
                onChange={setPinConfirm}
                length={4}
                mask
                ringClass={ring}
              />
            </div>
            {pinErr && <p className="text-sm text-destructive">{pinErr}</p>}
            <button
              onClick={handlePin}
              className={`w-full rounded-xl ${accent} font-semibold py-3`}
            >
              Continue
            </button>
          </section>
        )}

        {step === 4 && (
          <section className="space-y-5">
            <div className="flex flex-wrap gap-2">
              {PROFILE_OPTIONS[slug].map((opt) => {
                const active = profileType === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => setProfileType(opt.value)}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                      active
                        ? `${accent} border-transparent`
                        : `bg-card ${accentText} border-input hover:bg-accent`
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
            {submitErr && <p className="text-sm text-destructive">{submitErr}</p>}
            <button
              onClick={handleFinish}
              disabled={!profileType || submitting}
              className={`w-full rounded-xl ${accent} font-semibold py-3 disabled:opacity-50`}
            >
              {submitting ? "Creating account…" : "Finish"}
            </button>
          </section>
        )}
      </div>
    </main>
  );
}

function DigitGroup({
  values,
  onChange,
  length,
  mask,
  ringClass,
}: {
  values: string[];
  onChange: (v: string[]) => void;
  length: number;
  mask?: boolean;
  ringClass: string;
}) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const set = (i: number, v: string) => {
    const d = v.replace(/\D/g, "").slice(-1);
    const next = [...values];
    next[i] = d;
    onChange(next);
    if (d && i < length - 1) refs.current[i + 1]?.focus();
  };
  const onKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !values[i] && i > 0) refs.current[i - 1]?.focus();
  };
  return (
    <div className="flex gap-2">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          type={mask ? "password" : "tel"}
          inputMode="numeric"
          maxLength={1}
          value={values[i] ?? ""}
          onChange={(e) => set(i, e.target.value)}
          onKeyDown={(e) => onKey(i, e)}
          className={`h-12 w-12 rounded-lg border border-input bg-card text-center text-xl font-semibold outline-none focus:ring-2 ${ringClass}`}
        />
      ))}
    </div>
  );
}