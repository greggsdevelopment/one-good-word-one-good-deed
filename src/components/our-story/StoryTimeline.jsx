import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import StoryChapter from './StoryChapter';

const CHAPTERS = [
  {
    key: 'ch1',
    heading: 'May 30th',
    body: 'We met at a diner, both of us with our boys. It was supposed to be a business meeting. I was there to build a website.',
  },
  {
    key: 'ch2',
    heading: 'The Conversation That Changed It',
    body: 'Jason told me his story. He told me why he started One Good Word, One Good Deed, what he had seen, what it cost, and what he was not willing to let happen to another kid. Somewhere in the middle of that conversation, I stopped hearing it as a client telling me about a project. I felt it in my soul. This was not a website. This was something I needed to be a part of.',
  },
  {
    key: 'ch3',
    heading: 'We Got To Work',
    body: 'From that day forward, it stopped being his mission and started being ours. Community events. Wristbands handed out to anyone who would take one. Conversations with strangers in parking lots that turned into conversations about their kids.',
  },
  {
    key: 'ch4',
    heading: 'Building The Network',
    body: 'We started knocking on doors. Local businesses, churches, and people who decided these kids were worth investing in. One sponsor at a time, we built something with roots in this community instead of something that just talked about it.',
  },
  {
    key: 'ch5',
    heading: 'The Stop Bullying Truck',
    body: 'Then we wrapped the truck. Now it turns heads in parking lots, and people stop us to ask what it means. Every single time, that is another conversation we get to have about what is happening to kids in our schools.',
  },
  {
    key: 'ch6',
    heading: 'We Are Just Getting Started',
    body: 'A live pledge wall. A full school program built for Michigan middle schools. Sponsors signing on. News coverage telling the story. None of it happened because of a website. It happened because two fathers decided that showing up was not optional.',
  },
];

export default function StoryTimeline() {
  const [photos, setPhotos] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);

  const load = async () => {
    try {
      const rows = await base44.entities.StoryPhoto.list();
      const map = {};
      rows.forEach((r) => {
        map[r.chapter] = r.image_url;
      });
      setPhotos(map);
    } catch (err) {
      console.error('Could not load story photos', err);
    }
  };

  useEffect(() => {
    load();
    base44.auth.isAuthenticated().then(async (authed) => {
      if (authed) {
        const me = await base44.auth.me();
        setIsAdmin(me?.role === 'admin');
      }
    });
  }, []);

  return (
    <section className="relative bg-ink py-20 md:py-28 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="relative">
          {/* Thin gold vertical line connecting the chapters */}
          <div
            className="absolute top-0 bottom-0 w-px bg-gold/25 left-4 md:left-1/2 md:-translate-x-1/2"
            aria-hidden="true"
          />
          <div className="space-y-24 md:space-y-36">
            {CHAPTERS.map((ch, i) => (
              <StoryChapter
                key={ch.key}
                chapter={ch}
                index={i}
                photoUrl={photos[ch.key]}
                isAdmin={isAdmin}
                onUploaded={load}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}