import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-white">Nook</span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              Helping families find the right care for their loved ones since 2020.
            </p>
          </div>

          {/* Find Care */}
          <div>
            <h4 className="text-white font-semibold mb-4">Find Care</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/search?care=assisted-living" className="hover:text-white transition-colors">Assisted Living</Link></li>
              <li><Link href="/search?care=memory-care" className="hover:text-white transition-colors">Memory Care</Link></li>
              <li><Link href="/search?care=independent-living" className="hover:text-white transition-colors">Independent Living</Link></li>
              <li><Link href="/search?care=adult-family-home" className="hover:text-white transition-colors">Adult Family Home</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/assessment" className="hover:text-white transition-colors">Assessment</Link></li>
              <li><Link href="/resources/cost-guide" className="hover:text-white transition-colors">Cost Guide</Link></li>
              <li><Link href="/resources/medicare-medicaid" className="hover:text-white transition-colors">Medicare/Medicaid Info</Link></li>
              <li><Link href="/resources/tour-checklist" className="hover:text-white transition-colors">Tour Checklist</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="tel:18005550123" className="hover:text-white transition-colors">1-800-555-0123</a></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="/providers" className="hover:text-white transition-colors">For Providers</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">© 2026 Nook. All rights reserved.</p>
          <div className="flex items-center gap-6 text-sm">
            <Link href="/privacy" className="text-slate-500 hover:text-slate-300 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-slate-500 hover:text-slate-300 transition-colors">Terms of Service</Link>
            <Link href="/accessibility" className="text-slate-500 hover:text-slate-300 transition-colors">Accessibility</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
