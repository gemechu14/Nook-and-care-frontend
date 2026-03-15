import Link from "next/link";

// ─── Data ────────────────────────────────────────────────────────────────────

const steps = [
  {
    step: "01",
    title: "Complete a free needs assessment",
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    description: "Answer a few guided questions about your loved one's health, mobility, cognitive status, and preferences. Takes about 5 minutes.",
    bullets: [
      "Mobility & physical health questions",
      "Cognitive and memory evaluation",
      "Daily living assistance needs",
      "Budget and timeline",
    ],
  },
  {
    step: "02",
    title: "Browse matched facilities",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    description: "We show you verified facilities that match your specific needs. Filter by location, price, care level, and amenities.",
    bullets: [
      "Personalized facility matches",
      "Real photos and pricing",
      "Verified certifications",
      "Honest family reviews",
    ],
  },
  {
    step: "03",
    title: "Compare your top choices",
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    description: "Use our side-by-side comparison tool to evaluate facilities on the factors that matter most to your family.",
    bullets: [
      "Side-by-side comparison",
      "Cost breakdown",
      "Staff ratios",
      "Care services offered",
    ],
  },
  {
    step: "04",
    title: "Schedule tours",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    description: "Book in-person or virtual tours directly through Nook. We'll confirm and remind you ahead of time.",
    bullets: [
      "In-person or virtual options",
      "Appointment confirmation",
      "Tour reminders",
      "Guided questions to ask",
    ],
  },
  {
    step: "05",
    title: "Connect & make your decision",
    iconBg: "bg-teal-100",
    iconColor: "text-teal-600",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    description: "Get expert guidance throughout your decision-making process. Our care advisors are here to support you every step of the way.",
    bullets: [
      "Expert advisor support",
      "No-cost to families",
      "Ongoing guidance",
      "Transition planning help",
    ],
  },
];

const whyChooseNook = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "Verified & Licensed",
    description: "All facilities on Nook are state-licensed and verified by our team to ensure quality and safety standards.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
    title: "Authentic Reviews",
    description: "Read real reviews from families who have been through this journey. All reviews are verified for honesty and accuracy.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    title: "Free Expert Support",
    description: "Our care advisors are available 24/7 to answer your questions and guide you through the process—completely free of charge.",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HowItWorksPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* ── Hero Section ───────────────────────────────────────────────────── */}
      <section className="pt-24 pb-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-teal-50 text-teal-700 border border-teal-200 px-3 py-1 rounded-full text-xs font-medium mb-6">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span>Simple, guided process</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            How Nook works
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-8 max-w-2xl mx-auto">
            Finding senior care can feel overwhelming. We simplify the process into clear, manageable steps so you can make confident decisions for your loved one.
          </p>

          {/* CTA Button */}
          <Link
            href="/assessment"
            className="inline-flex items-center gap-2 bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors"
          >
            <span>Start Free Assessment</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>

      {/* ── Steps Section ──────────────────────────────────────────────────── */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="space-y-16">
            {steps.map((step, index) => (
              <div
                key={step.step}
                className={`flex flex-col md:flex-row gap-0 items-start ${
                  index % 2 === 1 ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Step Card */}
                <div className="bg-white rounded-xl border-2 border-slate-200 p-6 shadow-sm max-w-sm md:w-1/2 md:max-w-none flex-shrink-0">
                  <div className="flex flex-col items-center text-center">
                    <div className={`w-14 h-14 ${step.iconBg} rounded-lg flex items-center justify-center ${step.iconColor} mb-4`}>
                      {step.icon}
                    </div>
                    <div className="text-xs font-medium text-slate-500 mb-2">Step {step.step}</div>
                    <h3 className="text-xl font-bold text-slate-900 leading-tight">{step.title}</h3>
                  </div>
                </div>

                {/* Description Text */}
                <div className="md:w-1/2 md:max-w-none flex-shrink-0 pt-1 md:pt-0 md:pl-6">
                  <p className="text-slate-600 text-base leading-relaxed mb-4">
                    {step.description}
                  </p>
                  <ul className="space-y-2">
                    {step.bullets.map((bullet, bulletIndex) => (
                      <li key={bulletIndex} className="flex items-start gap-2">
                        <svg
                          className="w-4 h-4 text-green-600 shrink-0 mt-0.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-slate-600 text-sm">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Families Choose Nook ─────────────────────────────────────── */}
      <section className="py-12 px-4 bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white text-center mb-10">
            Why families choose Nook
          </h2>

          <div className="grid sm:grid-cols-3 gap-6">
            {whyChooseNook.map((item) => (
              <div
                key={item.title}
                className="bg-slate-800 rounded-xl p-6 border border-slate-700"
              >
                <div className="w-12 h-12 bg-teal-600/20 rounded-lg flex items-center justify-center text-teal-400 mb-4">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-slate-300 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA Section ────────────────────────────────────────────── */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-3">
            Ready to find the right care?
          </h2>
          <p className="text-base sm:text-lg text-slate-600 mb-8">
            It starts with a free 5-minute assessment.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/assessment"
              className="inline-flex items-center gap-2 bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors w-full sm:w-auto justify-center"
            >
              <span>Start Free Assessment</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="/search"
              className="inline-flex items-center gap-2 border-2 border-teal-600 text-teal-600 px-6 py-3 rounded-lg font-semibold hover:bg-teal-50 transition-colors w-full sm:w-auto justify-center"
            >
              <span>Browse Facilities</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

