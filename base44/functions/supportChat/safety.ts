/**
 * Safety check for the support chat. No imports on purpose: the website also
 * loads this file (src/lib/chat.js) so the same rules can show crisis help in
 * the browser when the network or server fails.
 */

export type CrisisKind = 'self' | 'danger' | 'harm';

export type CrisisReply = {
  text: string;
  actions: string[];
  suggestions: string[];
  handoff: boolean;
  topic: string;
  crisis: CrisisKind;
};

// Patterns run on normalized text: lower case, curly quotes straightened.
// Tuned for how kids and teens actually type. A false alarm only shows help
// lines; a miss is far worse, so these lean wide on purpose.
const SELF = new RegExp([
  String.raw`\bkill(ing|ed)?\s+(my|him|her|them|your)sel(f|ves)\b`,
  String.raw`\bkms\b`,
  String.raw`\bun-?aliv`,
  String.raw`\bsuicid`,
  String.raw`\bself[\s-]?harm`,
  String.raw`\b(want|wants|wanted|wanting|ready)\s+to\s+die\b`,
  String.raw`\bwanna\s+die\b`,
  String.raw`\bwish(ed)?\s+i\s+(was|were)\s+(dead|never\s+born|gone)\b`,
  String.raw`\bwish\s+i\s+(wasn't|wasnt|was\s+not)\s+(alive|here|born)\b`,
  String.raw`\b(don't|dont|do\s+not|doesn't|doesnt|does\s+not)\s+(want|wanna)\s+(to\s+)?(live|be\s+alive|exist|be\s+here\s+anymore|wake\s+up)\b`,
  String.raw`\bend\s+(my|his|her)\s+(own\s+)?life\b`,
  String.raw`\bend\s+it\s+all\b`,
  String.raw`\b(want|wants|going|gonna|wanna)\s+(to\s+)?end\s+it\b`,
  String.raw`\btake\s+(my|his|her)\s+(own\s+)?life\b`,
  String.raw`\bhurt(ing|s)?\s+(my|him|her)self\b`,
  String.raw`\bcut(ting|s)?\s+(my|him|her)self\b`,
  String.raw`\b(been|started|keep|still)\s+cutting\b`,
  String.raw`\bcut(ting)?\s+my\s+(wrists?|arms?|legs?|thighs?)\b`,
  String.raw`\bno\s+reason\s+to\s+live\b`,
  String.raw`\bbetter\s+off\s+(dead|without\s+me)\b`,
  String.raw`\bnobody\s+would\s+(care|miss\s+me)\s+if\s+i\b`,
  String.raw`\b(overdose|hang\s+myself)\b`,
  String.raw`\bjump\s+off\s+(a|the)\s+(bridge|building|roof)\b`,
].join('|'), 'i');

const DANGER = new RegExp([
  String.raw`\bbomb\b`,
  String.raw`\bshoot(ing)?\s+(up|everyone|everybody|people|the\s+school|us|kids)\b`,
  String.raw`\b(will|going\s+to|gonna|wanna|want\s+to|wants\s+to)\s+(shoot|stab|kill)\s+(him|her|them|you|me|everyone|everybody|people|someone|somebody|kids|students|teachers?|us)\b`,
  String.raw`\b(has|had|brought|bringing|brings)\s+a\s+(gun|knife|weapon)\b`,
  String.raw`\bthreaten(ed|ing|s)?\s+to\s+(shoot|stab|kill|hurt)\b`,
].join('|'), 'i');

const WHO = String.raw`(he|she|they|someone|somebody|dad|mom|father|mother|step\s?dad|step\s?mom|uncle|aunt|brother|sister|cousin|grandpa|grandma|parent|teacher|coach|boyfriend|girlfriend|babysitter)`;
const HARM = new RegExp([
  String.raw`\bsexually\s+(abused|assaulted|abusing)\b`,
  String.raw`\babus(e|es|ed|ing)\s+me\b`,
  String.raw`\b${WHO}\s+(hits|hurts|beats|chokes|kicks|slaps|touches|touched|molests|molested|abuses|abused|hit|beat|choked|burns|burned)\s+me\b`,
  String.raw`\bmolest`,
  String.raw`\braped?\b`,
  String.raw`\b(not\s+safe|afraid|scared)\s+(at|to\s+go)\s+home\b`,
  String.raw`\btouch(ed|es|ing)\s+me\s+(inappropriately|where|down\s+there)\b`,
].join('|'), 'i');

/** Lower case, straight quotes, single spaces. */
export function normalizeForSafety(text: string): string {
  return String(text || '')
    .toLowerCase()
    .replace(/[\u2018\u2019\u02BC`\u00B4]/g, "'")
    .replace(/\s+/g, ' ');
}

/** Which safety response, if any, a visitor message calls for. */
export function detectCrisis(text: string): CrisisKind | null {
  const t = normalizeForSafety(text);
  if (SELF.test(t)) return 'self';
  if (DANGER.test(t)) return 'danger';
  if (HARM.test(t)) return 'harm';
  return null;
}

export function crisisReply(kind: CrisisKind): CrisisReply {
  const text =
    kind === 'self'
      ? "I'm really glad you told me. You matter, and you do not have to carry this alone. If you might act on these thoughts or you are in danger right now, call 911. You can call or text 988 any time, day or night, to talk with someone at the Suicide and Crisis Lifeline, or text HOME to 741741. If you are a student, please tell a trusted adult today: a parent, teacher, counselor or coach."
      : kind === 'danger'
        ? 'If anyone is in danger right now, call 911. In Michigan you can also report a threat to a school anonymously with OK2SAY: call 855-565-2729 or text 652729. Please tell a trusted adult at school right away too.'
        : "I'm sorry this is happening. It is not your fault, and you deserve to be safe. If you are in danger right now, call 911. You can call Childhelp at 1-800-422-4453 any time, or text HOME to 741741 to talk with someone. Please tell a trusted adult today: a teacher, counselor, coach or family member.";
  return {
    text,
    actions: kind === 'self' ? ['call_988', 'text_741741', 'call_911'] : ['call_911', 'text_741741', 'resources'],
    suggestions: ['Talk to a person'],
    handoff: false,
    topic: 'bullying_help',
    crisis: kind,
  };
}

