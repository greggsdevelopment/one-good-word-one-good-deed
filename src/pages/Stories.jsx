import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, X, Calendar, Tag, BookOpen } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { format } from 'date-fns';

const SAMPLE_STORIES = [
  {
    id: 'sample-1',
    title: "One Wristband Changed Everything for Marcus",
    date: "2024-10-15",
    category: "Student Story",
    excerpt: "A 7th grader at Wayne-Westland who was being bullied every day showed up to school differently the Monday after Jason's assembly.",
    content: `Marcus had been dreading school for months. Every day in the hallway meant name-calling, shoulder checks, and the constant fear of what would happen next. His mom had called the school twice. Nothing changed.

Then Jason came to speak.

"He looked right at me when he talked about how words can break a person down," Marcus later told his counselor. "I felt like he knew exactly what I was going through."

After the assembly, Marcus approached Jason. They talked for 10 minutes. Jason gave him a wristband and told him: "You are seen. You matter. One good word from you is going to change someone else's life someday."

Three weeks later, Marcus stopped a younger student from being teased in the cafeteria. He didn't think twice. He just did it.

"That wristband reminds me every morning," he said. "I don't want anyone to feel what I felt."`,
    photo_url: null,
    published: true,
  },
  {
    id: 'sample-2',
    title: "How Lincoln Middle School Transformed Its Culture",
    date: "2024-11-03",
    category: "School Partnership",
    excerpt: "After three consecutive assemblies and a leadership workshop, Lincoln Middle reported a 40% drop in reported bullying incidents.",
    content: `When Principal Sandra Thomas first booked Jason Lewis for an assembly, she expected the usual — students half-paying attention, a few inspired for a week, then back to normal.

That's not what happened.

"By the second assembly, teachers were coming to me saying students were policing each other — in a good way," she said. "Kids were actually calling each other out for how they spoke to each other."

Lincoln brought Jason back three times over two school years. They added a student ambassador program inspired by his message. The ambassadors — 24 eighth graders — wore One Good Word wristbands and held monthly pledge drives.

The numbers told the story: reported bullying incidents dropped 40% from the prior year. More importantly, the culture felt different. Students felt safer.

"Jason didn't just give a speech," Principal Thomas said. "He gave us a framework for how to treat each other. That framework is still alive in this building."`,
    photo_url: null,
    published: true,
  },
  {
    id: 'sample-3',
    title: "Faith, Football, and Fighting Racism",
    date: "2025-01-20",
    category: "Community Impact",
    excerpt: "A local church youth group brought Jason in for a Sunday session that turned into a two-hour conversation about race, faith, and unity.",
    content: `It was supposed to be a 45-minute talk for the youth group at Greater Grace Church. It turned into something none of them expected.

Jason started with his story — growing up watching bullying, seeing racism poison relationships, feeling called by God to do something about it. Within 15 minutes, teenagers who never spoke up were raising their hands, sharing their own experiences.

A 16-year-old named Devon talked about being the only Black student on his football team and how his teammates used language that made him feel like an outsider, even when they didn't mean harm.

Jason paused the whole group. He asked Devon's teammates who were there — three of them — to listen. Really listen.

"That moment," the youth pastor said later, "was the most honest conversation about race I've ever seen between teenagers. And it happened because Jason created a space where honesty was safe."

Devon and two of his teammates now run an inclusion committee at their high school. They call it One Good Word.`,
    photo_url: null,
    published: true,
  },
  {
    id: 'sample-4',
    title: "Jason Featured in Wayne County School Board Newsletter",
    date: "2025-03-08",
    category: "News",
    excerpt: "The Wayne County School Board highlighted the One Good Word program as a model anti-bullying initiative for districts across Michigan.",
    content: `The Wayne County School Board's spring newsletter featured One Good Word...One Good Deed as one of the most effective community-based anti-bullying programs operating in Michigan schools today.

The feature cited data from three partner schools showing measurable improvements in school climate surveys, reduced behavioral referrals, and increased student-reported feelings of safety.

"What makes Jason's program different is that it isn't a one-time event," the newsletter noted. "He builds relationships with schools, returns multiple times, and empowers students to carry the message themselves."

Board member Dr. Patricia Ellison praised the program's faith-based approach: "We respect the separation of church and state, but we also recognize that for many of our students, faith is the language of love they understand best. Jason speaks that language without excluding anyone."

Jason was invited to present at the district's annual leadership summit in April — the first community speaker to be invited in over a decade.`,
    photo_url: null,
    published: true,
  },
];

export default function Stories() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ title: '', date: '', category: 'Student Story', excerpt: '', content: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadStories();
    base44.auth.isAuthenticated().then(async (authed) => {
      if (authed) { const me = await base44.auth.me(); setUser(me); }
    });
  }, []);

  const loadStories = async () => {
    const dbStories = await base44.entities.Story.filter({ approved: true }, '-created_date', 50);
    // Merge sample + db stories, db stories first
    const all = [...dbStories, ...SAMPLE_STORIES];
    setStories(all);
    setLoading(false);
  };

  const isAdmin = user?.role === 'admin';
  const set = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    await base44.entities.Story.create({ ...form, approved: true });
    setSaving(false);
    setShowForm(false);
    setForm({ title: '', date: '', category: 'Student Story', excerpt: '', content: '' });
    loadStories();
  };

  const CATEGORY_COLORS = {
    'Student Story': 'text-gold bg-gold/10',
    'School Partnership': 'text-blue-400 bg-blue-400/10',
    'Community Impact': 'text-green-400 bg-green-400/10',
    'News': 'text-cream/60 bg-white/[0.07]',
  };

  return (
    <div className="min-h-screen bg-ink relative">
      <div className="grain-overlay fixed inset-0 pointer-events-none z-0" style={{ opacity: 0.07 }} />

      {/* Nav */}
      <header className="sticky top-0 z-50 bg-ink/95 backdrop-blur-md border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 text-cream/70 hover:text-gold transition-colors font-barlow-condensed text-sm tracking-wider uppercase">
            <ArrowLeft className="w-4 h-4" />
            Back to Site
          </Link>
          <p className="font-anton text-cream text-lg tracking-wider">STORIES OF IMPACT</p>
          {isAdmin && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gold hover:bg-gold-dark text-ink font-barlow-condensed font-bold text-sm uppercase tracking-wider rounded-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Story
            </button>
          )}
          {!isAdmin && <div className="w-24" />}
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-16">

        {/* Hero */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-barlow-condensed text-gold text-xs tracking-[0.35em] uppercase mb-4"
          >
            Real People. Real Change.
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-anton text-cream text-5xl sm:text-7xl leading-[0.9] mb-6"
          >
            STORIES OF<br />
            <span className="text-gold">IMPACT.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="font-barlow text-cream/50 text-lg max-w-xl mx-auto"
          >
            Every story is proof that one good word can change a life. Here are just a few.
          </motion.p>
        </div>

        {/* Story grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-8">
            {stories.map((story, i) => (
              <motion.article
                key={story.id}
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="bg-white/[0.03] border border-white/[0.07] rounded-sm overflow-hidden hover:border-gold/20 transition-all duration-300 cursor-pointer group"
                onClick={() => setSelected(story)}
              >
                {/* Photo placeholder */}
                <div className="h-40 bg-white/[0.03] border-b border-white/[0.06] flex items-center justify-center">
                  {story.photo_url ? (
                    <img src={story.photo_url} alt={story.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-2 opacity-30">
                      <BookOpen className="w-8 h-8 text-cream" />
                    </div>
                  )}
                </div>

                <div className="p-7">
                  <div className="flex items-center gap-3 mb-4">
                    {story.category && (
                      <span className={`font-barlow-condensed text-xs px-2 py-1 rounded-sm uppercase tracking-wider ${CATEGORY_COLORS[story.category] || 'text-cream/50 bg-white/[0.07]'}`}>
                        {story.category}
                      </span>
                    )}
                    {story.date && (
                      <span className="flex items-center gap-1 font-barlow text-cream/30 text-xs">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(story.date), 'MMM d, yyyy')}
                      </span>
                    )}
                  </div>
                  <h2 className="font-anton text-cream text-2xl leading-tight mb-3 group-hover:text-gold transition-colors">
                    {story.title}
                  </h2>
                  <p className="font-barlow text-cream/55 text-sm leading-relaxed line-clamp-3">
                    {story.excerpt || story.content?.substring(0, 160) + '...'}
                  </p>
                  <p className="mt-4 font-barlow-condensed text-gold text-sm tracking-wide uppercase">
                    Read Story →
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </main>

      {/* Story modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-ink/90 backdrop-blur-md flex items-start justify-center p-4 overflow-y-auto"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              className="relative bg-ink border border-white/[0.1] rounded-sm max-w-2xl w-full my-8 p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => setSelected(null)} className="absolute top-4 right-4 text-cream/40 hover:text-cream transition-colors">
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3 mb-4">
                {selected.category && (
                  <span className={`font-barlow-condensed text-xs px-2 py-1 rounded-sm uppercase tracking-wider ${CATEGORY_COLORS[selected.category] || 'text-cream/50 bg-white/[0.07]'}`}>
                    {selected.category}
                  </span>
                )}
                {selected.date && (
                  <span className="font-barlow text-cream/30 text-xs">
                    {format(new Date(selected.date), 'MMMM d, yyyy')}
                  </span>
                )}
              </div>
              <h2 className="font-anton text-cream text-3xl sm:text-4xl leading-tight mb-6">{selected.title}</h2>
              <div className="font-barlow text-cream/70 text-base leading-relaxed whitespace-pre-line">
                {selected.content}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin add story modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-ink/90 backdrop-blur-md flex items-start justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="relative bg-ink border border-white/[0.12] rounded-sm max-w-2xl w-full my-8 p-8"
            >
              <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-cream/40 hover:text-cream transition-colors">
                <X className="w-5 h-5" />
              </button>
              <h2 className="font-anton text-cream text-3xl mb-8">ADD STORY</h2>
              <form onSubmit={handleSave} className="space-y-4">
                <input required placeholder="Title *" value={form.title} onChange={set('title')}
                  className="w-full bg-white/[0.05] border border-white/[0.1] rounded-sm px-4 py-3 text-cream placeholder:text-cream/25 font-barlow focus:outline-none focus:border-gold/40 transition-colors" />
                <div className="grid grid-cols-2 gap-4">
                  <input type="date" value={form.date} onChange={set('date')}
                    className="w-full bg-white/[0.05] border border-white/[0.1] rounded-sm px-4 py-3 text-cream font-barlow focus:outline-none focus:border-gold/40 transition-colors [color-scheme:dark]" />
                  <select value={form.category} onChange={set('category')}
                    className="w-full bg-white/[0.05] border border-white/[0.1] rounded-sm px-4 py-3 text-cream font-barlow focus:outline-none focus:border-gold/40 transition-colors">
                    {['Student Story','School Partnership','Community Impact','News'].map(c => (
                      <option key={c} value={c} className="bg-ink">{c}</option>
                    ))}
                  </select>
                </div>
                <textarea placeholder="Short excerpt (shown on card)" value={form.excerpt} onChange={set('excerpt')} rows={2}
                  className="w-full bg-white/[0.05] border border-white/[0.1] rounded-sm px-4 py-3 text-cream placeholder:text-cream/25 font-barlow focus:outline-none focus:border-gold/40 transition-colors resize-none" />
                <textarea required placeholder="Full story content *" value={form.content} onChange={set('content')} rows={8}
                  className="w-full bg-white/[0.05] border border-white/[0.1] rounded-sm px-4 py-3 text-cream placeholder:text-cream/25 font-barlow focus:outline-none focus:border-gold/40 transition-colors resize-none" />
                <button type="submit" disabled={saving}
                  className="w-full py-4 bg-gold hover:bg-gold-dark disabled:opacity-50 text-ink font-barlow-condensed font-bold text-lg uppercase tracking-wider rounded-sm transition-all">
                  {saving ? 'Publishing...' : 'Publish Story'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}