import Link from 'next/link'

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <div className="mb-12">
          <h1 className="text-4xl font-display text-navy-950 mb-4">Careers at Hoshmand AI</h1>
          <p className="text-xl text-slate-500">Help us build the future of accessible healthcare AI</p>
        </div>

        <div className="bg-white rounded-xl p-8 border border-slate-200 mb-8">
          <h2 className="text-2xl font-semibold text-slate-800 mb-4">We're growing</h2>
          <p className="text-slate-600 leading-relaxed mb-6">
            Hoshmand AI is a small, mission-driven team building AI products that make a real difference in people's lives. We're always looking for talented people who care deeply about responsible AI and accessible technology.
          </p>
          <p className="text-slate-600 leading-relaxed">
            We don't currently have open positions listed here, but we welcome speculative applications from engineers, designers, researchers, and product thinkers who are passionate about what we're building.
          </p>
        </div>

        <div className="bg-teal-50 border border-teal-200 rounded-xl p-8 mb-8">
          <h2 className="text-xl font-semibold text-teal-900 mb-3">Get in touch</h2>
          <p className="text-teal-700 mb-4">Send us your CV and a note about what excites you about our work.</p>
          <a href="mailto:careers@hoshmand.ai" className="inline-block bg-teal-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-teal-500 transition-colors">
            careers@hoshmand.ai
          </a>
        </div>

        <Link href="/" className="text-teal-600 hover:underline">← Back to Home</Link>
      </div>
    </div>
  )
}
