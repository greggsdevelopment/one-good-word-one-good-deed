// Home page - hero, the three foundations, footer. Nothing else.
import { useState, useEffect } from 'react';
import { Sunrise, Sunset } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import StickyNav from '@/components/home/StickyNav';
import HeroSection from '@/components/home/HeroSection';
import FoundationBand from '@/components/home/FoundationBand';
import ProgramStepsVisual from '@/components/home/ProgramStepsVisual';
import FooterSection from '@/components/home/FooterSection';
import NightForDraykeCard from '@/components/home/NightForDraykeCard';
import { HERO_PHOTO } from '@/components/drayke/draykePhotos';

const LOGO_URL = 'https://media.base44.com/images/public/6a19e1fc6c5eb736a0763b09/1824cf861_IMG_5119.png';
const SHOP_IMAGE = 'https://media.base44.com/images/public/6a19e1fc6c5eb736a0763b09/3cd386384_IMG_7343.jpeg';

const SERIF = { fontFamily: "'Cormorant Garamond', serif" };

export default function Home() {
  const [pledgeCount, setPledgeCount] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        const allPledges = await base44.entities.Pledge.filter({ approved: true }, '-created_date', 1000);
        setPledgeCount(allPledges.length);
      } catch (err) {
        console.error('Could not load pledge count:', err);
      }
    };
    loadData();
  }, []);

  return (
    <div className="bg-ink">
      <StickyNav logoUrl={LOGO_URL} />
      <HeroSection logoUrl={LOGO_URL} pledgeCount={pledgeCount} />

      {/* 01 - Drayke */}
      <FoundationBand
        index="01"
        eyebrow="The Reason We Fight"
        title="REMEMBER"
        titleAccent="DRAYKE"
        image={HERO_PHOTO}
        imageAlt="Drayke shading his eyes and smiling, 2021"
        glow="25% 40%"
        meta={
          <div className="flex items-center justify-center lg:justify-start gap-5 text-cream/80">
            <span className="flex items-center gap-2">
              <Sunrise className="text-gold" size={17} strokeWidth={1.5} />
              <span style={SERIF} className="text-base">May 26, 2009</span>
            </span>
            <span className="w-px h-4 bg-gold/30" aria-hidden="true" />
            <span className="flex items-center gap-2">
              <Sunset className="text-gold" size={17} strokeWidth={1.5} />
              <span style={SERIF} className="text-base">February 10, 2022</span>
            </span>
          </div>
        }
        description="Drayke was twelve years old when nearly a year of bullying took him from a family that adored him. His memorial is the heart of this movement: his photographs, his own words about butterflies, and the promise that no child carries what he carried."
        cta="Visit the Memorial"
        to="/drayke"
      />

      {/* A Night For Drayke event announcement */}
      <NightForDraykeCard />

      {/* 02 - Shop */}
      <FoundationBand
        index="02"
        eyebrow="Wear the Movement"
        title="THE MERCH"
        titleAccent="SHOP"
        image={SHOP_IMAGE}
        imageAlt="One Good Word One Good Deed t-shirt"
        glow="75% 40%"
        reverse
        meta={
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 font-barlow-condensed text-cream/60 text-xs tracking-[0.2em] uppercase">
            <span>Tees from $25</span>
            <span className="text-gold/40">/</span>
            <span>Hoodies &amp; Coats</span>
            <span className="text-gold/40">/</span>
            <span>Free shipping over $75</span>
          </div>
        }
        description="Shirts, hoodies, wool coats and the wristbands we hand to every student at every assembly. Every purchase puts the message on somebody's chest and funds the next school we walk into."
        cta="Shop the Collection"
        to="/shop"
      />

      {/* 03 - School Programs */}
      <FoundationBand
        index="03"
        eyebrow="Where the Work Happens"
        title="SCHOOL"
        titleAccent="PROGRAMS"
        visual={<ProgramStepsVisual />}
        glow="25% 45%"
        description="Kindness is a skill, so we teach it like one. Five steps across one school year take students from watching to acting, with a staff training hour and a family night built in. Booked by principals across Southeast Michigan."
        cta="See the Programs"
        to="/programs"
      />

      <FooterSection logoUrl={LOGO_URL} />
    </div>
  );
}