import { Link } from 'react-router-dom';
import LegalPage from '@/components/legal/LegalPage';

const EMAIL = 'greggsdevelopment@gmail.com';
const PHONE = '(734) 383-3865';

// Written to match what the site and app actually do. Update it whenever a
// new form, service or data use is added.
const sections = [
  {
    id: 'who',
    title: 'Who we are',
    body: (
      <>
        <p>
          One Good Word...One Good Deed LLC ("OGWOGD", "we") is a Michigan company that runs an anti-bullying and anti-racism
          movement, school programs and community events in metro Detroit. This policy covers ogwogd.org and the OGWOGD app.
        </p>
        <p>
          Questions about your information: <a href={`mailto:${EMAIL}`}>{EMAIL}</a> or <a href="tel:+17343833865">{PHONE}</a>.
        </p>
      </>
    ),
  },
  {
    id: 'collect',
    title: 'What we collect',
    body: (
      <>
        <p>We only collect what you choose to send us, plus a few technical details needed to run the site safely.</p>
        <ul>
          <li><strong>Pledge Wall:</strong> first name, last initial, optional city and your pledge. Only approved pledges are shown, with your first name, last initial and city if you gave one.</li>
          <li><strong>Contact, prayer requests and resource suggestions:</strong> what you type, and your name and email if you give them. Prayer requests can be anonymous.</li>
          <li><strong>Newsletter:</strong> your email address.</li>
          <li><strong>Event RSVPs:</strong> name, email, phone and how many people are coming.</li>
          <li><strong>School program requests and the school portal:</strong> school details, staff names, titles, emails and phone numbers, billing contacts, purchase order numbers, program dates, invoices, payments, documents you upload and messages with our team.</li>
          <li><strong>Sponsorship applications:</strong> business and contact details.</li>
          <li><strong>Item donations:</strong> name, email, phone, what you are offering and, for pickups, your address.</li>
          <li><strong>Shop orders:</strong> name, email and shipping address. Card details are entered on Stripe's secure page; we never see or store your full card number.</li>
          <li><strong>Chat assistant:</strong> the messages you type, any rating you give, the page you were on, and your name, email and phone if you ask to talk to a person.</li>
          <li><strong>Accounts</strong> (school partners and our team): name, email and sign-in details. Passwords are handled by our hosting provider and are never visible to us.</li>
          <li><strong>Technical details:</strong> a one-way scrambled version of your network address, used only for spam limits and never shown; for pledges, a random ID saved in your browser, which we turn into a scrambled tag that is stored with your pledge so people can block a poster and we can stop repeat abuse (the tag cannot be traced back to you or your device); basic page-visit counts from our hosting provider; and small settings saved in your browser, such as your open chat and where you were on a page.</li>
        </ul>
        <p>We do not use advertising trackers, we do not track you across other apps or websites, and we do not sell or rent your information.</p>
      </>
    ),
  },
  {
    id: 'use',
    title: 'How we use it',
    body: (
      <ul>
        <li>To answer you, schedule and deliver school programs, send quotes and invoices, and keep program records.</li>
        <li>To review item donations and arrange pickups or drop-offs, and to fill shop orders.</li>
        <li>To show approved pledges on the Pledge Wall.</li>
        <li>To send the newsletter if you signed up, and event updates if you RSVP'd.</li>
        <li>To keep the site safe: bot checks, spam limits, and, if a chat message suggests someone may be in danger, alerting our team so we can respond.</li>
        <li>To improve the site, for example by seeing which questions the chat assistant could not answer.</li>
      </ul>
    ),
  },
  {
    id: 'ai',
    title: 'The chat assistant and AI',
    body: (
      <>
        <p>
          The chat assistant writes its answers with an artificial intelligence (AI) service provided through our hosting platform, Base44, which uses
          AI models from companies such as OpenAI, Google and Anthropic. When you type a question, that message and the recent conversation are sent
          through Base44 to the AI model to write a reply. These companies use it only to write the reply for us, not to advertise to you. The assistant asks for your
          okay before your first typed question is sent. The quick-answer buttons in the chat do not use AI.
        </p>
        <p>Please do not share private details such as addresses, passwords or health information in the chat. Conversations are saved so our team can follow up and improve answers.</p>
        <p>AI answers can be wrong. The chat is not a crisis service. If you or someone else is in danger, call 911, or call or text 988.</p>
      </>
    ),
  },
  {
    id: 'share',
    title: 'Who we share it with',
    body: (
      <>
        <p>We share information only with the services that run the site for us, and only what each one needs:</p>
        <ul>
          <li><strong>Base44</strong>: hosting, database, sign-in, file storage and the AI behind the chat assistant, which Base44 runs on AI models from providers such as OpenAI, Google and Anthropic.</li>
          <li><strong>Google</strong>: Gmail, which sends our notification emails, and YouTube, which plays the embedded videos and the background music (the music player loads only when you turn the music on, or on computers once the page has finished loading). Our typefaces are served from our own site.</li>
          <li><strong>Cloudflare Turnstile</strong>: checks that form submissions come from a person, not a bot.</li>
          <li><strong>Stripe</strong>: processes shop payments.</li>
          <li><strong>U.S. Census Bureau and OpenStreetMap</strong>: turn a pickup address into a map location to check the pickup distance.</li>
          <li><strong>GoFundMe</strong>: if you choose to donate funds, you leave our site and GoFundMe's own policies apply.</li>
        </ul>
        <p>We may also share information if the law requires it, or to protect someone's safety.</p>
      </>
    ),
  },
  {
    id: 'keep',
    title: 'How long we keep it',
    body: (
      <p>
        We keep information only as long as we need it for the reason you gave it to us, then delete it. Records the law requires us to keep,
        such as invoices and payment records, are kept for as long as required. Deleting your account removes your account and personal
        details sooner (see below).
      </p>
    ),
  },
  {
    id: 'choices',
    title: 'Your choices and rights',
    body: (
      <>
        <ul>
          <li>Ask to see, correct or delete information you gave us by emailing <a href={`mailto:${EMAIL}`}>{EMAIL}</a>. We reply within 30 days.</li>
          <li>Unsubscribe from the newsletter at any time by replying to any newsletter email or contacting us.</li>
          <li>Ask us to remove a pledge you posted.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'delete',
    title: 'Deleting your account',
    body: (
      <>
        <p>
          If you have an account, go to <Link to="/account">Account</Link> and choose <strong>Delete account</strong>. This removes your sign-in and your
          school portal access right away, and deletes the chat conversations, newsletter signup, event RSVPs, contact messages, item donation
          offers, sponsorship applications and raffle entries linked to your email. Your name is removed from school portal messages and your
          contact details from school bookings and documents you uploaded.
        </p>
        <p>
          We keep records the law requires for taxes: a school's invoices and payments belong to the school and stay with its records, and shop
          orders stay with your email removed (the shipping name and address remain on the order).
        </p>
        <p>
          If part of the removal cannot finish automatically, the app tells you, and our team completes it within 7 days. You can also email us to ask for deletion.
        </p>
      </>
    ),
  },
  {
    id: 'kids',
    title: 'Children',
    body: (
      <>
        <p>
          Our work helps kids, but the site is meant for parents, schools, supporters and the community. We do not knowingly collect personal
          information from children under 13. Kids under 13 should ask a parent or guardian before filling out any form or using the chat.
        </p>
        <p>
          The Pledge Wall only asks for a first name, last initial and optional city, and only pledges our team approves are shown. If you believe a child
          under 13 sent us personal information, contact us and we will delete it.
        </p>
      </>
    ),
  },
  {
    id: 'security',
    title: 'Security',
    body: (
      <p>
        Our database only allows our team to read form submissions and school records. Public forms go through checks that block bots and
        flooding. School documents are stored privately and opened only with short-lived links. No system is perfect; if you think something is
        wrong, tell us right away.
      </p>
    ),
  },
  {
    id: 'changes',
    title: 'Changes to this policy',
    body: <p>If we change this policy, we will update it here and change the date at the top. Big changes will also be announced on the site.</p>,
  },
];

export default function Privacy() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="September 30, 2026"
      intro="Plain language: we collect only what you send us, we use it to run the movement and our programs, we never sell it, and you can ask us to delete it at any time."
      sections={sections}
    />
  );
}
