import { useEffect, useRef, useState } from "react";
import { CommunitySelectScreen } from "./CommunitySelectCard";

type Slug = "impala-rfc" | "soul-sisters";

type Props = {
  onComplete: (data: { phone: string; profileType: string; communitySlug: Slug }) => void;
  trackEvent?: (eventName: string, metadata?: Record<string, unknown>) => void;
};

const PROFILE_OPTIONS: Record<Slug, { value: string; label: string }[]> = {
  "impala-rfc": [
    { value: "fan", label: "Fan" },
    { value: "player", label: "Player" },
    { value: "vet", label: "Impala Vet" },
  ],
  "soul-sisters": [
    { value: "sister", label: "Member" },
    { value: "supporter", label: "Supporter" },
  ],
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
  const [step, setStep] = useState(0);
  const [slug, setSlug] = useState<Slug | null>(null);
  const [phoneRaw, setPhoneRaw] = useState("");
  const [phoneE164, setPhoneE164] = useState("");
  const [phoneErr, setPhoneErr] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [pin, setPin] = useState(["", "", "", ""]);
  const [pinConfirm, setPinConfirm] = useState(["", "", "", ""]);
  const [pinErr, setPinErr] = useState("");
  const [profileType, setProfileType] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    trackEvent?.("selection_started", { timestamp: Date.now() });
  }, [trackEvent]);

  const accent = slug === "soul-sisters" ? "#6C3483" : "#D41E28";

  const pickCommunity = (s: Slug) => {
    setSlug(s);
    trackEvent?.("selection_confirmed", { communitySlug: s, timestamp: Date.now() });
    setStep(1);
  };

  const submitPhone = () => {
    const e = normalizePhone(phoneRaw);
    if (!e) {
      setPhoneErr("Enter a valid Kenyan number (+2547… or +2541…)");
      return;
    }
    setPhoneE164(e);
    setPhoneErr("");
    setStep(2);
  };
  const submitOtp = () => {
    if (otp.some((d) => !/^\d$/.test(d))) return;
    setStep(3);
  };
  const submitPin = () => {
    if (pin.join("") !== pinConfirm.join("") || pin.join("").length !== 4) {
      setPinErr("PINs don't match.");
      return;
    }
    setPinErr("");
    setStep(4);
  };
  const finish = async () => {
    if (!slug || !profileType) return;
    setSubmitting(true);
    trackEvent?.("onboarding_completed", {
      communitySlug: slug,
      profileType,
      timestamp: Date.now(),
    });
    await onComplete({ phone: phoneE164, profileType, communitySlug: slug });
    setSubmitting(false);
  };

  const slideStyle: React.CSSProperties = {
    transition: "transform 220ms ease-in-out, opacity 220ms ease-in-out",
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8" style={slideStyle}>
      <div className="mx-auto max-w-md">
        {step > 0 && (
          <div
            className="rounded-2xl px-5 py-4 mb-6 text-white shadow"
            style={{ backgroundColor: accent }}
          >
            <p className="text-[11px] uppercase tracking-wider opacity-80">
              Step {step} of 4
            </p>
            <h1 className="text-xl font-semibold mt-0.5">
              {step === 1 && "Your phone number"}
              {step === 2 && "Enter the 6-digit code"}
              {step === 3 && "Create a 4-digit PIN"}
              {step === 4 && "Tell us who you are"}
            </h1>
          </div>
        )}

        {step === 0 && (
          <>
            <header className="mb-6 text-center">
              <h1 className="text-3xl font-black text-[#0F172A]">AddVal</h1>
              <p className="text-sm text-gray-500 mt-1">
                Pick the community you want to back.
              </p>
            </header>
            <CommunitySelectScreen onSelect={pickCommunity} />
          </>
        )}

        {step === 1 && (
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

        {step === 2 && (
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

        {step === 3 && (
          <section className="space-y-5">
            <div>
              <p className="mb-2 text-sm font-medium">PIN</p>
              <DigitGroup values={pin} onChange={setPin} length={4} mask accent={accent} />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium">Confirm PIN</p>
              <DigitGroup
                values={pinConfirm}
                onChange={setPinConfirm}
                length={4}
                mask
                accent={accent}
              />
            </div>
            {pinErr && <p className="text-sm text-[#D41E28]">{pinErr}</p>}
            <button
              onClick={submitPin}
              className="w-full rounded-xl text-white font-semibold py-3"
              style={{ backgroundColor: accent }}
            >
              Continue
            </button>
          </section>
        )}

        {step === 4 && slug && (
          <section className="space-y-5">
            <div className="flex flex-wrap gap-2">
              {PROFILE_OPTIONS[slug].map((opt) => {
                const active = profileType === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => setProfileType(opt.value)}
                    className="rounded-full border px-4 py-2 text-sm font-medium"
                    style={{
                      backgroundColor: active ? accent : "#fff",
                      color: active ? "#fff" : accent,
                      borderColor: active ? accent : "#E5E7EB",
                    }}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
            <button
              onClick={finish}
              disabled={!profileType || submitting}
              className="w-full rounded-xl text-white font-semibold py-3 disabled:opacity-50"
              style={{ backgroundColor: accent }}
            >
              {submitting ? "Creating account…" : "Finish"}
            </button>
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