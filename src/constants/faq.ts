/**
 * Frequently asked questions for this site — the mockup has none, and this
 * section is an addition to it, kept because the three checks above it say
 * what gets read and this says what the reading is worth.
 *
 * Rendered VISIBLY on the home page and emitted as FAQPage structured data
 * from this same array. Google requires the two to match; markup-only FAQ is a
 * guidelines violation, which is why the page maps over this constant rather
 * than duplicating the text.
 *
 * The wording is unique to this site: these answers are indexable page content,
 * and they are exactly the kind of text an answer engine quotes. Here they
 * argue one thing — that a comparison page is the last page before the casino,
 * so everything that decides the decision has to be stated in front of the
 * link rather than behind it, including what the link does for us. Its
 * siblings answer the neighbouring questions (affliliate: what an offer is
 * worth in money; slottering: the slot rules; bettingbetway: which casino to
 * trust; bonanzasmile: the catch in a bonus; gladjackpot: how the money gets
 * out; luckycatsmile: that luck is the wrong word; spinsunny: when you get to
 * read the small print; starspinly: one scale for every operator; rollofjoy:
 * what an offer costs you in evenings; bigbrightday: whether the terms can be
 * read in one go; goodnewsdrop: what changed since last time) and none of them
 * may be echoed.
 *
 * NOTHING BELOW CLAIMS A FIGURE THIS SITE CANNOT SHOW. The mockup's own
 * method band says "we fund a live account", "played through the wagering" and
 * "we request a withdrawal and log the hours to payout", and its review prose
 * repeats all three. None of it ships, in any wording: nothing in this project
 * records a funded account or a timed payment. The second question is asked
 * precisely so the answer can say so outright, and the payout question is
 * answered by naming whose commitment the figure actually is.
 *
 * The LAST question is this site's own, and it is the one no sibling asks: what
 * the link at the end of a row does. On a site named after its links, that
 * answer belongs on the page rather than in a policy document — which is also
 * why the disclosure appears a second time under the hero and a third time
 * under the three checks.
 */
export const FAQ_ITEMS = [
  {
    question: 'How do you rank casinos?',
    answer:
      'On three things, read in the order they will matter to you after you click: the licence, the bonus terms and the cashier. The licence comes first because it is the only one that can end the matter — an account opened from a country the terms exclude can be closed on withdrawal. Then what the bonus asks for in return: the wagering multiplier and whether it applies to the bonus alone or to the deposit as well, the maximum stake allowed while clearing, and the expiry. Then how the money comes back out: the methods, the caps, the stated processing window and the point at which identity documents are demanded. An operator that states all of it plainly ranks above one with a louder banner.',
  },
  {
    question: 'Do you actually play at these casinos?',
    answer:
      'No, and we will not print a figure we did not read somewhere you can read it too. Everything here comes from pages the operator publishes — the promotion page, the bonus terms, the general terms, the cashier page and the regulator’s own register — quoted so it can be checked against the source. That is the approach rather than a limitation of it: a site claiming its own deposits and withdrawals is asking to be believed about the one thing nobody else can verify, where a published term is a matter of record anyone can go and look at.',
  },
  {
    question: 'Why does it matter what I know before I click?',
    answer:
      'Because once you are on an operator’s own site, nothing you read there is written to help you compare. The banner is an advertisement, the terms behind it are a legal document, and the gap between the two is where a bonus turns out to cost twice what it looked like. Everything that decides the choice is decidable beforehand — the regulator, the accepted countries, the multiplier and what it applies to, the withdrawal caps — so this page states all of it before the link rather than leaving you to find it after.',
  },
  {
    question: 'Are the bonuses really worth it?',
    answer:
      'Sometimes, and the figure that decides it is never the one on the banner. Read four things first: the multiplier and what it is applied to, the maximum stake allowed while clearing, the cap on what can be withdrawn from the bonus, and how long you have. A headline of 100% up to €500 at 25x on the bonus and the same headline at 40x on deposit plus bonus are the same advertisement and roughly three times the cost. We print those next to the offer, quoted from where the operator published them, and if they are hard to find, treat the difficulty itself as information about the offer.',
  },
  {
    question: 'How quickly can I withdraw a win?',
    answer:
      'That depends on your method and your verification status, and we publish no timings of our own because we have measured none. What we do publish is the window the operator commits to in writing on its own cashier page, together with the caps it applies and the point at which it will ask for documents. That is a commitment you could hold it to, which is worth more before you deposit than any average we could quote.',
  },
  {
    question: 'Which casinos are licensed?',
    answer:
      'Every casino on this page holds a gaming licence, and each review names the regulator so the claim can be checked on that authority’s own register rather than taken on trust. Check the countries too: a licence is not the same thing as permission for you personally to hold an account, and the list an operator publishes of the places it accepts is the first thing to read on this site and the first thing we read about it.',
  },
  {
    question: 'What happens when I click through to a casino?',
    answer:
      'You leave this site for the operator’s own, and if you go on to register we may earn a commission. That is how the reading is paid for, and it is said here rather than in a policy page because it is the kind of thing you want before a click and not after one. What it does not do is buy anything: positions are set editorially, every operator is read against the same three checks, and no operator sees a ranking before you do. There is also nothing to lose by reading the review first — the link on a review page is the same link.',
  },
] as const
