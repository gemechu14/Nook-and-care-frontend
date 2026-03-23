"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toursApi } from "@/services/toursService";
import { useAuth } from "@/store/authStore";
import { CalendarPicker } from "./CalendarPicker";
import { TOUR_TIME_OPTIONS } from "../_constants";
import { formatDate, parseDateTime } from "../_utils";

interface ScheduleTourModalProps {
  isOpen: boolean;
  listingId: string;
  onClose: () => void;
}

const getInitialForm = () => ({
  date: formatDate(new Date()),
  time: "",
  tourType: "IN_PERSON" as "IN_PERSON" | "VIRTUAL",
  name: "",
  email: "",
  phone: "",
  requests: "",
});

export function ScheduleTourModal({ isOpen, listingId, onClose }: ScheduleTourModalProps) {
  const { user } = useAuth();
  const router = useRouter();
  const calendarRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState(getInitialForm);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setForm(getInitialForm());
    setError(null);
    setSuccess(false);
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target as Node)) {
        setCalendarOpen(false);
      }
    };
    if (calendarOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [calendarOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent(`/listings/${listingId}`)}`);
      return;
    }

    if (!form.date || !form.time) {
      setError("Please select both date and time.");
      return;
    }

    const scheduledAt = parseDateTime(form.date, form.time);
    if (!scheduledAt) {
      setError("Invalid date or time format.");
      return;
    }

    setSubmitting(true);
    try {
      await toursApi.create({
        listing_id: listingId,
        booked_by_user_id: user.id,
        tour_type: form.tourType,
        scheduled_at: scheduledAt,
        notes: form.requests || undefined,
      });
      setSuccess(true);
      setForm(getInitialForm());
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to schedule tour. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Schedule a tour"
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Schedule a Tour</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4 sm:p-6">
          {success && (
            <div className="mb-4 p-4 bg-teal-50 border border-teal-200 rounded-lg">
              <p className="text-teal-800 font-medium">Tour scheduled successfully!</p>
            </div>
          )}

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 font-medium">{error}</p>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="relative" ref={calendarRef}>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Preferred Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setCalendarOpen(!calendarOpen)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-10"
                  aria-label="Open calendar"
                >
                  <svg className="w-5 h-5 text-slate-400 hover:text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </button>
                <input
                  type="text"
                  value={form.date}
                  onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                  onClick={() => setCalendarOpen((o) => !o)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none cursor-pointer"
                  placeholder="Select date"
                  required
                  readOnly
                />
                {calendarOpen && (
                  <div className="absolute top-full left-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-xl z-[60] p-4">
                    <CalendarPicker
                      onSelect={(d) => {
                        setForm((f) => ({ ...f, date: formatDate(d) }));
                        setCalendarOpen(false);
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Preferred Time <span className="text-red-500">*</span>
              </label>
              <select
                value={form.time}
                onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none appearance-none bg-white"
                required
              >
                <option value="">Select time</option>
                {TOUR_TIME_OPTIONS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Tour Type <span className="text-red-500">*</span>
              </label>
              <select
                value={form.tourType}
                onChange={(e) => setForm((f) => ({ ...f, tourType: e.target.value as "IN_PERSON" | "VIRTUAL" }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none appearance-none bg-white"
                required
              >
                <option value="IN_PERSON">In-Person Tour</option>
                <option value="VIRTUAL">Virtual Tour</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Your Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Questions or special requests</label>
              <textarea
                value={form.requests}
                onChange={(e) => setForm((f) => ({ ...f, requests: e.target.value }))}
                rows={4}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none resize-none"
                placeholder="Any special requests or questions?"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-4 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Submitting..." : "Submit Request"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
