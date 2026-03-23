"use client";

import { useState } from "react";
import { US_STATES, FACILITY_TYPES } from "../_lib/constants";

type VerifyMethod = "EMAIL" | "TEXT" | "PHONE";

const VERIFY_METHODS: VerifyMethod[] = ["EMAIL", "TEXT", "PHONE"];
const VERIFY_LABELS: Record<VerifyMethod, string> = {
  EMAIL: "Email",
  TEXT: "Text Message",
  PHONE: "Phone Call",
};

const INPUT_CLASS =
  "w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-700 outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 placeholder:text-slate-400";

interface ProviderVerifyModalProps {
  onCancel: () => void;
  onConfirm: (businessName: string, businessType: string, state: string) => void;
}

export function ProviderVerifyModal({ onCancel, onConfirm }: ProviderVerifyModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [state, setState] = useState("");
  const [facilityName, setFacilityName] = useState("");
  const [businessType, setBusinessType] = useState("Assisted Living");
  const [verifyMethod, setVerifyMethod] = useState<VerifyMethod>("EMAIL");
  const [contactValue, setContactValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
      return;
    }
    onConfirm(facilityName, businessType, state);
  };

  const contactLabel =
    verifyMethod === "EMAIL" ? "Your License's Email Address" : "Your License's Phone Number";
  const contactHint =
    verifyMethod === "EMAIL"
      ? "Please enter the email on file that looks like m***********l@g***l.com"
      : "Please enter the phone number on file with your state's licensing system";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal
      aria-labelledby="verify-modal-title"
    >
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 pb-4 pt-6">
          <h2 id="verify-modal-title" className="text-lg font-bold text-slate-900">
            Verify Ownership
          </h2>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          {step === 1 ? (
            <Step1
              state={state}
              onStateChange={setState}
              facilityName={facilityName}
              onFacilityNameChange={setFacilityName}
              businessType={businessType}
              onBusinessTypeChange={setBusinessType}
            />
          ) : (
            <Step2
              facilityName={facilityName}
              state={state}
              verifyMethod={verifyMethod}
              onVerifyMethodChange={setVerifyMethod}
              contactValue={contactValue}
              onContactValueChange={setContactValue}
              contactLabel={contactLabel}
              contactHint={contactHint}
            />
          )}

          <div className="flex items-center justify-between pt-2">
            {step === 2 && (
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-700"
              >
                ← Back
              </button>
            )}
            <button
              type="submit"
              className={[
                step === 1 ? "w-full" : "ml-auto",
                "rounded-xl bg-teal-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-teal-700",
              ].join(" ")}
            >
              {step === 1 ? "Continue" : "Submit for Verification"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface Step1Props {
  state: string;
  onStateChange: (v: string) => void;
  facilityName: string;
  onFacilityNameChange: (v: string) => void;
  businessType: string;
  onBusinessTypeChange: (v: string) => void;
}

function Step1({
  state,
  onStateChange,
  facilityName,
  onFacilityNameChange,
  businessType,
  onBusinessTypeChange,
}: Step1Props) {
  return (
    <>
      <p className="text-sm leading-relaxed text-slate-600">
        Select your state and enter your facility name and we&apos;ll send you a text message or
        email via the method on file with your state&apos;s licensing system.
      </p>
      <p className="text-sm text-slate-600">
        Once you&apos;re verified, you can create and manage listings for your facilities!
      </p>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-900">
          State Where You&apos;re Licensed
        </label>
        <select
          value={state}
          onChange={(e) => onStateChange(e.target.value)}
          required
          className={INPUT_CLASS}
        >
          <option value="">Select a state…</option>
          {US_STATES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-900">
          Your Facility&apos;s Name
        </label>
        <input
          type="text"
          value={facilityName}
          onChange={(e) => onFacilityNameChange(e.target.value)}
          required
          placeholder="e.g. Sunrise Senior Living"
          className={INPUT_CLASS}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-900">Facility Type</label>
        <select
          value={businessType}
          onChange={(e) => onBusinessTypeChange(e.target.value)}
          className={INPUT_CLASS}
        >
          {FACILITY_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {state && facilityName && (
        <div className="rounded-xl border border-teal-200 bg-teal-50 p-4 text-sm text-teal-800">
          ✅ Great! We found your license. Please select which method of verification you prefer.
        </div>
      )}
    </>
  );
}

interface Step2Props {
  facilityName: string;
  state: string;
  verifyMethod: VerifyMethod;
  onVerifyMethodChange: (m: VerifyMethod) => void;
  contactValue: string;
  onContactValueChange: (v: string) => void;
  contactLabel: string;
  contactHint: string;
}

function Step2({
  facilityName,
  state,
  verifyMethod,
  onVerifyMethodChange,
  contactValue,
  onContactValueChange,
  contactLabel,
  contactHint,
}: Step2Props) {
  return (
    <>
      <p className="text-sm text-slate-600">
        Choose how you&apos;d like to verify ownership of <strong>{facilityName}</strong> in {state}.
      </p>

      <div>
        <div className="flex gap-0 border-b border-slate-200">
          {VERIFY_METHODS.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => onVerifyMethodChange(m)}
              className={[
                "flex items-center gap-1.5 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
                verifyMethod === m
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-700",
              ].join(" ")}
            >
              {m === "EMAIL" && <EmailIcon />}
              {m === "TEXT" && <TextIcon />}
              {m === "PHONE" && <PhoneIcon />}
              {VERIFY_LABELS[m]}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold text-slate-900">{contactLabel}</label>
        <p className="mb-2 text-xs text-slate-500">{contactHint}</p>
        <input
          type={verifyMethod === "EMAIL" ? "email" : "tel"}
          value={contactValue}
          onChange={(e) => onContactValueChange(e.target.value)}
          required
          placeholder={verifyMethod === "EMAIL" ? "your@email.com" : "+1 (555) 000-0000"}
          className={INPUT_CLASS}
        />
      </div>

      <p className="text-xs leading-relaxed text-slate-400">
        By continuing, our team will contact you to complete verification. You&apos;ll be able to
        create listings once verified.
      </p>
    </>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  );
}

function TextIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
      />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
      />
    </svg>
  );
}
