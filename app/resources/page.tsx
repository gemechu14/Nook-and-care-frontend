"use client";

import Link from "next/link";
import { useState } from "react";

// ─── Data ────────────────────────────────────────────────────────────────────

const guidesArticles = [
  {
    title: "Understanding Care Levels",
    description: "Learn the difference between assisted living, memory care, independent living, skilled nursing, and adult family homes.",
    readTime: "5 min read",
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    href: "/resources/care-levels",
  },
  {
    title: "Senior Care Cost Guide",
    description: "Understand what affects pricing, what's included, hidden fees, and how to plan financially for long-term care.",
    readTime: "8 min read",
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    href: "/resources/cost-guide",
  },
  {
    title: "Medicare & Medicaid Guide",
    description: "What Medicare and Medicaid cover (and don't cover) for senior living. How to apply and what to expect.",
    readTime: "10 min read",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    href: "/resources/medicare-medicaid",
  },
  {
    title: "Caregiver Wellness",
    description: "Resources for family caregivers. Recognizing burnout, setting boundaries, and getting the support you need.",
    readTime: "6 min read",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    href: "/resources/caregiver-wellness",
  },
  {
    title: "Questions to Ask on a Tour",
    description: "A comprehensive checklist of the most important questions to ask when touring a senior living facility.",
    readTime: "4 min read",
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    href: "/resources/tour-checklist",
  },
  {
    title: "Veterans Benefits for Senior Care",
    description: "Aid & Attendance, Pension benefits, and other VA resources that can help pay for senior care.",
    readTime: "7 min read",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    href: "/resources/veterans-benefits",
  },
];

const faqs = [
  {
    question: "How much does assisted living typically cost?",
    answer: "The national median for assisted living is around $4,500/month, though costs range from $3,000 to $8,000+ depending on location, care level, and amenities included.",
  },
  {
    question: "Does Medicare pay for assisted living?",
    answer: "Medicare does not typically cover assisted living or long-term custodial care. It may cover short-term skilled nursing after a hospital stay. Medicaid may cover some costs depending on the state.",
  },
  {
    question: "What's the difference between assisted living and memory care?",
    answer: "Assisted living helps with daily activities while memory care is specifically designed for people with Alzheimer's or dementia. Memory care facilities have secured areas, specialized programming, and staff trained in dementia care.",
  },
  {
    question: "How do I know when it's time to consider senior care?",
    answer: "Signs include difficulty with daily activities, safety concerns, medication management issues, social isolation, or caregiver burnout. Our free assessment can help evaluate your loved one's needs.",
  },
  {
    question: "What should I look for when touring a facility?",
    answer: "Look for cleanliness, staff-to-resident ratios, meal quality, activity programs, safety features, and overall atmosphere. Ask about licensing, staff training, and how they handle medical emergencies.",
  },
  {
    question: "Can I visit my loved one anytime?",
    answer: "Most facilities have visiting hours, though many allow 24/7 family access. Policies vary, so ask about visiting hours, overnight stays, and any restrictions during your tour.",
  },
];

const externalResources = [
  {
    title: "Medicare.gov",
    description: "Official Medicare information and coverage details",
    href: "https://www.medicare.gov",
  },
  {
    title: "Eldercare Locator",
    description: "Federal resource to find local aging services",
    href: "https://eldercare.acl.gov",
  },
  {
    title: "AARP Caregiver Resources",
    description: "Tools and guides for family caregivers",
    href: "https://www.aarp.org/caregiving",
  },
  {
    title: "Alzheimer's Association",
    description: "Resources for dementia and memory care",
    href: "https://www.alz.org",
  },
  {
    title: "Veterans Affairs",
    description: "VA benefits for senior care and long-term services",
    href: "https://www.va.gov",
  },
  {
    title: "Long-Term Care Ombudsman",
    description: "Advocate for nursing home and assisted living residents",
    href: "https://ltcombudsman.org",
  },
];

// ─── Components ──────────────────────────────────────────────────────────────

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
      >
        <span className="font-semibold text-slate-900 pr-4">{question}</span>
        <svg
          className={`w-5 h-5 text-slate-600 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="px-6 pb-4">
          <p className="text-slate-600 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ResourcesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white pt-24">
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              Senior Care Resources
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Guides, tools, and information to help you navigate senior care with clarity and confidence.
            </p>
          </div>

          {/* Guides & Articles */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-slate-900 mb-8">Guides & Articles</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {guidesArticles.map((article) => (
                <Link
                  key={article.title}
                  href={article.href}
                  className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-teal-200 transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 ${article.iconBg} rounded-lg flex items-center justify-center ${article.iconColor} shrink-0`}>
                      {article.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-900 mb-2 group-hover:text-teal-600 transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-slate-600 text-sm leading-relaxed mb-3">
                        {article.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-xs">{article.readTime}</span>
                        <svg
                          className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition-colors"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 text-center mb-12">
              Frequently Asked Questions
            </h2>
            <div className="max-w-3xl mx-auto space-y-4">
              {faqs.map((faq, index) => (
                <FAQItem key={index} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          </div>

          {/* External Resources */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-slate-900 mb-8">Helpful External Resources</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {externalResources.map((resource) => (
                <a
                  key={resource.title}
                  href={resource.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-teal-200 transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
                      <svg
                        className="w-5 h-5 text-slate-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-900 mb-2 group-hover:text-teal-600 transition-colors">
                        {resource.title}
                      </h3>
                      <p className="text-slate-600 text-sm leading-relaxed">{resource.description}</p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Still Have Questions CTA */}
          <div className="bg-teal-700 rounded-2xl p-12 text-center">
            <div className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            </div>
            <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Still have questions?
            </h3>
            <p className="text-teal-100 text-lg mb-8 max-w-2xl mx-auto">
              Our care advisors are available 24/7 to help you navigate your options at no cost.
            </p>
            <a
              href="tel:18005550123"
              className="inline-flex items-center gap-2 bg-white text-teal-700 px-8 py-4 rounded-xl font-semibold hover:bg-teal-50 transition-colors"
            >
              Call 1-800-555-NOOK
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}


