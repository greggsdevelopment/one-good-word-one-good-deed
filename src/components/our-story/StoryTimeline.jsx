import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import StoryChapter from './StoryChapter';

const CHAPTERS = [
  {
    key: 'ch1',
    heading: 'May 30th 2026',
    photo: 'https://media.base44.com/images/public/6a19e1fc6c5eb736a0763b09/a4a9948ac_IMG_7383.jpeg',
    body: 'Cody and Jason met at a diner, both of them with their boys. It was supposed to be a business meeting, nothing more. Cody was there to build a website, and that was all he came for. But somewhere over the next hour, the room changed. The meeting he walked in expecting would not be the meeting he walked out of. He just did not know it yet.',
  },
  {
    key: 'ch2',
    heading: 'The Conversation That Changed It',
    photo: 'https://media.base44.com/images/public/6a19e1fc6c5eb736a0763b09/32c3481a3_IMG_7388.jpeg',
    body: 'Jason told Cody his story. He told him why he started One Good Word, One Good Deed, what he had seen, what it cost, and what he was not willing to let happen to another kid. Somewhere in the middle of that conversation, Cody stopped hearing it as a client telling him about a project. He felt it in his soul. This was not a website. This was something he needed to be a part of.',
  },
  {
    key: 'ch3',
    heading: 'We Got To Work',
    photo: 'https://media.base44.com/images/public/6a19e1fc6c5eb736a0763b09/7893e6993_IMG_7384.jpeg',
    body: 'From that day forward, it stopped being Jason\'s mission and started being theirs. Community events. Wristbands handed out to anyone who would take one. Conversations with strangers in parking lots that turned into conversations about their kids.',
  },
  {
    key: 'ch4',
    heading: 'Building The Network',
    photo: 'https://media.base44.com/images/public/6a19e1fc6c5eb736a0763b09/62df32c7f_IMG_7385.jpeg',
    body: 'They started knocking on doors. Local businesses, churches, and people who decided these kids were worth investing in. One sponsor at a time, they built something with roots in this community instead of something that just talked about it.',
  },
  {
    key: 'ch5',
    heading: 'The Stop Bullying Truck',
    photo: 'https://media.base44.com/images/public/6a19e1fc6c5eb736a0763b09/f37ec7107_IMG_7386.jpeg',
    body: 'Then they wrapped the truck. Now it turns heads in parking lots, and people stop them to ask what it means. Every single time, that is another conversation they get to have about what is happening to kids in our schools.',
  },
  {
    key: 'ch6',
    heading: 'We Are Just Getting Started',
    photo: 'https://media.base44.com/images/public/6a19e1fc6c5eb736a0763b09/85ad17b34_IMG_7173.jpeg',
    body: 'A live pledge wall. A full school program built for Michigan schools. Sponsors signing on. News coverage telling the story. None of it happened because of a website. It happened because two fathers decided that showing up was not optional.',
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
                photoUrl={photos[ch.key] || ch.photo}
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