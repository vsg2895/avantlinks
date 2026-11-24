/**
 * All user-facing and SEO-facing wording for this site.
 *
 * The KEY STRUCTURE is identical across every site in the network — same
 * groups, same keys, same order — so the apps stay interchangeable and a
 * component written for one works on all of them.
 *
 * The WORDS are deliberately unique to this site. That is not decoration: the
 * brands are separate domains serving the same catalogue, and if they shipped
 * the same titles, descriptions and headings, Google would treat them as
 * duplicate content and suppress all but one. Every string that reaches a
 * <title>, a meta description, an <h1>/<h2> or a JSON-LD field must therefore
 * read differently here than on the sibling sites.
 *
 * avantlinks' angle: THE LAST PAGE BEFORE THE CASINO. Its unit is the
 * OUTBOUND LINK — which is what the brand is named after, and what every row
 * on this site ends in.
 *
 * The thought is this. A comparison page is the last thing a reader sees
 * before they are on an operator's own site, where everything is written to
 * sell and nothing is written to compare. So this page's whole job is the
 * HANDOVER: by the time someone presses a link here, nothing waiting on the
 * other side should still be a surprise. Three things decide that, and they
 * are the three things this site publishes in front of every link — who is
 * allowed to play, what the offer asks for in return, and how the money comes
 * back out. Plus the one fact a reader deciding what to trust needs BEFORE
 * the click rather than in a policy page afterwards: that the link pays us,
 * and that it does not buy the position above it.
 *
 * "Stay ahead" — the mockup's own phrase, and the brand's — means exactly
 * that here: you leave this page already knowing what the next one will ask
 * of you. Nothing about it is a forecast.
 *
 * Its siblings answer the neighbouring questions — affliliate decodes an offer
 * in MONEY, slottering reads the SLOT rules, bettingbetway ranks CASINOS on
 * their terms, bonanzasmile names the CATCH, gladjackpot asks how the money
 * gets OUT, luckycatsmile argues LUCK IS THE WRONG WORD, spinsunny moves the
 * small print INTO DAYLIGHT, starspinly puts every operator on ONE SCALE,
 * rollofjoy counts what an offer costs you in EVENINGS, bigbrightday asks
 * whether the terms can be READ IN ONE GO, goodnewsdrop reports WHAT CHANGED
 * — and none of them may be echoed.
 *
 * The two nearest siblings to watch, and the lines between them:
 *
 *  - spinsunny owns WHEN a figure is shown to you — it takes what an operator
 *    files under small print and prints it on the front of the card. That is
 *    about the operator's order of disclosure. This site is about the MOMENT
 *    OF TRANSITION: not which figures are hidden, but whether a reader is
 *    ready for the page they are about to land on. Never write "nothing
 *    hidden", "in daylight" or "small print, out in the open" here.
 *  - gladjackpot owns the WAY BACK OUT, meaning withdrawal. Here the cashier
 *    is one of three handover checks, never the subject.
 *
 * Also do not write "read it in one go" (bigbrightday's) or anything about
 * terms having moved or changed since last time (goodnewsdrop's).
 *
 * ── Four lines this file does not cross ───────────────────────────────────-
 * 1. The mockup's deck claims "we test payouts, bonus terms, licensing and
 *    support at every casino we list"; its method band is 01 DEPOSIT — "we
 *    fund a live account and claim the advertised bonus exactly as a new
 *    player would" — 02 PLAY — "wagering, max-bet rules and game weighting
 *    are checked" — 03 WITHDRAW — "we request a withdrawal and log the hours
 *    to payout"; its review prose says "we deposited, claimed the welcome
 *    package, played through the wagering on eligible slots, and requested a
 *    withdrawal". NONE OF IT SHIPS, in any wording. Nothing in this project
 *    records a funded account, a played bonus or a timed withdrawal, and a
 *    review site inventing its own test results is the one failure that
 *    cannot be walked back. What this site CAN do is read what an operator
 *    publishes — the promotion page, the bonus terms, the cashier page, the
 *    regulator's register — which needs no account and is checkable by
 *    anyone. That is what the method says instead, and it is a better fit for
 *    this angle anyway: the handover is about published conditions, not about
 *    somebody else's session.
 * 2. The mockup's offers section says "offers we've claimed and tested at
 *    every casino listed". Same problem, and it is also an endorsement of
 *    specific operators' promotions, which this site does not give.
 * 3. The mockup prints an "Avg. payout time" in the review glance and a
 *    "Payout: Under 1 hour" chip on every row. THERE IS NO SUCH COLUMN. No
 *    wording here promises a payout time, and the slots that drew one carry
 *    the regions and the rating, which are real. Its country <select> goes
 *    the same way: the API filters by category, not by geography, so a filter
 *    that silently ignored the choice is worse than no filter.
 * 4. The mockup's <title> is "Trusted Casino Partner Reviews". "Trusted" is
 *    an award this site would be giving itself, and "partner" is affiliate
 *    jargon for the commercial relationship rather than a word about the
 *    reader. Neither ships.
 */
export const COPY = {
  // SEO identity. These three reach the <title>, the meta description and the
  // keywords tag on EVERY page that does not set its own — which is most of
  // them — so they are the strings most likely to be read as duplicate content
  // if a sibling domain ships the same words.
  site: {
    titleTail: 'Casino Reviews & Rankings',
    description:
      'is the page before the casino: the licence, the regions, what a bonus asks for and how the money comes back out — stated here, in front of the link, so nothing on the other side is a surprise.',
    keywords: [
      'online casino reviews before you join',
      'casino licence and accepted countries',
      'casino bonus wagering requirements explained',
      'casino withdrawal limits and processing times',
      'independent casino rankings',
    ],
    // The strapline under the wordmark, in the header and the footer. The
    // mockup's own, and it stays: it says what the site is in four words.
    editionLabel: 'Casino Reviews & Rankings',
    mastheadStrapline: 'Independent casino rankings',
    // The wordmark, split so the tail can take the teal — the mockup's
    // `Avant<b>Links</b>`.
    wordmarkHead: 'Avant',
    wordmarkTail: 'Links',
  },
  nav: {
    casinos: 'Casinos',
    // The page lists every visible bonus, flat and ungrouped, so the menu says
    // what is behind it. winpalack keeps "Special Offers": its page is the
    // grouped bonus-area view and is a different thing.
    specialOffers: 'Bonuses',
    categories: 'Categories',
    // First row inside the header and footer dropdowns: the parent's own page.
    allCasinos: 'All Casinos',
    allOffers: 'All Offers',
  },
  home: {
    // The heading over the home page's offers. The mockup's own is "Top
    // Bonus Offers"; the kicker above it already says "Offers", so the
    // heading does not repeat "top" a second time in six words.
    bonus: 'Bonus Offers',
    // The line under the Bonuses heading. The mockup's is "offers we've
    // claimed and tested at every casino listed", which this site cannot say
    // and would not want to: it endorses specific promotions. This says where
    // the figure on the card came from.
    bonusesSubtitle: 'Each one carrying the figure the operator leads with, and the page that figure was published on.',
    seeMore: 'See more',
    seeAllBonuses: 'See All Bonuses',
    /**
     * The VISIBLE heading over the bonus-type panel.
     *
     * The row used to carry no heading at all — the cells were taken to
     * speak for themselves. They do not: arriving mid-page at a panel of
     * unlabelled links between the hero and the casino list, there is
     * nothing saying what the set IS, and nothing a screen reader can
     * announce for the landmark beyond a generic label nobody wrote for
     * this page.
     *
     * Worded differently on every domain, like every other <h2> here:
     * twelve sites serve one catalogue, and a shared heading is
     * duplicate content.
     */
    bonusTypesTitle: 'Bonuses By Kind',
    // The hero's eyebrow, beside the beating dot — the mockup's own line.
    heroEyebrow: 'Independent casino rankings',
    // Split in three so the JSX can set the middle phrase under the pale teal
    // highlight bar the mockup draws with `.hero h1 em::after`. The tail
    // carries the full stop so the highlight does not have to.
    heroHeadline: 'Casino reviews that',
    heroHighlight: 'stay ahead',
    heroHeadlineTail: '.',
    heroSubtitle:
      'This is the last page before the casino, and the one place on your way there that is not selling you anything. So the three things that decide it are here, in front of the link: who the operator says it accepts, what its bonus asks for in return, and how the money comes back out.',
    // The exact phrase inside heroSubtitle that takes the HIGHLIGHT BAR. Kept
    // as a key rather than as markup so the string above stays plain text,
    // readable in a <title> and in JSON-LD with no tags to strip. The page
    // splits on it; if it ever stops matching, the deck simply renders
    // unmarked rather than breaking.
    heroSubtitleMark: 'in front of the link',
    // The byline under the hero. The mockup has none; this site needs one,
    // because the commission disclosure is part of its angle and belongs
    // above the fold rather than in a policy page.
    heroBylineName: 'Independently ranked',
    heroBylineNote: 'Our links earn a commission. They do not buy a position.',
    // The head of the TOP THREE list beside the hero.
    podiumBadge: 'Top 3',
    podiumTitle: 'Highest placed',
    podiumSubtitle: 'The three highest-placed casinos in this ranking.',
    // The label on a top-three entry's rating. The mockup prints a min.
    // deposit there; nothing in the API holds one, so the slot carries the
    // rating.
    podiumRatingLabel: 'Rated',
    podiumAll: 'See the whole ranking',
    topCasinosTitle: 'Top Rated Casinos',
    topCasinosSubtitle: 'Ranked on what each operator publishes about its licence, its bonus terms and its cashier. Filter by category.',
    featuredCasinos: 'Browse Rankings',
    specialOffers: 'See Bonus Offers',
    viewAll: 'View all',
    // Leads the home <title>; the year and brand are appended in page.tsx.
    homeTitle: 'Online Casinos Reviewed Before You Join',
    faqTitle: 'Before You Click',
    faqSubtitle: 'What we read, what we will not claim, and what the link at the end of a row actually does.',
    metaDescription:
      'The page before the casino: every operator here listed with the licence it holds, the countries it says it accepts, what its bonus asks for and how withdrawals work — stated in front of the link.',
    // ── The "How we review" band ──────────────────────────────────────────
    // THREE CHECKS, in the order a reader meets them after the click, which
    // is the whole reason they are numbered: the licence decides whether the
    // account can exist, the terms decide what the bonus costs, and the
    // cashier decides whether any of it comes back. Numbering a set that is
    // not ordered is decoration; numbering this one is information.
    //
    // The mockup's own three steps are DEPOSIT / PLAY / WITHDRAW, each
    // describing a funded account and a timed withdrawal. See the note at the
    // top of this file: none of that ships. These are the three reads that
    // produce the same three answers from pages anyone can open.
    methodTitle: 'How we review',
    methodSubtitle: 'Three checks, in the order you will meet them on the other side of the link.',
    methodSteps: [
      {
        no: '01',
        verb: 'Licence',
        title: 'Whether you can be there at all',
        body:
          'The regulator named in the operator’s footer, checked against that regulator’s own public register, and the list of countries the operator itself says it accepts. This is first because it is the only check that can end the matter: an account opened from a country the terms exclude can be closed on withdrawal, with the balance forfeited, and every operator reserves that right in writing.',
      },
      {
        no: '02',
        verb: 'Terms',
        title: 'What the bonus asks for in return',
        body:
          'The wagering multiplier and exactly what it is applied to — the bonus, or the bonus and the deposit together, which is the same headline at twice the cost. Then the maximum stake allowed while clearing, the games that count and at what weighting, and the expiry. All of it from the bonus terms rather than the banner, and where the two disagree, the terms are what gets recorded.',
      },
      {
        no: '03',
        verb: 'Cashier',
        title: 'How the money comes back out',
        body:
          'The withdrawal methods an operator publishes, the minimum and maximum it will process, any weekly or monthly cap, the processing window it states, and the point at which identity documents are demanded. We do not time a payout and we do not print one — what we read is what the operator has committed to in writing, which is the thing you could hold it to.',
      },
    ],
    // NOT 'How we review': that is `methodTitle`, and the kicker printing the
    // heading again two lines above it is a second name for the section that
    // happens to be the same name.
    methodLabel: 'The three checks',
    // Under the three checks: the one thing left to say before the link, and
    // the reason this site puts it here rather than in a policy page.
    methodLoop: 'And one more thing, before any link: we earn a commission when you join through one. It pays for the reading. It does not buy a position, and no operator sees a ranking before you do.',
    // ── What one review covers ────────────────────────────────────────────
    // The same three things the method and the FAQ name — no figure this site
    // does not hold. Kept in the shared key structure though this design has
    // no monitor panel; see the file header.
    monitorTitle: 'What a review covers',
    monitorStatus: 'Every row',
    monitorReads: [
      { label: '01 · Licence', text: 'The regulator, its register, and the countries accepted' },
      { label: '02 · Terms', text: 'Wagering and what it applies to, max stake, expiry' },
      { label: '03 · Cashier', text: 'Methods, caps, the stated window, when ID is asked for' },
    ],
    monitorNote: 'Lapsed bonuses come off the page. A position changes when an operator’s own pages do.',
    // The kickers over each section head.
    rankingLabel: 'The ranking',
    bonusTypesKicker: 'Bonus types',
    bonusesLabel: 'Offers',
    faqLabel: 'Questions',
  },
  casinos: {
    pageTitle: 'Every Casino We Rank',
    pageDescription:
      'The full ranking, each operator with the bonus it is currently running, the countries it says it accepts and where it places once its licence, terms and cashier have been read.',
    // H2 over the offers block on a casino page. The literal 'Special Offers'
    // was hardcoded in the component on all six sites — an identical H2 on
    // every review page in the network.
    offersHeading: 'Bonuses Running Here',
    // Tail of the summary-panel H2: `{casino.name} at a glance`.
    glanceHeadingTail: 'at a glance',
    moreHeading: 'Other Casinos In This Ranking',
    reviewTitleTail: 'Licence, Bonus Terms And Withdrawals',
    reviewSignature: 'Every figure on this page is quoted from this operator’s own terms, cashier and licence pages.',
    reviewSummary: 'with the three things worth knowing before the link — who it says it accepts, what its bonus asks for in return, and how the money comes back out — taken from the operator’s own pages rather than its banner.',
    // The chip on the leader's logo plate. A WORD, not a numeral: the list
    // order already is the ranking, and a "1" on a card carrying a 5.0 rating
    // invites being read as a second score. The mockup draws a 40px numeral;
    // see the note on `.ccard` in globals.css.
    topPick: 'Top pick',
    visitCasino: 'Go To Casino',
    readReview: 'Read Full Review',
    rating: 'Avant Score',
    noResults: 'No casinos match this filter yet.',
  },
  /**
   * The page behind one bonus type (/bonuses/[slug]).
   *
   * `metaSuffix` is appended to the type's name when the admin wrote no
   * description, so the meta line is still specific to the page rather than
   * boilerplate shared by eight of them.
   */
  bonusCategory: {
    metaSuffix: 'every bonus of this kind on the site, with whose offer it is and the figure the operator leads with — plus what that figure asks for in return.',
    countOne: 'offer',
    countMany: 'offers',
  },

  specialOffers: {
    pageTitle: 'All Bonus Offers',
    pageDescription:
      'Every bonus in one place, each with the casino behind it and the figure it leads with — and, wherever the operator states them, the wagering, the cap and the expiry that figure comes with.',
    // Appended to an offer's (shared) bonus text so the sibling sites do not
    // ship an identical meta description for the same offer.
    offerMetaSuffix: 'Read from the operator’s own bonus terms, not its banner.',
    claim: 'Claim Bonus',
    noResults: 'No bonuses to show right now.',
  },
  categories: {
    pageTitle: 'Casinos By Category',
    pageDescription: 'The same three checks behind every list — pick the category you came for.',
    // Meta-description tail for a single category page. Category records are
    // shared master data, so this is what keeps the sites distinct there.
    categoryMetaSuffix: 'ordered on what each operator publishes about its licence, its bonus terms and its cashier — stated in front of the link rather than after it.',
    noResults: 'Nothing in this category yet.',
  },
  newsletter: {
    title: 'The weekly casino brief.',
    subtitle: 'New casino reviews, the best bonuses we found, and ranking changes — one short email.',
    placeholder: 'you@example.com',
    button: 'Subscribe',
    // The two halves of the line in the HEADER STRIP — the mockup's own
    // newsletter band, which it puts directly under the header. The lead is
    // set as the heading and the tail as the line beneath it.
    barLead: 'The weekly casino brief.',
    barTail: 'New reviews, the bonuses worth a look, and any ranking that moved — one short email.',
    // The band above the footer — the site's second capture point, so its
    // heading is a real <h2> rather than the form's own label.
    bandKicker: 'The brief',
    bandTitle: 'One email a week, before you go looking.',
    bandSubtitle: 'New reviews, the bonuses we think are worth a second read, and the rankings that moved — short, and never more than once a week.',
    // Shown while the address is being checked. The subscribe request waits on
    // a live address-validation call, so the button has to say so rather than
    // just dimming for a second or two.
    checking: 'Checking…',
    // The spam line is NOT optional wording. This is a double opt-in list: an
    // unconfirmed subscriber never receives anything again, and the verify mail
    // is the single most likely message to be filtered — new sender, one link,
    // no history. Telling people where to look is the difference between a
    // signup and a dead row.
    success:
      'Nearly there — check your inbox and confirm your address to finish. '
      + 'If nothing arrives, it may be sitting in spam or junk.',
    // Shown when the API reports email_sent=false — the site is still
    // collecting addresses but its sending is switched off in the admin.
    // Promising an inbox (and a spam folder to search) for mail that will
    // never arrive is worse than not collecting the address at all.
    successNoEmail:
      'You’re on the list. We are not sending confirmation emails from this site at the moment.',
    error: 'That did not send. Please try again.',
  },
  footer: {
    // Short brand blurb in the footer's first column. The mockup gives that
    // column 1.6fr of a four-track grid — roughly 360px — so this runs to two
    // or three lines there by design.
    tagline:
      'Independent casino reviews and rankings, written from what each operator publishes about its licence, its bonus terms and its cashier. We earn a commission from links on this site; it never changes a score or a position.',
    // Registered postal address, shown beside the copyright line. A physical
    // address in the footer is what mailbox providers and the gambling
    // affiliate compliance checks both look for, and it must match the address
    // used in the email templates.
    //
    // Supplied 2026-11-24, and written to this site's `registered_address`
    // in the same change (`php artisan sites:set-legal-identity <slug>
    // --address=...`). THE TWO MUST STAY IDENTICAL: that column is what the
    // legal pages and the email templates print, and two different addresses
    // for one brand is a compliance problem, not a typo. The footer omits the
    // whole <address> element while this is blank.
    postalAddress: '67 Foxglove Close, Chester, CH2 3RT, United Kingdom',
    disclaimer:
      'Gambling is for adults aged 18 or over and carries real financial risk. Set deposit limits, never chase losses, and only stake what you can afford to lose.',
  },
  errors: {
    notFound: 'That page is not here.',
    apiError: 'Could not load this content. Please try again in a moment.',
  },
  reviews: {
    heading: 'What Players Report',
    empty: 'No reports yet — be the first to add one.',
    formTitle: 'Add Your Report',
    formIntro: 'Your report appears on this page as soon as you post it.',
    nameLabel: 'Your name',
    emailLabel: 'Email (optional, never published)',
    ratingLabel: 'Rating',
    titleLabel: 'Headline (optional)',
    bodyLabel: 'Your report',
    namePlaceholder: 'First name or nickname',
    emailPlaceholder: 'you@example.com',
    titlePlaceholder: 'One line on whether it matched the terms',
    bodyPlaceholder: 'What did the terms say, and did the operator stick to them?',
    submit: 'Post Report',
    // Two outcomes, because the site can run pre- or post-moderation
    // (Sites -> Publish reviews immediately). The API reports which one
    // applied; promising the wrong one is a promise the page then breaks.
    success: 'Thanks — your report is now live. Scroll up to see it.',
    successPending: 'Thanks — your report has been submitted and will appear once approved.',
    error: 'That did not send. Please check the form and try again.',
    ratingSummary: (avg: number, total: number) =>
      `${avg.toFixed(1)} out of 5 from ${total} ${total === 1 ? 'report' : 'reports'}`,
  },
  // Labels on the phone-only hide / show toggle above each chip list.
  collapse: {
    casinoCategories: 'Casino categories',
    bonusTypes: 'Bonus types',
  },
} as const
