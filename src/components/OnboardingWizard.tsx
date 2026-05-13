"use client"

import { useState, useRef, useEffect } from "react"
import {
 Phone,
 ShieldCheck,
 Lock,
 User,
 ChevronRight,
 Users,
 CheckCircle,
 XCircle,
} from "lucide-react"

// ─── TYPES & INTERFACES ──────────────────────────────────────────────────────
type CommunitySlug = "impala-rfc" | "soul-sisters"

interface Theme {
 primary: string
 name: string
 tagline: string
 slug: CommunitySlug
}

export type TrackingEventName = "selection_started" | "selection_confirmed" | "onboarding_completed"

interface OnboardingWizardProps {
 onComplete: (data: {
   phone: string
   profileType: string
   communitySlug: CommunitySlug
 }) => void
 trackEvent?: (eventName: TrackingEventName, metadata?: Record<string, any>) => void
}

// ─── HIGH-GROWTH COMMERCIAL THEME PRESETS ────────────────────────────────────
const THEMES: Record<CommunitySlug, Theme> = {
 "impala-rfc": {
   primary: "#D41E28",
   name: "Impala RFC",
   tagline: "The Gazelles · Roans · Swara",
   slug: "impala-rfc",
 },
 "soul-sisters": {
   primary: "#6C3483",
   name: "Soul Sisters Nairobi",
   tagline: "Learn · Laugh · Grow",
   slug: "soul-sisters",
 },
}

// ─── STEP PROGRESS DOTS ───────────────────────────────────────────────────────
function ProgressDots({
 step,
 accentColor,
}: {
 step: number
 accentColor: string
}) {
 return (
   <div className="flex items-center justify-center gap-2 mb-8">
     {[1, 2, 3, 4].map((i) => (
       <div
         key={i}
         style={{
           width: step === i ? 24 : 8,
           height: 8,
           borderRadius: 999,
           backgroundColor: step === i ? accentColor : "#E5E7EB",
           transition: "width 200ms ease-out, background-color 200ms ease-out",
         }}
       />
     ))}
   </div>
 )
}

// ─── INPUT FIELDS / OTP / PIN HELPERS ──────────────────────────────────────────
function OTPBox({
 value,
 index,
 refs,
 values,
 setValues,
 accentColor,
 type = "text",
}: {
 value: string
 index: number
 refs: React.MutableRefObject<(HTMLInputElement | null)[]>
 values: string[]
 setValues: (v: string[]) => void
 accentColor: string
 type?: "text" | "password"
}) {
 return (
   <input
     ref={(el) => {
       refs.current[index] = el
     }}
     type={type}
     inputMode="numeric"
     maxLength={1}
     value={value}
     onChange={(e) => {
       const digit = e.target.value.replace(/\D/, "")
       const next = [...values]
       next[index] = digit
       setValues(next)
       if (digit && index < values.length - 1) {
         refs.current[index + 1]?.focus()
       }
     }}
     onKeyDown={(e) => {
       if (e.key === "Backspace" && !value && index > 0) {
         refs.current[index - 1]?.focus()
       }
     }}
     className="h-14 border-2 rounded-xl text-center text-[22px] font-bold bg-gray-50 focus:bg-white transition-colors outline-none"
     style={{
       width: 44,
       borderColor: value ? accentColor : "#E5E7EB",
       caretColor: accentColor,
     }}
     onFocus={(e) => (e.target.style.borderColor = accentColor)}
     onBlur={(e) => {
       if (!e.target.value) e.target.style.borderColor = "#E5E7EB"
     }}
   />
 )
}

function PINBox({
 value,
 index,
 refs,
 values,
 setValues,
 accentColor,
}: {
 value: string
 index: number
 refs: React.MutableRefObject<(HTMLInputElement | null)[]>
 values: string[]
 setValues: (v: string[]) => void
 accentColor: string
}) {
 return (
   <input
     ref={(el) => {
       refs.current[index] = el
     }}
     type="password"
     inputMode="numeric"
     maxLength={1}
     value={value}
     onChange={(e) => {
       const digit = e.target.value.replace(/\D/, "")
       const next = [...values]
       next[index] = digit
       setValues(next)
       if (digit && index < values.length - 1) {
         refs.current[index + 1]?.focus()
       }
     }}
     onKeyDown={(e) => {
       if (e.key === "Backspace" && !value && index > 0) {
         refs.current[index - 1]?.focus()
       }
     }}
     className="h-14 border-2 rounded-xl text-center text-[22px] font-bold bg-gray-50 focus:bg-white transition-colors outline-none"
     style={{
       width: 52,
       borderColor: value ? accentColor : "#E5E7EB",
       caretColor: accentColor,
     }}
     onFocus={(e) => (e.target.style.borderColor = accentColor)}
     onBlur={(e) => {
       if (!e.target.value) e.target.style.borderColor = "#E5E7EB"
     }}
   />
 )
}

// ─── STEP 0 — BEHAVIORAL COMMUNITY SELECT CARD ───────────────────────────────
function StepCommunitySelect({
 onSelect,
 trackEvent,
}: {
 onSelect: (slug: CommunitySlug) => void
 trackEvent?: (eventName: TrackingEventName, metadata?: Record<string, any>) => void
}) {
 const [selecting, setSelecting] = useState<CommunitySlug | null>(null)
 
 // QA FIX BUG 1A: Fire selection_started exactly once upon component mount via empty dependency array
 useEffect(() => {
   trackEvent?.("selection_started")
 }, [])

 const handleSelect = (slug: CommunitySlug) => {
   // QA FIX BUG 1B: Explicitly removed the redundant tracking event call from here
   setSelecting(slug)
   setTimeout(() => onSelect(slug), 180)
 }

 const cards = [
   {
     slug: "impala-rfc" as CommunitySlug,
     primary: "#D41E28",
     name: "Impala RFC",
     tagline: "The Gazelles · Roans · Swara",
     supporterCount: 1240,
     showStripe: true,
     ctaText: "Back the Gazelles",
   },
   {
     slug: "soul-sisters" as CommunitySlug,
     primary: "#6C3483",
     name: "Soul Sisters Nairobi",
     tagline: "Learn · Laugh · Grow",
     supporterCount: 6000,
     showStripe: false,
     ctaText: "Join the Sisterhood",
   },
 ]

 return (
   <div className="min-h-screen bg-gray-50 flex flex-col px-5 py-10">
     <div className="text-center mb-8">
       <p className="font-bold uppercase mb-3" style={{ fontSize: 11, letterSpacing: "2px", color: "#9CA3AF" }}>
         Welcome to AddVal
       </p>
       <h1 className="font-black text-[#0F172A] leading-tight tracking-tight" style={{ fontSize: 26 }}>
         Which team are you backing?
       </h1>
       <p className="text-gray-400 mt-2" style={{ fontSize: 14 }}>
         Your everyday top-ups will go further.
       </p>
     </div>

     <div className="flex flex-col gap-4">
       {cards.map((card) => {
         const isSelected = selecting === card.slug
         return (
           <div
             key={card.slug}
             onClick={() => handleSelect(card.slug)}
             className="w-full rounded-2xl overflow-hidden cursor-pointer transition-all duration-150 active:scale-[0.98]"
             style={{
               border: `2px solid ${isSelected ? card.primary : "transparent"}`,
               transform: isSelected ? "scale(1.01)" : "scale(1)",
               boxShadow: isSelected ? "0 8px 25px rgba(0,0,0,0.15)" : "0 2px 8px rgba(0,0,0,0.06)",
             }}
           >
             {card.showStripe && (
               <div
                 style={{
                   height: 3,
                   width: "100%",
                   background: "repeating-linear-gradient(90deg, #D41E28 0px, #D41E28 4px, #fff 4px, #fff 12px)",
                 }}
               />
             )}
             <div className="p-6 text-white" style={{ backgroundColor: card.primary }}>
               <p className="font-bold tracking-tight" style={{ fontSize: 21 }}>
                 {card.name}
               </p>
               <p className="font-medium" style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>
                 {card.tagline}
               </p>
               <div className="flex items-center gap-2" style={{ marginTop: 16 }}>
                 <Users size={13} style={{ opacity: 0.8 }} />
                 <span style={{ fontSize: 12, opacity: 0.8 }}>
                   {card.supporterCount.toLocaleString()} supporters
                 </span>
               </div>
               <button
                 className="mt-5 w-full py-3 rounded-xl bg-white font-semibold flex items-center justify-center gap-1.5"
                 style={{ fontSize: 14, color: card.primary }}
                 onClick={(e) => {
                   e.stopPropagation()
                   handleSelect(card.slug)
                 }}
               >
                 {card.ctaText}
                 <ChevronRight size={14} />
               </button>
             </div>
           </div>
         )
       })}
     </div>
   </div>
 )
}

// ─── STEP 1 — SAFARICOM MNO PHONE COLLECTION ──────────────────────────────────
function StepPhone({
 accentColor,
 phone,
 setPhone,
 onNext,
}: {
 accentColor: string
 phone: string
 setPhone: (v: string) => void
 onNext: () => void
}) {
 const isValid = /^\+2547\d{8}$|^\+2541\d{8}$/.test(phone)
 return (
   <div className="min-h-screen bg-white px-6 pt-10 pb-6 flex flex-col">
     <ProgressDots step={1} accentColor={accentColor} />
     <div className="flex flex-col items-center mb-8">
       <Phone size={28} style={{ color: accentColor }} className="mb-4" />
       <h2 className="font-bold text-[#0F172A] text-[22px]">Your number</h2>
       <p className="text-gray-400 mt-1" style={{ fontSize: 14 }}>
         We&apos;ll send a one-time code.
       </p>
     </div>
     {/* LOCAL OVERRIDE: Adjust inner form input padding here */}
     <input
       type="tel"
       value={phone}
       onChange={(e) => setPhone(e.target.value)}
       placeholder="+254 7XX XXX XXX"
       className="w-full border-2 rounded-2xl p-4 text-[18px] outline-none transition-colors"
       style={{
         borderColor: phone ? accentColor : "#E5E7EB",
       }}
       onFocus={(e) => (e.target.style.borderColor = accentColor)}
       onBlur={(e) => {
         if (!phone) e.target.style.borderColor = "#E5E7EB"
       }}
     />
     <button
       className="mt-6 w-full py-3.5 rounded-2xl font-bold text-[15px] text-white transition-opacity"
       style={{
         backgroundColor: accentColor,
         opacity: isValid ? 1 : 0.4,
       }}
       disabled={!isValid}
       onClick={onNext} // QA FIX BUG 2B: Argument string cleanly scrubbed out of onNext call parameter
     >
       Send code →
     </button>
   </div>
 )
}

// ─── STEP 2 — TRUST-FIRST OTP CONFIRMATION SCREEN ─────────────────────────────
function StepOTP({
 accentColor,
 phone,
 otp,
 setOtp,
 onNext,
}: {
 accentColor: string
 phone: string
 otp: string[]
 setOtp: (v: string[]) => void
 onNext: () => void
}) {
 const refs = useRef<(HTMLInputElement | null)[]>([])
 useEffect(() => {
   if (otp.every((d) => d !== "") && otp.length === 6) {
     setTimeout(onNext, 80)
   }
 }, [otp, onNext])
 return (
   <div className="min-h-screen bg-white px-6 pt-10 flex flex-col">
     <ProgressDots step={2} accentColor={accentColor} />
     <div className="flex flex-col items-center mb-8">
       <ShieldCheck size={28} style={{ color: accentColor }} className="mb-4" />
       <h2 className="font-bold text-[#0F172A] text-[22px]">Enter your code</h2>
       <p className="text-gray-400 mt-1" style={{ fontSize: 13 }}>
         Sent to {phone}
       </p>
     </div>
     <div className="flex gap-2 justify-center">
       {otp.map((val, i) => (
         <OTPBox
           key={i}
           value={val}
           index={i}
           refs={refs}
           values={otp}
           setValues={setOtp}
           accentColor={accentColor}
         />
       ))}
     </div>
     <div className="mt-6 text-center" style={{ fontSize: 13 }}>
       <span className="text-gray-400">Didn&apos;t receive it? </span>
       <button
         className="font-semibold"
         style={{ color: accentColor }}
         onClick={() => setOtp(Array(6).fill(""))}
       >
         Resend code
       </button>
     </div>
   </div>
 )
}

// ─── STEP 3 — TRANSACTION AUTH SECURE PIN ACCESS ──────────────────────────────
function StepPIN({
 accentColor,
 pin,
 setPin,
 confirmPin,
 setConfirmPin,
 onNext,
}: {
 accentColor: string
 pin: string[]
 setPin: (v: string[]) => void
 confirmPin: string[]
 setConfirmPin: (v: string[]) => void
 onNext: () => void
}) {
 const pinRefs = useRef<(HTMLInputElement | null)[]>([])
 const confirmRefs = useRef<(HTMLInputElement | null)[]>([])
 const pinFilled = pin.every((d) => d !== "")
 const confirmFilled = confirmPin.every((d) => d !== "")
 const pinsMatch = pinFilled && confirmFilled && pin.join("") === confirmPin.join("")
 const pinsMismatch = pinFilled && confirmFilled && pin.join("") !== confirmPin.join("")
 return (
   <div className="min-h-screen bg-white px-6 pt-10 pb-6 flex flex-col">
     <ProgressDots step={3} accentColor={accentColor} />
     <div className="flex flex-col items-center mb-8">
       <Lock size={28} style={{ color: accentColor }} className="mb-4" />
       <h2 className="font-bold text-[#0F172A] text-[22px]">Set your PIN</h2>
       <p className="text-gray-400 mt-1" style={{ fontSize: 14 }}>
         4 digits to confirm every top-up.
       </p>
     </div>
     <p className="font-semibold text-gray-500 uppercase mb-3" style={{ fontSize: 12, letterSpacing: "1px" }}>
       Create PIN
     </p>
     <div className="flex gap-3 justify-center">
       {pin.map((val, i) => (
         <PINBox key={i} value={val} index={i} refs={pinRefs} values={pin} setValues={setPin} accentColor={accentColor} />
       ))}
     </div>
     <p className="font-semibold text-gray-500 uppercase mb-3 mt-6" style={{ fontSize: 12, letterSpacing: "1px" }}>
       Confirm PIN
     </p>
     <div className="flex gap-3 justify-center">
       {confirmPin.map((val, i) => (
         <PINBox
           key={i}
           value={val}
           index={i}
           refs={confirmRefs}
           values={confirmPin}
           setValues={setConfirmPin}
           accentColor={accentColor}
         />
       ))}
     </div>
     {(pinsMatch || pinsMismatch) && (
       <div className="mt-3 flex items-center gap-1" style={{ fontSize: 12 }}>
         {pinsMatch ? (
           <>
             <CheckCircle size={14} color="#10B981" />
             <span className="font-semibold" style={{ color: "#10B981" }}>
               PINs match
             </span>
           </>
         ) : (
           <>
             <XCircle size={14} color="#D41E28" />
             <span className="font-semibold" style={{ color: "#D41E28" }}>
               PINs do not match
             </span>
           </>
         )}
       </div>
     )}
     <button
       className="mt-8 w-full py-4 rounded-2xl font-bold text-[15px] text-white transition-opacity"
       style={{
         backgroundColor: accentColor,
         opacity: pinsMatch ? 1 : 0.4,
       }}
       disabled={!pinsMatch}
       onClick={onNext}
     >
       Set PIN →
     </button>
   </div>
 )
}

// ─── STEP 4 — DEMOGRAPHIC SUB-COMMUNITY SELECTOR ─────────────────────────────
function StepProfile({
 accentColor,
 selectedSlug,
 profileType,
 setProfileType,
 onComplete,
}: {
 accentColor: string
 selectedSlug: CommunitySlug
 profileType: string | null
 setProfileType: (v: string) => void
 onComplete: () => void
}) {
 const pills =
   selectedSlug === "impala-rfc"
     ? [
         { emoji: "🏉", label: "Fan / Gazelle Supporter", value: "fan" },
         { emoji: "🏃‍♀️", label: "Impala Roan (Women's Division)", value: "roan" },
         { emoji: "🏆", label: "Impala Vet (Club Alumni)", value: "vet" },
       ]
     : [
         { emoji: "✨", label: "Sisterhood Core Member", value: "sister" },
         { emoji: "🤝", label: "General Supporter", value: "supporter" },
       ]

 const subText =
   selectedSlug === "impala-rfc"
     ? "Tell us your relationship with Impala."
     : "Tell us how you know the Sisterhood."

 return (
   <div className="min-h-screen bg-white px-6 pt-10 pb-6 flex flex-col">
     <ProgressDots step={4} accentColor={accentColor} />
     <div className="flex flex-col items-center mb-8">
       <User size={28} style={{ color: accentColor }} className="mb-4" />
       <h2 className="font-bold text-[#0F172A] text-[22px]">How do you connect?</h2>
       <p className="text-gray-400 mt-1" style={{ fontSize: 14 }}>
         {subText}
       </p>
     </div>
     {/* LOCAL OVERRIDE: Tune layout grid margin here */}
     <div className="flex flex-col gap-3">
       {pills.map((pill) => {
         const isSelected = profileType === pill.value
         return (
           <button
             key={pill.value}
             onClick={() => setProfileType(pill.value)}
             className="w-full border-2 rounded-2xl py-4 px-5 flex items-center gap-3 cursor-pointer transition-all duration-150 font-semibold text-[15px]"
             style={{
               backgroundColor: isSelected ? accentColor : "#fff",
               color: isSelected ? "#fff" : "#374151",
               borderColor: isSelected ? "transparent" : "#E5E7EB",
             }}
             onMouseEnter={(e) => {
               if (!isSelected) e.currentTarget.style.borderColor = accentColor
             }}
             onMouseLeave={(e) => {
               if (!isSelected) e.currentTarget.style.borderColor = "#E5E7EB"
             }}
           >
             <span>{pill.emoji}</span>
             <span>{pill.label}</span>
           </button>
         )
       })}
     </div>
     <button
       className="mt-8 w-full py-4 rounded-2xl font-bold text-[15px] text-white transition-opacity"
       style={{
         backgroundColor: accentColor,
         opacity: profileType ? 1 : 0.4,
       }}
       disabled={!profileType}
       onClick={onComplete}
     >
       {"Let's go →"}
     </button>
   </div>
 )
}

// ─── MAIN WIZARD FRAMEWORK (UI-ONLY CONTEXTUAL SWITCHING) ────────────────────
export default function OnboardingWizard({ onComplete, trackEvent }: OnboardingWizardProps) {
 const [step, setStep] = useState<0 | 1 | 2 | 3 | 4>(0)
 const [animating, setAnimating] = useState(false)
 const [selectedSlug, setSelectedSlug] = useState<CommunitySlug | null>(null)
 const [activeTheme, setActiveTheme] = useState<Theme | null>(null)
 const [phone, setPhone] = useState("")
 const [otp, setOtp] = useState<string[]>(Array(6).fill(""))
 const [pin, setPin] = useState<string[]>(Array(4).fill(""))
 const [confirmPin, setConfirmPin] = useState<string[]>(Array(4).fill(""))
 const [profileType, setProfileType] = useState<string | null>(null)

 const accentColor = activeTheme?.primary ?? "#0F172A"

 const advance = () => {
   if (animating) return
   setAnimating(true)
   setTimeout(() => {
     setStep((s) => (s + 1) as 0 | 1 | 2 | 3 | 4)
     setAnimating(false)
   }, 220)
 }

 const handleCommunitySelect = (slug: CommunitySlug) => {
   setSelectedSlug(slug)
   setActiveTheme(THEMES[slug])
   // QA FIX BUG 2A: Relocated the selection_confirmed firing loop cleanly into the wizard theme selector handler
   trackEvent?.("selection_confirmed", { community: slug })
   advance()
 }

 const handleComplete = () => {
   if (!selectedSlug || !profileType) return
   
   // QA FIX BUG 3: Expanded data contract to inject communitySlug, profileType, and ISO timestamp parameters
   trackEvent?.("onboarding_completed", {
     communitySlug: selectedSlug,
     profileType: profileType,
     timestamp: new Date().toISOString()
   })
   
   onComplete({ phone, profileType, communitySlug: selectedSlug })
 }

 const stepContent = () => {
   if (step === 0) return <StepCommunitySelect onSelect={handleCommunitySelect} trackEvent={trackEvent} />
   if (step === 1) return <StepPhone accentColor={accentColor} phone={phone} setPhone={setPhone} onNext={advance} />
   if (step === 2) return <StepOTP accentColor={accentColor} phone={phone} otp={otp} setOtp={setOtp} onNext={advance} />
   if (step === 3) return <StepPIN accentColor={accentColor} pin={pin} setPin={setPin} confirmPin={confirmPin} setConfirmPin={setConfirmPin} onNext={advance} />
   if (step === 4) return <StepProfile accentColor={accentColor} selectedSlug={selectedSlug!} profileType={profileType} setProfileType={setProfileType} onComplete={handleComplete} />
 }

 return (
   <>
     <style>{`
       @keyframes slideIn {
         from { transform: translateX(100%); opacity: 0; }
         to { transform: translateX(0); opacity: 1; }
       }
       @keyframes slideOut {
         from { transform: translateX(0); opacity: 1; }
         to { transform: translateX(-100%); opacity: 0; }
       }
       .step-enter {
         animation: slideIn 220ms ease-in-out forwards;
       }
       .step-exit {
         animation: slideOut 220ms ease-in-out forwards;
         position: absolute;
         inset: 0;
         pointer-events: none;
       }
     `}</style>
     <div className="relative overflow-hidden" style={{ minHeight: "100vh" }}>
       <div key={step} className="step-enter">
         {stepContent()}
       </div>
     </div>
   </>
 )
}
