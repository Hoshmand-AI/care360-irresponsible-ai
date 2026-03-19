'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  CheckCircle, 
  AlertTriangle, 
  AlertCircle,
  Phone,
  ArrowRight,
  Pill,
  MapPin,
  MessageCircle
} from 'lucide-react'

interface SymptomResults {
  input: {
    symptoms: string[]
    duration?: string
    severity?: string
  }
  results: {
    urgencyLevel: 'routine' | 'soon' | 'urgent' | 'emergency'
    possibleCauses: string[]
    recommendations: string[]
    otcSuggestions: {
      name: string
      brands: string[]
      purpose: string
      warnings?: string[]
    }[]
    warningSignsToWatch: string[]
    disclaimers: string[]
  }
}

export default function ResultsPage() {
  const router = useRouter()
  const [data, setData] = useState<SymptomResults | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = sessionStorage.getItem('symptomResults')
    if (stored) {
      setData(JSON.parse(stored))
    } else {
      router.push('/symptoms')
    }
  }, [router])

  if (!mounted) return null

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-pulse text-slate-400">Loading results...</div>
      </div>
    )
  }

  const { input, results } = data
  const urgencyConfig = getUrgencyConfig(results.urgencyLevel)

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <h1 className="text-2xl sm:text-3xl font-display text-navy-950 mb-2">
          Your Results
        </h1>
        <p className="text-slate-500 mb-8">
          Based on: {input.symptoms.join(', ')}
        </p>

        {/* Emergency Banner */}
        {results.urgencyLevel === 'emergency' && (
          <div className="bg-red-100 border-2 border-red-500 rounded-lg p-5 mb-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-8 h-8 text-red-600 flex-shrink-0" />
              <div className="flex-1">
                <h2 className="text-lg font-bold text-red-800 mb-2">
                  Seek Immediate Medical Attention
                </h2>
                <p className="text-red-700 mb-4">
                  Based on your symptoms, you should seek emergency care immediately.
                </p>
                <a
                  href="tel:911"
                  className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  Call 911
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Urgency Banner (non-emergency) */}
        {results.urgencyLevel !== 'emergency' && (
          <div className={`${urgencyConfig.bgColor} ${urgencyConfig.borderColor} border rounded-lg p-5 mb-6`}>
            <div className="flex items-start gap-4">
              <div className={urgencyConfig.iconColor}>
                {urgencyConfig.icon}
              </div>
              <div>
                <h2 className={`text-lg font-semibold ${urgencyConfig.textColor} mb-1`}>
                  {urgencyConfig.title}
                </h2>
                <p className="text-slate-600">
                  {urgencyConfig.description}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Possible Causes */}
        <ResultCard title="What this might be">
          <ul className="space-y-3">
            {results.possibleCauses.map((cause, i) => (
              <li key={i} className="flex items-start gap-3 text-slate-600">
                <span className="text-slate-400 mt-1">•</span>
                {cause}
              </li>
            ))}
          </ul>
        </ResultCard>

        {/* Recommendations */}
        <ResultCard title="What you can do now">
          <ul className="space-y-3">
            {results.recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-3 text-slate-600">
                <span className="text-lg">{getRecommendationIcon(i)}</span>
                {rec}
              </li>
            ))}
          </ul>
        </ResultCard>

        {/* OTC Suggestions */}
        {results.otcSuggestions && results.otcSuggestions.length > 0 && (
          <ResultCard title="OTC options to consider">
            <div className="space-y-3">
              {results.otcSuggestions.map((otc, i) => (
                <div key={i} className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                  <h4 className="font-semibold text-slate-800 mb-1">{otc.name}</h4>
                  <p className="text-xs text-slate-500 mb-2">
                    {otc.brands.join(', ')}
                  </p>
                  <p className="text-sm text-slate-600">{otc.purpose}</p>
                  {otc.warnings && otc.warnings.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-slate-200">
                      <p className="text-xs text-amber-600 flex items-start gap-1">
                        <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                        {otc.warnings[0]}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ResultCard>
        )}

        {/* Warning Signs */}
        {results.warningSignsToWatch && results.warningSignsToWatch.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-5 mb-5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-slate-800 mb-2">See a doctor if...</h3>
                <ul className="space-y-2">
                  {results.warningSignsToWatch.map((sign, i) => (
                    <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                      <span className="text-amber-500">•</span>
                      {sign}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <Link
            href="/find-care?type=pharmacy"
            className="flex items-center justify-center gap-2 px-6 py-4 bg-white border border-slate-300 
              rounded-lg font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <MapPin className="w-5 h-5" />
            Find Pharmacy
          </Link>
          <Link
            href="/chat"
            className="flex items-center justify-center gap-2 px-6 py-4 bg-teal-600 
              rounded-lg font-semibold text-white hover:bg-teal-500 transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            Ask AI Advisor
          </Link>
        </div>

        {/* Disclaimer */}
        <div className="bg-slate-100 rounded-lg p-5 text-center">
          <p className="text-sm text-slate-500">
            ⚠️ {results.disclaimers?.[0] || 'This is general wellness guidance, not medical advice. Always consult a healthcare provider for medical concerns.'}
          </p>
        </div>

        {/* New Check Button */}
        <div className="mt-6 text-center">
          <Link
            href="/symptoms"
            className="text-teal-600 font-medium hover:underline"
          >
            ← Check different symptoms
          </Link>
        </div>
      </div>
    </div>
  )
}

function ResultCard({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 mb-5">
      <h3 className="text-base font-semibold text-navy-950 mb-4">{title}</h3>
      {children}
    </div>
  )
}

function getUrgencyConfig(level: string) {
  switch (level) {
    case 'routine':
      return {
        icon: <CheckCircle className="w-7 h-7" />,
        iconColor: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        textColor: 'text-green-800',
        title: 'Self-care likely appropriate',
        description: 'Based on your symptoms, rest and over-the-counter remedies may help. Monitor for changes.',
      }
    case 'soon':
      return {
        icon: <AlertTriangle className="w-7 h-7" />,
        iconColor: 'text-amber-600',
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-200',
        textColor: 'text-amber-800',
        title: 'Consider seeing a doctor soon',
        description: 'Your symptoms may benefit from professional evaluation within the next few days.',
      }
    case 'urgent':
      return {
        icon: <AlertCircle className="w-7 h-7" />,
        iconColor: 'text-orange-600',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200',
        textColor: 'text-orange-800',
        title: 'Seek care today',
        description: 'Your symptoms suggest you should see a healthcare provider as soon as possible.',
      }
    default:
      return {
        icon: <CheckCircle className="w-7 h-7" />,
        iconColor: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        textColor: 'text-green-800',
        title: 'Self-care likely appropriate',
        description: 'Based on your symptoms, rest and over-the-counter remedies may help.',
      }
  }
}

function getRecommendationIcon(index: number): string {
  const icons = ['💤', '💧', '🌡️', '💊', '🍵', '🧘', '🩺', '📝']
  return icons[index % icons.length]
}
