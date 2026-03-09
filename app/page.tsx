import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { 
  Stethoscope, 
  Pill, 
  MapPin, 
  MessageCircle, 
  Shield, 
  Smartphone,
  ArrowRight,
  Check
} from 'lucide-react'

const features = [
  {
    icon: Stethoscope,
    title: 'Smart Symptom Checker',
    description: 'Describe your symptoms and get AI-powered analysis with urgency levels and actionable next steps.',
  },
  {
    icon: Pill,
    title: 'OTC Recommendations',
    description: 'Personalized over-the-counter suggestions based on your symptoms, age, and allergies.',
  },
  {
    icon: MapPin,
    title: 'Find Care Nearby',
    description: 'Locate pharmacies, doctors, and urgent care centers near you with real-time availability.',
  },
  {
    icon: MessageCircle,
    title: 'AI Health Advisor',
    description: 'Chat with our AI to get answers to health questions, explanations, and guidance anytime.',
  },
  {
    icon: Shield,
    title: 'Private & Secure',
    description: "Your health data stays private. We don't sell your information or show you ads.",
  },
  {
    icon: Smartphone,
    title: 'Works Everywhere',
    description: 'Access Care360 on your phone, tablet, or computer — no app download required.',
  },
]

const stats = [
  { value: '500K+', label: 'Symptoms Analyzed' },
  { value: '50K+', label: 'Pharmacies Mapped' },
  { value: '98%', label: 'User Satisfaction' },
  { value: 'Free', label: 'No Hidden Costs' },
]

const steps = [
  {
    number: 1,
    title: 'Describe Symptoms',
    description: 'Select or type your symptoms — as many as you\'re experiencing.',
  },
  {
    number: 2,
    title: 'Get Analysis',
    description: 'Our AI analyzes your symptoms and provides urgency guidance.',
  },
  {
    number: 3,
    title: 'See Options',
    description: 'View OTC recommendations and care tips tailored to you.',
  },
  {
    number: 4,
    title: 'Find Care',
    description: 'Locate nearby pharmacies or doctors if needed.',
  },
]

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-white to-slate-50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-teal-50 border border-teal-100 px-4 py-2 rounded-full text-sm font-medium text-teal-700 mb-8">
            <span>✨</span>
            Powered by AI · Trusted by thousands
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display text-navy-950 leading-tight mb-6">
            Your health questions, answered with clarity
          </h1>
          
          <p className="text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto mb-10">
            Get AI-powered symptom analysis, personalized OTC recommendations, and find nearby care — all in one place. No ads, no clutter, just guidance you can trust.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-base">
              <Link href="/symptoms">
                Check Symptoms
                <ArrowRight className="w-5 h-5 ml-1" />
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg" className="text-base">
              <Link href="/chat">Talk to AI Advisor</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-y border-slate-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat) => (
            <div key={stat.label}>
              <div className="text-3xl sm:text-4xl font-bold text-navy-950 mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-slate-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-display text-navy-950 mb-4">
              Everything you need to feel confident about your health
            </h2>
            <p className="text-lg text-slate-500">
              Simple tools that help you understand symptoms, find care, and make informed decisions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <Card key={feature.title} hover className="p-8">
                <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7 text-teal-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-500">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-display text-navy-950 mb-4">
              How it works
            </h2>
            <p className="text-lg text-slate-500">
              Get health guidance in minutes, not hours.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 relative">
            {/* Connecting line (desktop only) */}
            <div className="hidden md:block absolute top-7 left-[15%] right-[15%] h-0.5 bg-slate-200" />
            
            {steps.map((step) => (
              <div key={step.number} className="text-center relative">
                <div className="w-14 h-14 bg-teal-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 shadow-lg shadow-teal-600/30 relative z-10">
                  {step.number}
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-500 max-w-[200px] mx-auto">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-navy-900 rounded-3xl p-12 sm:p-16 text-center">
            <h2 className="text-3xl sm:text-4xl font-display text-white mb-4">
              Take control of your health today
            </h2>
            <p className="text-lg text-slate-400 mb-8">
              Join thousands who use Care360 to make smarter health decisions.
            </p>
            <Button asChild size="lg" className="bg-teal-500 hover:bg-teal-400 text-base">
              <Link href="/symptoms">
                Start Free — No Account Needed
              </Link>
            </Button>
            <p className="mt-4 text-sm text-slate-500">
              100% free. No credit card required.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
