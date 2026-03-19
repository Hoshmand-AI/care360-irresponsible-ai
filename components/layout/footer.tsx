import Link from 'next/link'
import { Logo } from '@/components/ui/logo'

export function Footer() {
  return (
    <footer className="bg-navy-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <Logo variant="light" />
            </div>
            <p className="text-sm text-slate-400 mb-6 max-w-xs">
              AI-powered health guidance that helps you understand symptoms, find care, and make informed decisions.
            </p>
            <div className="inline-flex items-center gap-2 bg-navy-800 px-4 py-2 rounded-lg">
              <span className="text-lg">🧠</span>
              <span className="text-xs text-slate-400">A Hoshmand AI Product</span>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wide mb-6">
              Product
            </h4>
            <ul className="space-y-4">
              <li>
                <Link href="/symptoms" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Symptom Checker
                </Link>
              </li>
              <li>
                <Link href="/find-care" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Find Care
                </Link>
              </li>
              <li>
                <Link href="/chat" className="text-sm text-slate-400 hover:text-white transition-colors">
                  AI Advisor
                </Link>
              </li>
              <li>
                <span className="text-sm text-slate-500">Mobile App (Coming Soon)</span>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wide mb-6">
              Company
            </h4>
            <ul className="space-y-4">
              <li>
                <Link href="/about" className="text-sm text-slate-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <a href="https://hoshmand.ai" target="_blank" rel="noopener noreferrer" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Hoshmand AI
                </a>
              </li>
              <li>
                <Link href="/careers" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wide mb-6">
              Legal
            </h4>
            <ul className="space-y-4">
              <li>
                <Link href="/privacy" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Medical Disclaimer
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-navy-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} Hoshmand AI. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-sm text-slate-500 hover:text-slate-300">
              Privacy
            </Link>
            <Link href="/terms" className="text-sm text-slate-500 hover:text-slate-300">
              Terms
            </Link>
            <Link href="/cookies" className="text-sm text-slate-500 hover:text-slate-300">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
