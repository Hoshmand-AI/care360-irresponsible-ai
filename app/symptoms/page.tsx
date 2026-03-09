'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Search, X, ArrowRight, AlertTriangle } from 'lucide-react'

const COMMON_SYMPTOMS = [
  'Headache', 'Fever', 'Cough', 'Sore throat', 'Fatigue', 
  'Nausea', 'Dizziness', 'Body aches', 'Congestion', 'Chills',
  'Runny nose', 'Sneezing'
]

const DIGESTIVE_SYMPTOMS = [
  'Stomach pain', 'Nausea', 'Vomiting', 'Diarrhea', 'Constipation', 'Bloating'
]

const EMERGENCY_SYMPTOMS = [
  'Chest pain', 'Difficulty breathing', 'Severe bleeding', 'Loss of consciousness'
]

const DURATION_OPTIONS = [
  'Less than a day',
  '1-3 days',
  '4-7 days',
  'Over a week'
]

const SEVERITY_OPTIONS = [
  { value: 'mild', label: 'Mild', description: 'Noticeable but not interfering with daily activities' },
  { value: 'moderate', label: 'Moderate', description: 'Affecting some daily activities' },
  { value: 'severe', label: 'Severe', description: 'Significantly impacting daily life' },
]

export default function SymptomsPage() {
  const router = useRouter()
  const { data: session } = useSession()
  
  const [step, setStep] = useState(1)
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [duration, setDuration] = useState<string>('')
  const [severity, setSeverity] = useState<string>('')
  const [additionalInfo, setAdditionalInfo] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    )
  }

  const removeSymptom = (symptom: string) => {
    setSelectedSymptoms(prev => prev.filter(s => s !== symptom))
  }

  const handleSubmit = async () => {
    if (selectedSymptoms.length === 0) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/symptoms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symptoms: selectedSymptoms,
          duration,
          severity,
          additionalInfo,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to analyze symptoms')
      }

      const data = await response.json()
      
      // Store results in sessionStorage for the results page
      sessionStorage.setItem('symptomResults', JSON.stringify({
        input: { symptoms: selectedSymptoms, duration, severity },
        results: data,
      }))

      router.push('/results')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const filteredCommonSymptoms = COMMON_SYMPTOMS.filter(s => 
    s.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <h1 className="text-2xl sm:text-3xl font-display text-navy-950 mb-2">
          Symptom Checker
        </h1>
        <p className="text-slate-500 mb-8">
          Tell us what you&apos;re experiencing and we&apos;ll provide guidance.
        </p>

        {/* Progress Indicator */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-md transition-colors ${
                i <= step ? 'bg-teal-500' : 'bg-slate-200'
              }`}
            />
          ))}
        </div>

        {/* Step 1: Symptom Selection */}
        {step === 1 && (
          <>
            {/* Search Box */}
            <div className="bg-white border border-slate-200 rounded-lg p-5 mb-5">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search or type symptoms..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-100 border border-slate-200 rounded-lg
                    text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-teal-500
                    focus:ring-2 focus:ring-teal-500/20"
                />
              </div>

              {/* Selected Symptoms */}
              {selectedSymptoms.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {selectedSymptoms.map(symptom => (
                    <span
                      key={symptom}
                      className="inline-flex items-center gap-2 bg-teal-600 text-white 
                        px-4 py-2 rounded-md text-sm font-medium"
                    >
                      {symptom}
                      <button
                        onClick={() => removeSymptom(symptom)}
                        className="hover:bg-teal-700 rounded-md p-0.5"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Common Symptoms */}
            <div className="bg-white border border-slate-200 rounded-lg p-5 mb-5">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4">
                Common Symptoms
              </h3>
              <div className="flex flex-wrap gap-2.5">
                {filteredCommonSymptoms.map(symptom => (
                  <SymptomChip
                    key={symptom}
                    label={symptom}
                    selected={selectedSymptoms.includes(symptom)}
                    onClick={() => toggleSymptom(symptom)}
                  />
                ))}
              </div>
            </div>

            {/* Digestive Symptoms */}
            <div className="bg-white border border-slate-200 rounded-lg p-5 mb-5">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4">
                Digestive
              </h3>
              <div className="flex flex-wrap gap-2.5">
                {DIGESTIVE_SYMPTOMS.map(symptom => (
                  <SymptomChip
                    key={symptom}
                    label={symptom}
                    selected={selectedSymptoms.includes(symptom)}
                    onClick={() => toggleSymptom(symptom)}
                  />
                ))}
              </div>
            </div>

            {/* Emergency Symptoms */}
            <div className="bg-white border border-slate-200 rounded-lg p-5 mb-8">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4">
                Seek Immediate Care
              </h3>
              <div className="flex flex-wrap gap-2.5">
                {EMERGENCY_SYMPTOMS.map(symptom => (
                  <SymptomChip
                    key={symptom}
                    label={symptom}
                    selected={selectedSymptoms.includes(symptom)}
                    onClick={() => toggleSymptom(symptom)}
                    emergency
                  />
                ))}
              </div>
            </div>
          </>
        )}

        {/* Step 2: Additional Details */}
        {step === 2 && (
          <>
            {/* Duration */}
            <div className="bg-white border border-slate-200 rounded-lg p-5 mb-5">
              <h3 className="text-base font-semibold text-navy-950 mb-4">
                How long have you had these symptoms?
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {DURATION_OPTIONS.map(option => (
                  <button
                    key={option}
                    onClick={() => setDuration(option)}
                    className={`
                      px-4 py-3 rounded-lg text-sm font-medium border transition-all
                      ${duration === option 
                        ? 'bg-teal-600 border-teal-600 text-white' 
                        : 'bg-white border-slate-200 text-slate-600 hover:border-teal-300 hover:bg-teal-50'
                      }
                    `}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Severity */}
            <div className="bg-white border border-slate-200 rounded-lg p-5 mb-5">
              <h3 className="text-base font-semibold text-navy-950 mb-4">
                How severe are your symptoms?
              </h3>
              <div className="space-y-3">
                {SEVERITY_OPTIONS.map(option => (
                  <button
                    key={option.value}
                    onClick={() => setSeverity(option.value)}
                    className={`
                      w-full px-4 py-4 rounded-lg text-left border transition-all
                      ${severity === option.value 
                        ? 'bg-teal-50 border-teal-500' 
                        : 'bg-white border-slate-200 hover:border-teal-300'
                      }
                    `}
                  >
                    <p className={`font-semibold ${severity === option.value ? 'text-teal-700' : 'text-slate-800'}`}>
                      {option.label}
                    </p>
                    <p className="text-sm text-slate-500 mt-0.5">{option.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-white border border-slate-200 rounded-lg p-5 mb-8">
              <h3 className="text-base font-semibold text-navy-950 mb-4">
                Anything else we should know? <span className="font-normal text-slate-400">(optional)</span>
              </h3>
              <textarea
                value={additionalInfo}
                onChange={e => setAdditionalInfo(e.target.value)}
                placeholder="Recent travel, medications you're taking, etc..."
                rows={3}
                className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-lg
                  text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-teal-500
                  focus:ring-2 focus:ring-teal-500/20 resize-none"
              />
            </div>
          </>
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <>
            <div className="bg-white border border-slate-200 rounded-lg p-5 mb-5">
              <h3 className="text-base font-semibold text-navy-950 mb-4">Review Your Symptoms</h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Symptoms</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedSymptoms.map(symptom => (
                      <span key={symptom} className="bg-teal-100 text-teal-700 px-3 py-1.5 rounded-md text-sm font-medium">
                        {symptom}
                      </span>
                    ))}
                  </div>
                </div>

                {duration && (
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Duration</p>
                    <p className="text-slate-700">{duration}</p>
                  </div>
                )}

                {severity && (
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Severity</p>
                    <p className="text-slate-700 capitalize">{severity}</p>
                  </div>
                )}

                {additionalInfo && (
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Additional Info</p>
                    <p className="text-slate-700">{additionalInfo}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Privacy Note */}
            <div className="bg-slate-100 rounded-lg p-4 mb-8">
              <p className="text-sm text-slate-500 text-center">
                🔒 Your symptoms are analyzed securely. We don&apos;t store personal health data without your consent.
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}
          </>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-4">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex-1 px-6 py-3.5 bg-white border border-slate-300 rounded-lg
                text-slate-700 font-semibold hover:bg-slate-100 transition-colors"
            >
              Back
            </button>
          )}
          
          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={step === 1 && selectedSymptoms.length === 0}
              className="flex-1 px-6 py-3.5 bg-teal-600 rounded-lg text-white font-semibold
                hover:bg-teal-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center justify-center gap-2"
            >
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex-1 px-6 py-3.5 bg-teal-600 rounded-lg text-white font-semibold
                hover:bg-teal-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-md animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>Get Guidance <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function SymptomChip({ 
  label, 
  selected, 
  onClick,
  emergency = false
}: { 
  label: string
  selected: boolean
  onClick: () => void
  emergency?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={`
        px-4 py-2.5 rounded-md text-sm font-medium border transition-all
        ${selected 
          ? 'bg-teal-600 border-teal-600 text-white' 
          : emergency
            ? 'bg-white border-red-300 text-red-600 hover:bg-red-50'
            : 'bg-white border-slate-200 text-slate-600 hover:border-teal-300 hover:bg-teal-50'
        }
      `}
    >
      {label}
    </button>
  )
}
