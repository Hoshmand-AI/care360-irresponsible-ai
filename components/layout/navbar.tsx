'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { Menu, X, User, LogOut, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/ui/logo'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/dashboard', label: 'Dashboard', auth: true },
  { href: '/symptoms', label: 'Symptoms' },
  { href: '/find-care', label: 'Find Care' },
  { href: '/chat', label: 'AI Advisor' },
]

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const pathname = usePathname()
  const { data: session, status } = useSession()

  const filteredLinks = navLinks.filter(
    (link) => !link.auth || (link.auth && session)
  )

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {filteredLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-medium transition-colors py-2 border-b-2',
                  pathname === link.href
                    ? 'text-teal-600 border-teal-600'
                    : 'text-slate-600 border-transparent hover:text-slate-800'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-4">
            {status === 'loading' ? (
              <div className="w-20 h-9 bg-slate-100 rounded-xl animate-pulse" />
            ) : session ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-800"
                >
                  <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-teal-600" />
                  </div>
                  <span className="hidden lg:block">{session.user?.name || 'Account'}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {userMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-20">
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        Dashboard
                      </Link>
                      <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 w-full text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-slate-800">
                  Sign In
                </Link>
                <Button asChild size="sm">
                  <Link href="/symptoms">Get Started</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200">
          <div className="px-4 py-4 space-y-2">
            {filteredLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'block px-4 py-3 rounded-xl text-base font-medium transition-colors',
                  pathname === link.href
                    ? 'bg-teal-50 text-teal-600'
                    : 'text-slate-600 hover:bg-slate-50'
                )}
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-4 border-t border-slate-200">
              {session ? (
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="flex items-center gap-2 px-4 py-3 text-base font-medium text-slate-600"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              ) : (
                <div className="space-y-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 text-base font-medium text-slate-600"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 bg-teal-600 text-white rounded-xl text-center font-semibold"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
