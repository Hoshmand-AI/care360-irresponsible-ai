import Link from 'next/link'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <div className="mb-12">
          <h1 className="text-4xl font-display text-navy-950 mb-4">Contact Us</h1>
          <p className="text-xl text-slate-500">We'd love to hear from you</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-xl p-8 border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">General Inquiries</h2>
            <p className="text-slate-600 mb-4">For general questions about Care360 AI or Hoshmand AI.</p>
            <a href="mailto:hello@hoshmand.ai" className="text-teal-600 hover:underline font-medium">hello@hoshmand.ai</a>
          </div>

          <div className="bg-white rounded-xl p-8 border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Support</h2>
            <p className="text-slate-600 mb-4">Having trouble with the app? We're here to help.</p>
            <a href="mailto:support@hoshmand.ai" className="text-teal-600 hover:underline font-medium">support@hoshmand.ai</a>
          </div>

          <div className="bg-white rounded-xl p-8 border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Privacy & Data</h2>
            <p className="text-slate-600 mb-4">Questions about how your data is handled.</p>
            <a href="mailto:privacy@hoshmand.ai" className="text-teal-600 hover:underline font-medium">privacy@hoshmand.ai</a>
          </div>

          <div className="bg-white rounded-xl p-8 border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Press & Media</h2>
            <p className="text-slate-600 mb-4">Media inquiries and press requests.</p>
            <a href="mailto:press@hoshmand.ai" className="text-teal-600 hover:underline font-medium">press@hoshmand.ai</a>
          </div>
        </div>

        <Link href="/" className="text-teal-600 hover:underline">← Back to Home</Link>
      </div>
    </div>
  )
}
