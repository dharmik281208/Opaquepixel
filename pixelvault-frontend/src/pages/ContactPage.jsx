import { useState } from "react";
import GlassCard from "../components/GlassCard";
import SectionTag from "../components/ui/SectionTag";
import PageHero from "../components/ui/PageHero";
import Toast from "../components/Toast";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setToast({ message: "Please fill out all fields", type: "error" });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setToast({ message: "Message sent! Dharmik will get back to you shortly.", type: "success" });
      setFormData({ name: "", email: "", message: "" });
    }, 800);
  };

  return (
    <div className="page-stack max-w-4xl mx-auto w-full pb-16">
      <PageHero
        tag="Reach Out &amp; Connect"
        title="Contact &amp; Collaboration"
        lead="Get in touch for cybersecurity research, steganography inquiries, or technical collaborations."
      />

      {/* Profile & Location Specs Grid */}
      <div className="grid md:grid-cols-3 gap-6 opacity-0 animate-fade-up delay-1">
        {/* Profile Card */}
        <GlassCard className="md:col-span-2 border-emerald-500/30 bg-gradient-to-br from-surface/90 via-surface/60 to-emerald-950/20">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                Lead Developer &amp; Cybersecurity Researcher
              </span>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-white mt-4">
                Dharmik Suhagiya
              </h2>
              <p className="text-sm text-emerald-300 font-medium mt-1">
                Computer Science Engineering
              </p>
              <p className="text-xs text-surface-dim mt-3 leading-relaxed max-w-md">
                Developer of OpaquePixel, specializing in spatial &amp; frequency-domain steganography algorithms, AES-256-GCM cryptography, and web application security.
              </p>
            </div>
          </div>

          {/* Social Links Chips */}
          <div className="flex flex-wrap gap-3 mt-8 pt-6 border-t border-emerald-500/20">
            <a
              href="https://github.com/dharmik281208"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost text-xs px-4 py-2 flex items-center gap-2"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              GitHub Profile
            </a>

            <a
              href="https://www.linkedin.com/in/dhrmik-suhagiya-aab167315/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost text-xs px-4 py-2 flex items-center gap-2"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
              LinkedIn Profile
            </a>

            <a
              href="mailto:dhrmiksuhagiya@gmail.com"
              className="btn-ghost text-xs px-4 py-2 flex items-center gap-2"
            >
              <svg className="w-4 h-4 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              dhrmiksuhagiya@gmail.com
            </a>
          </div>
        </GlassCard>

        {/* Institution & Location Details */}
        <div className="space-y-6">
          <GlassCard>
            <SectionTag>Institution</SectionTag>
            <h3 className="font-display text-sm font-semibold text-white mt-2">College</h3>
            <p className="text-xs text-emerald-300 font-medium mt-1 leading-relaxed">
              Dr. S. &amp; S.S. Ghandhy College of Engg. &amp; Tech.
            </p>
          </GlassCard>

          <GlassCard>
            <SectionTag>Location</SectionTag>
            <h3 className="font-display text-sm font-semibold text-white mt-2">Base</h3>
            <p className="text-xs text-surface-dim mt-1">
              Surat, Gujarat, India
            </p>
          </GlassCard>
        </div>
      </div>

      {/* Collaboration Form */}
      <GlassCard className="mt-8 opacity-0 animate-fade-up delay-2">
        <div className="step-block mb-6">
          <SectionTag>Inquiry &amp; Projects</SectionTag>
          <h2 className="step-title">Send a Message</h2>
          <p className="text-xs text-surface-dim mt-1">
            Interested in collaboration or security research? Leave your details below.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-medium text-surface-dim mb-2">Your Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-surface-dim mb-2">Your Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@example.com"
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-surface-dim mb-2">Message / Collaboration Proposal</label>
            <textarea
              rows="4"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Hi Dharmik, I'd like to discuss a cybersecurity collaboration..."
              className="input-field py-3 resize-none"
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Sending Message…" : "Send Message →"}
          </button>
        </form>
      </GlassCard>

      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />
    </div>
  );
}
