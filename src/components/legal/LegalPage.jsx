import { Link } from 'react-router-dom';
import BackButton from '@/components/app/BackButton';

/** Shared frame for Privacy, Terms and similar reading pages. */
export default function LegalPage({ title, updated, intro, sections }) {
  return (
    <div className="min-h-screen bg-ink text-cream select-text">
      <header className="sticky top-0 sticky-safe z-40 bg-ink/95 border-b border-white/[0.06]">
        <div className="max-w-3xl mx-auto px-5 h-16 flex items-center justify-between gap-3">
          <BackButton fallback="/account" />
          <p className="font-anton tracking-wider text-lg">{title.toUpperCase()}</p>
          <span className="w-16" aria-hidden="true" />
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-5 py-10 pb-24">
        <h1 className="font-anton text-4xl sm:text-5xl tracking-wide">{title.toUpperCase()}</h1>
        <p className="font-barlow text-cream/50 text-sm mt-2">Last updated {updated}</p>
        {intro && <p className="font-barlow text-cream/80 text-lg leading-relaxed mt-6">{intro}</p>}

        <nav aria-label="On this page" className="mt-8 rounded-xl border border-white/10 bg-white/[0.03] p-5">
          <p className="font-barlow-condensed uppercase tracking-wider text-xs text-cream/50 mb-2">On this page</p>
          <ol className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5 list-decimal list-inside font-barlow text-sm">
            {sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="text-cream/80 hover:text-gold underline-offset-2 hover:underline">{s.title}</a>
              </li>
            ))}
          </ol>
        </nav>

        {sections.map((s) => (
          <section key={s.id} id={s.id} className="mt-10 scroll-mt-24">
            <h2 className="font-barlow-condensed font-bold uppercase tracking-wider text-xl text-gold">{s.title}</h2>
            <div className="mt-3 space-y-3 font-barlow text-[16px] leading-relaxed text-cream/80 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:text-gold [&_strong]:text-cream">
              {s.body}
            </div>
          </section>
        ))}

        <div className="mt-14 pt-6 border-t border-white/10 flex flex-wrap gap-x-6 gap-y-2 font-barlow text-sm text-cream/60">
          <Link to="/privacy" className="hover:text-gold">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-gold">Terms of Use</Link>
          <Link to="/contact" className="hover:text-gold">Contact</Link>
          <Link to="/account" className="hover:text-gold">Your account</Link>
        </div>
      </main>
    </div>
  );
}
