import { Link } from 'react-router-dom';
import LegalPage from '@/components/legal/LegalPage';

const EMAIL = 'greggsdevelopment@gmail.com';

const sections = [
  {
    id: 'agree',
    title: 'Using this site and app',
    body: (
      <p>
        These terms apply to ogwogd.org and the OGWOGD app, run by One Good Word...One Good Deed LLC, a Michigan company. By using them you agree to
        these terms and to our <Link to="/privacy">Privacy Policy</Link>. If you do not agree, please do not use the site or app.
      </p>
    ),
  },
  {
    id: 'community',
    title: 'Community Guidelines (Pledge Wall and anything you post)',
    body: (
      <>
        <p>The Pledge Wall is for kindness. When you post, you agree not to include:</p>
        <ul>
          <li>Bullying, harassment, threats, hate or put-downs of anyone, including because of race, religion, disability, gender or sexual orientation.</li>
          <li>Anyone's full name, address, phone number, school schedule or other personal information.</li>
          <li>Sexual content, violence, profanity, advertising, spam or links.</li>
          <li>Anything that pretends to be someone else.</li>
        </ul>
        <p>
          Every pledge is reviewed before it appears. Anyone can tap <strong>Report</strong> on a pledge; reported pledges are usually hidden right away and reviewed by
          our team, usually within one business day. You can also hide all pledges from a person with <strong>Block</strong>. We may remove any content and
          block anyone who breaks these guidelines. You keep ownership of what you post and give us permission to show it on the site, app and our social media.
        </p>
      </>
    ),
  },
  {
    id: 'chat',
    title: 'The chat assistant',
    body: (
      <p>
        The chat assistant uses artificial intelligence to answer questions about OGWOGD. Answers can be wrong or out of date; check anything important with
        our team. It is not a crisis line and does not give legal, medical, tax or financial advice. If you or someone else is in danger, call 911, or call or text 988.
      </p>
    ),
  },
  {
    id: 'accounts',
    title: 'Accounts and the school portal',
    body: (
      <>
        <p>
          Accounts are for school partners we invite and for our team. Keep your sign-in private and tell us right away if you think someone else has used
          it. School portal information is shared only among the invited staff of that school and our team.
        </p>
        <p>You can delete your account at any time from <Link to="/account">Account</Link>. We may close accounts that are misused.</p>
      </>
    ),
  },
  {
    id: 'programs',
    title: 'School programs',
    body: (
      <p>
        Prices shown on the site and quotes built there are estimates. A school program is confirmed only by a written agreement with the school, and the
        agreement, quote and invoice for that program control its dates, price and payment terms.
      </p>
    ),
  },
  {
    id: 'giving',
    title: 'Donations, sponsorships and the shop',
    body: (
      <ul>
        <li>OGWOGD is a Michigan LLC, not a registered 501(c)(3) nonprofit. Donations and sponsorships are not tax deductible as charitable contributions.</li>
        <li>Money donations are made on GoFundMe, outside this site and app, under GoFundMe's terms.</li>
        <li>We review every item donation offer and may decline items. Offering items does not mean we will accept them.</li>
        <li>Shop payments are processed by Stripe. For a problem with an order, contact us at <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.</li>
      </ul>
    ),
  },
  {
    id: 'ours',
    title: 'Our content',
    body: (
      <p>
        The OGWOGD name, logo, photos, videos and written content belong to OGWOGD or the people who shared them with us. Please do not copy or reuse them
        for commercial purposes without our permission. Sharing links to our pages is always welcome.
      </p>
    ),
  },
  {
    id: 'liability',
    title: 'No guarantees',
    body: (
      <p>
        We work hard to keep the site accurate and running, but it is provided as is, without guarantees. To the extent the law allows, OGWOGD is not
        responsible for indirect or incidental losses from using the site or app. Links to other sites, such as GoFundMe, Stripe or YouTube, are
        governed by those sites' own terms.
      </p>
    ),
  },
  {
    id: 'law',
    title: 'Michigan law',
    body: <p>These terms are governed by the laws of the State of Michigan. If a part of these terms cannot be enforced, the rest still applies.</p>,
  },
  {
    id: 'contact',
    title: 'Contact and changes',
    body: (
      <p>
        Questions: <a href={`mailto:${EMAIL}`}>{EMAIL}</a> or <a href="tel:+17343833865">(734) 383-3865</a>. If we change these terms we will update the
        date at the top of this page.
      </p>
    ),
  },
];

export default function Terms() {
  return (
    <LegalPage
      title="Terms of Use"
      updated="September 30, 2026"
      intro="The short version: be kind, keep other people's information private, and know that our chat assistant is helpful but not perfect."
      sections={sections}
    />
  );
}
