import { useEffect, useRef, useState } from "react";
import { CommunitySelectScreen } from "./CommunitySelectCard";

type Slug = "impala-rugby" | "soul-sisters";

type Props = {
  onComplete: (data: { phone: string; profileType: string; communitySlug: Slug }) => void;
  trackEvent?: (eventName: string, metadata?: Record<string, unknown>) => void;
};

function normalizePhone(input: string): string | null {
  const digits = input.replace(/\D/g, "");
  let c = digits;
  if (digits.startsWith("0") && digits.length === 10) c = "254" + digits.slice(1);
  else if (digits.startsWith("254")) c = digits;
  else if (digits.startsWith("7") || digits.startsWith("1")) c = "254" + digits;
  if (!/^254(7|1)\d{8}$/.test(c)) return null;
  return "+" + c;
}

export default function OnboardingWizard({ onComplete, trackEvent }: Props) {
  // 4-step flow (0-indexed):
  // 0 = Phone, 1 = OTP, 2 = Community Select, 3 = Completion handoff
  const [step, setStep] = useState(0);
  const [slug, setSlug] = useState<Slug | null>(null);
  const [phoneRaw, setPhoneRaw] = useState("");
  const [phoneE164, setPhoneE164] = useState("");
  const [phoneErr, setPhoneErr] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [submitting, setSubmitting] = useState(false);
  const firedComplete = useRef(false);

  // selection_started → fires when the phone screen mounts (entry into onboarding).
  useEffect(() => {
    trackEvent?.("selection_started", { timestamp: Date.now() });
  }, [trackEvent]);

  const accent = slug === "soul-sisters" ? "#6C3483" : "#D41E28";

  const submitPhone = () => {
    const e = normalizePhone(phoneRaw);
    if (!e) {
      setPhoneErr("Enter a valid Kenyan number (+2547… or +2541…)");
      return;
    }
    setPhoneE164(e);
    setPhoneErr("");
    setStep(1);
  };

  const submitOtp = () => {
    if (otp.some((d) => !/^\d$/.test(d))) return;
    setStep(2);
  };

  const pickCommunity = (s: Slug) => {
    setSlug(s);
    trackEvent?.("selection_confirmed", { communitySlug: s, timestamp: Date.now() });
    setStep(3);
  };

  // Step 3: completion handoff — fires onComplete exactly once with profileType:'general'.
  useEffect(() => {
    if (step !== 3 || !slug || firedComplete.current) return;
    firedComplete.current = true;
    setSubmitting(true);
    trackEvent?.("onboarding_completed", {
      communitySlug: slug,
      profileType: "general",
      timestamp: Date.now(),
    });
    Promise.resolve(
      onComplete({ phone: phoneE164, profileType: "general", communitySlug: slug }),
    ).finally(() => setSubmitting(false));
  }, [step, slug, phoneE164, onComplete, trackEvent]);

  const slideStyle: React.CSSProperties = {
    transition: "transform 220ms ease-in-out, opacity 220ms ease-in-out",
  };

  // Progress dots — 3 active stages (Phone, OTP, Community). Step 3 is the handoff.
  const stageIndex = Math.min(step, 2);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8" style={slideStyle}>
      <div className="mx-auto max-w-md">
        {step < 3 && (
          <div
            className="rounded-2xl px-5 py-4 mb-6 text-white shadow"
            style={{ backgroundColor: accent }}
          >
            <p className="text-[11px] uppercase tracking-wider opacity-80">
              Step {stageIndex + 1} of 3
            </p>
            <h1 className="text-xl font-semibold mt-0.5">
              {step === 0 && "Your phone number"}
              {step === 1 && "Enter the 6-digit code"}
              {step === 2 && "Pick the community you back"}
            </h1>
            <div className="mt-3 flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="h-1.5 flex-1 rounded-full"
                  style={{
                    backgroundColor:
                      i <= stageIndex ? "#fff" : "rgba(255,255,255,0.3)",
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {step === 0 && (
          <section className="space-y-4">
            <input
              type="tel"
              value={phoneRaw}
              onChange={(e) => setPhoneRaw(e.target.value)}
              placeholder="+254 7XX XXX XXX"
              className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-lg outline-none"
              style={{ borderColor: phoneErr ? "#D41E28" : undefined }}
            />
            {phoneErr && <p className="text-sm text-[#D41E28]">{phoneErr}</p>}
            <button
              onClick={submitPhone}
              className="w-full rounded-xl text-white font-semibold py-3"
              style={{ backgroundColor: accent }}
            >
              Send code
            </button>
          </section>
        )}

        {step === 1 && (
          <section className="space-y-4">
            <DigitGroup values={otp} onChange={setOtp} length={6} accent={accent} />
            <p className="text-xs text-gray-500">Demo build — any 6 digits work.</p>
            <button
              onClick={submitOtp}
              disabled={otp.some((d) => !d)}
              className="w-full rounded-xl text-white font-semibold py-3 disabled:opacity-50"
              style={{ backgroundColor: accent }}
            >
              Verify
            </button>
          </section>
        )}

        {step === 2 && (
          <section>
            <CommunitySelectScreen onSelect={pickCommunity} />
          </section>
        )}

        {step === 3 && (
          <section className="text-center py-16">
            <div
              className="mx-auto w-12 h-12 rounded-full border-4 border-gray-200 border-t-transparent animate-spin"
              style={{ borderTopColor: accent }}
            />
            <p className="mt-5 text-sm text-gray-600">
              {submitting ? "Creating your account…" : "Welcome aboard."}
            </p>
          </section>
        )}
      </div>
    </div>
  );
}

function DigitGroup({
  values,
  onChange,
  length,
  mask,
  accent,
}: {
  values: string[];
  onChange: (v: string[]) => void;
  length: number;
  mask?: boolean;
  accent: string;
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
          className="h-12 w-12 rounded-lg border-2 border-gray-200 bg-white text-center text-xl font-semibold outline-none"
          style={{ borderColor: values[i] ? accent : undefined }}
        />
      ))}
    </div>
  );
}
