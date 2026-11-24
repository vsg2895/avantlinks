import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getBonusArea, getCategories, getCategory, getSpecialOffers } from '@/lib/api'
import type { BonusSection } from '@/lib/api'
import { buildItemListSchema, buildWebPageSchema, jsonLdScript, buildFaqSchema, SHARE_IMAGES } from '@/lib/seo'
import { COPY } from '@/constants/copy'
import { FAQ_ITEMS } from '@/constants/faq'
import CasinoCard, { CASINO_LIST, Stars } from '@/components/CasinoCard'
import BonusCategoryNav from '@/components/BonusCategoryNav'
import BonusGroups from '@/components/BonusGroups'
import CategoryNav from '@/components/CategoryNav'
import FaqAccordion from '@/components/FaqAccordion'
import SpecialOfferCard, { OFFER_GRID } from '@/components/SpecialOfferCard'
import type { Category } from '@shared/types/category'
import type { CasinoWithAttachment } from '@shared/types/casino'
import type { SpecialOffer } from '@shared/types/specialOffer'
import { SITE_URL } from '@/lib/config'
import { casinosHeading } from '@/lib/categories'

/** Offers shown per bonus type in the home page's Bonuses section — one row. */
const HOME_BONUSES_PER_CATEGORY = 3

/** The page's own width, and the mockup's: `.wrap{max-width:1160px}`, opening
 *  to 1240 at 1440px, with a 20px gutter. Declared once because eight sections
 *  share it and a single stray value shows as a column that does not line up
 *  with the one above it. */
const WRAP = 'mx-auto w-full max-w-[1160px] px-5 min-[90rem]:max-w-[1240px]'

/**
 * Splits a sentence around one phrase so the page can set that phrase under
 * the pale teal HIGHLIGHT BAR — the mockup's `<em>` in the hero headline,
 * drawn by `.hl` in globals.css.
 *
 * The phrase is named in COPY rather than marked up there, so the sentence
 * stays plain text and can go straight into a <title> or a JSON-LD field with
 * no tags to strip. If the phrase ever stops matching the sentence (an edit to
 * one and not the other), this returns the sentence whole and it simply
 * renders unmarked — a missing highlight, not a broken paragraph.
 */
function splitOnPhrase(text: string, phrase: string): [string, string, string] {
  const at = phrase ? text.indexOf(phrase) : -1
  if (at === -1) return [text, '', '']
  return [text.slice(0, at), phrase, text.slice(at + phrase.length)]
}

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? ''
const YEAR = new Date().getFullYear()

type Props = { searchParams: Promise<{ category?: string; page?: string }> }

// Resolve the selected category (default = first/highest-priority) for the home casinos section.
async function resolveCategory(searchParams: Props['searchParams']) {
  const sp = await searchParams
  const categories = (await getCategories()).data
  const selected =
    sp.category && categories.some((c) => c.slug === sp.category) ? sp.category : categories[0]?.slug
  return { categories: categories as Category[], selected }
}

export async function generateMetadata(): Promise<Metadata> {
  const title = `${COPY.home.homeTitle} ${YEAR} | ${SITE_NAME}`
  const description = COPY.home.metaDescription
  return {
    title,
    description,
    alternates: { canonical: '/' },
    openGraph: { type: 'website', url: '/', siteName: SITE_NAME, title, description, images: SHARE_IMAGES },
    twitter: { card: 'summary_large_image', title, description, images: SHARE_IMAGES },
  }
}

export default async function HomePage({ searchParams }: Props) {
  /*
   * THE HOME PAGE HAS ONE PAGE, so `?page=2` is a page past the end.
   *
   * Nothing here is paginated (the full list is /casinos), yet `/?page=2` and
   * every other number a crawler guessed answered 200 with the whole home page
   * and an `index` robots tag: a duplicate of `/` at a URL of its own. A 404
   * says it is not a page at all, the rule every paginated listing here applies
   * past its last page. `?page=1` never reaches this: proxy.ts 301s it to `/`.
   */
  if (Math.max(1, Number((await searchParams).page) || 1) > 1) notFound()

  const { categories, selected } = await resolveCategory(searchParams)

  const [categoryRes, offersRes, anyOffersRes, bonusRes] = await Promise.allSettled([
    selected ? getCategory(selected) : Promise.resolve(null),
    getSpecialOffers(selected, 6),
    // Site-wide, unfiltered, limit 1 — just "does a visible offer exist at all?".
    // Runs alongside the others, so it costs no extra round-trip of latency, and
    // the public endpoint already excludes offers whose visibility is off.
    getSpecialOffers(undefined, 1),
    // The bonus TYPES: the chip row under the hero AND the per-type Bonuses
    // section further down, so each type brings its first
    // HOME_BONUSES_PER_CATEGORY offers (one full row of the three-up grid).
    // The chips only read names, marks and counts, which the server counts
    // over the unlimited set. allSettled means a site without the Bonus area
    // renders neither, and falls back to the plain Special offers grid.
    getBonusArea(HOME_BONUSES_PER_CATEGORY),
  ])

  // Empty when the site does not publish the Bonus area, or when the
  // request failed — the strip renders nothing either way.
  const bonusSections: BonusSection[] = bonusRes.status === 'fulfilled' ? bonusRes.value : []

  const catData =
    categoryRes.status === 'fulfilled' && categoryRes.value ? categoryRes.value.data : null
  const casinos: CasinoWithAttachment[] = catData?.casinos ?? []
  const activeCategory = catData?.category ?? null
  // "See More" is only an affordance when there is actually more: compare the
  // category's full count against the rows this page received, rather than
  // hard-coding the page size on both sides where the two could drift apart.
  const hasMoreCasinos = (catData?.meta?.total ?? 0) > casinos.length
  // Offers are already scoped to the selected category and capped by the backend (?category=&limit=).
  const topOffers: SpecialOffer[] = offersRes.status === 'fulfilled' ? offersRes.value.data : []

  // Whether ANY special offer is visible on this site. Drives the hero CTA:
  // a button leading to an empty page is worse than no button. On a failed
  // request this stays false, so the CTA hides rather than promising content
  // that may not be there.
  const anyOffersVisible: boolean =
    anyOffersRes.status === 'fulfilled' && anyOffersRes.value.data.length > 0

  // Organization schema is emitted site-wide from the root layout; the home
  // page only adds its page-specific ItemList of top casinos.
  //
  // The list is the SELECTED category, not the whole catalogue, so it is named
  // and addressed as that category — it previously claimed the generic name
  // "Top Casinos at <brand>" and pointed at /casinos, describing neither the
  // rows below it nor a URL that renders them.
  const listSchema = buildItemListSchema(
    activeCategory ? `${activeCategory.name} — ${COPY.home.topCasinosTitle}` : COPY.home.topCasinosTitle,
    selected ? `${SITE_URL}/categories/${selected}` : `${SITE_URL}/casinos`,
    casinos.map((c, i) => ({ position: i + 1, name: c.name, url: `${SITE_URL}/casinos/${c.slug}` })),
  )

  const graph = [
    buildWebPageSchema({
      // Mirrors the actual <title>. The previous "Best Online Casinos <year>"
      // was generic boilerplate shipped identically by the sibling domains and
      // matched neither this page's title nor its H1.
      name: `${COPY.home.homeTitle} ${YEAR}`,
      url: SITE_URL,
      description: COPY.home.metaDescription,
    }),
    listSchema,
    // Same array the section below renders — markup-only FAQ is a violation.
    buildFaqSchema(SITE_URL, FAQ_ITEMS),
  ]

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(graph) }} />

      <main>
        {/* THE HERO — the mockup's `.hero`: CENTRED, full width, standing on
            the page ground itself with no slab, no panel and no card beside
            it. An eyebrow pill with the one beating dot on the site, the
            claim with its key phrase under a pale teal bar, the deck, two
            buttons, and the commission disclosure.

            Centred and unaccompanied, which is the mockup's own layout and
            where this site parts company with most of its siblings — they put
            the top three on a card beside the claim. It cannot be done here:
            a centred headline with a panel to one side of it is not centred,
            it is a two-column hero pretending. The top three get a strip of
            their own directly underneath, in the slot the mockup leaves empty
            between its hero and its bonus types.

            `overflow-hidden` is on the section because the hatch band is
            drawn wider than the page to keep its faded ends off screen. */}
        <section className="relative overflow-hidden pb-14 pt-[52px] text-center sm:pt-[72px]" aria-labelledby="hero-headline">
          {/* THE FORWARD HATCH — the mockup's `.hero-pulse`, which it leaves
              empty. See `.hatch` in globals.css: the logo's rising stroke
              repeated across a 120px band through the middle of the hero, at
              12%, masked out at both ends so the band has no edge of its own.
              `aria-hidden` and `pointer-events-none`: it is texture.

              HIDDEN BELOW `sm`. On a desktop the band falls in the open space
              either side of a centred headline, which is the whole idea. On a
              phone the hero is one column of text from edge to edge with no
              open space anywhere in it, so the band lands squarely behind the
              deck — and diagonal lines running through a paragraph are not
              texture, they are something wrong with the page. */}
          <span
            aria-hidden
            className="hatch pointer-events-none absolute inset-x-0 top-1/2 hidden h-[120px] -translate-y-1/2 sm:block"
          />

          <div className={`${WRAP} relative`}>
            <span className="eyebrow lbl inline-flex items-center gap-2.5 rounded-full border border-line bg-paper px-[18px] py-2 text-[12.5px] tracking-[0.18em] text-ink-soft">
              {/* The beat. `aria-hidden` — it is a live indicator for the eye
                  and says nothing the words beside it do not. */}
              <span aria-hidden className="beat h-2 w-2 flex-none" />
              {COPY.home.heroEyebrow}
            </span>

            <h1
              id="hero-headline"
              className="font-display mx-auto mb-[22px] mt-[26px] max-w-[960px] text-[clamp(40px,7vw,84px)] text-balance text-ink"
            >
              {COPY.home.heroHeadline}{' '}
              {/* `.hl` draws the pale teal bar BEHIND the words at
                  `z-index: -1`, so the phrase sits on the bar rather than in
                  a box. The bar is 0.12em tall, which tracks the type from
                  40px on a phone to 84px on a desktop instead of being a
                  fixed rule that looks heavy at one end and thin at the
                  other. Teal on the pale teal is 7.28:1. */}
              <em className="hl">{COPY.home.heroHighlight}</em>
              {COPY.home.heroHeadlineTail}
            </h1>

            <p className="mx-auto mb-[34px] max-w-[680px] text-[clamp(17px,2vw,20px)] text-ink-soft">
              {(() => {
                const [before, mark, after] = splitOnPhrase(COPY.home.heroSubtitle, COPY.home.heroSubtitleMark)
                return mark ? (
                  <>
                    {before}
                    <b className="font-semibold text-ink">{mark}</b>
                    {after}
                  </>
                ) : (
                  COPY.home.heroSubtitle
                )
              })()}
            </p>

            <div className="flex flex-wrap justify-center gap-3.5">
              <Link href="/casinos" className="btn-or min-h-[52px] px-[26px] text-[15.5px]">
                {COPY.home.featuredCasinos}
              </Link>
              {anyOffersVisible && (
                <Link href="/special-offers" className="btn-ln min-h-[52px] px-[26px] text-[15.5px]">
                  {COPY.home.specialOffers}
                </Link>
              )}
            </div>

            {/* THE DISCLOSURE, above the fold, which is the point of putting
                it here rather than in a policy page. A site named after its
                links owes a reader this before the first one, and the
                mockup's own footer prints it in 14px grey at the very bottom
                of the page. It is repeated under the three checks and again
                in the FAQ: three times is not too many for the one fact a
                reader has most reason to want. */}
            <p className="mx-auto mt-[30px] flex max-w-[680px] flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-[14px] text-muted">
              <b className="font-semibold text-ink">{COPY.home.heroBylineName}</b>
              <span aria-hidden>·</span>
              <span>{COPY.home.heroBylineNote}</span>
            </p>
          </div>
        </section>

        {/* THE TOP THREE — a white strip of three cells parted by VERTICAL
            HAIRLINES, in the slot the mockup leaves empty between its hero
            and its bonus types.

            A strip rather than the siblings' podium card, and it is the one
            element on the site that is neither a card in a grid nor a row: it
            is one card divided into three, which is what says these three are
            one set rather than the first three of a list. The rules are drawn
            on each cell's LEFT with `first:border-l-0`, so the strip opens on
            a name rather than on a line, and they switch to TOP rules when
            the three stack below `sm`.

            The kicker on each cell is the REGIONS, not the category. This
            list is the top three OF THE SELECTED category, so a category
            kicker would be identical on all three cells by construction —
            three copies of "MOST POPULAR" stacked, which is noise dressed as
            information. The regions differ per cell and are the first thing
            this site thinks a reader should read. Falls back to the section
            label when an operator has no regions recorded. */}
        {casinos.length >= 3 && (
          <section className={WRAP} aria-labelledby="top-three-heading">
            <h2 id="top-three-heading" className="sr-only">
              {COPY.home.podiumTitle} — {COPY.home.podiumSubtitle}
            </h2>
            <ol className="grid grid-cols-1 overflow-hidden rounded-[var(--radius-card)] border border-line bg-paper sm:grid-cols-3">
              {casinos.slice(0, 3).map((c) => (
                <li key={c.id} className="flex border-t border-line first:border-t-0 sm:border-l sm:border-t-0 sm:first:border-l-0">
                  <Link href={`/casinos/${c.slug}`} className="pick group flex w-full flex-col gap-1.5 border-0 px-5 py-[18px]">
                    <span className="lbl block truncate text-[11.5px] text-brand">
                      {(c.countries ?? []).length > 0
                        ? (c.countries ?? []).slice(0, 2).map((x) => x.name).join(' · ')
                        : COPY.home.rankingLabel}
                    </span>
                    <b className="pick-name font-display block text-[20px] text-ink [overflow-wrap:anywhere]">
                      {c.name}
                    </b>
                    <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <Stars rating={c.rating} />
                      <span aria-hidden className="text-[13.5px] font-semibold text-muted tabular-nums">
                        {COPY.home.podiumRatingLabel} {c.rating.toFixed(1)} / 5
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* 1 — the ranking. Category tabs, then the handover rows.
            `id="casinos"` because the hero's primary button points here. */}
        <section id="casinos" className="scroll-mt-24 pt-14 sm:pt-[72px]" aria-labelledby="top-casinos-heading">
          <div className={WRAP}>
            <SectionHead
              id="top-casinos-heading"
              eyebrow={COPY.home.rankingLabel}
              title={COPY.home.topCasinosTitle}
              subtitle={COPY.home.topCasinosSubtitle}
              more={casinos.length > 0 ? { href: '/casinos', label: COPY.home.viewAll, sr: ' casinos' } : undefined}
            />

            {categories.length > 0 && selected && (
              <CategoryNav categories={categories} selected={selected} />
            )}

            {casinos.length === 0 ? (
              /* The mockup's `.empty`: a DASHED white box, which is the one
                 dashed edge on the site and is exactly right for a container
                 holding nothing — it reads as a placeholder rather than as a
                 card that happens to be blank. */
              <p className="rounded-[var(--radius-card)] border border-dashed border-line-strong bg-paper p-10 text-center text-[16px] text-muted">
                {COPY.casinos.noResults}
              </p>
            ) : (
              <ol className={CASINO_LIST}>
                {casinos.map((casino, i) => (
                  <CasinoCard key={casino.id} casino={casino} rank={i + 1} />
                ))}
              </ol>
            )}

            {activeCategory && hasMoreCasinos && (
              <div className="mt-7 flex justify-center">
                <Link href={`/categories/${selected}`} className="btn-ln min-h-[52px] px-[26px] text-[15.5px]">
                  See more casinos<span className="sr-only"> — {casinosHeading(activeCategory.name)}</span> <span aria-hidden>→</span>
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* 2 — the bonus types, as ONE WHITE PANEL of cells.

            BELOW the casino list, not above it, which is where the mockup
            draws it. Its own hero button points at `#casinos`, and with the
            panel in front of that anchor the primary call to action scrolls
            the reader past a block they did not ask for. It is also where
            every other site in this network puts this block, so a reader
            moving between two of them finds it in the same place.

            Nothing at all without a Bonus area. */}
        {bonusSections.length > 0 && (
          <section className="pt-14 sm:pt-[72px]" aria-labelledby="bonus-types-heading">
            <div className={WRAP}>
              <SectionHead id="bonus-types-heading" eyebrow={COPY.home.bonusTypesKicker} title={COPY.home.bonusTypesTitle} />
              <BonusCategoryNav sections={bonusSections} />
            </div>
          </section>
        )}

        {/* 3 — the offers, as cards grouped by type. */}
        {bonusSections.length > 0 ? (
          <section className="pt-14 sm:pt-[72px]" aria-labelledby="bonus-heading">
            <div className={WRAP}>
              <SectionHead
                id="bonus-heading"
                eyebrow={COPY.home.bonusesLabel}
                title={COPY.home.bonus}
                subtitle={COPY.home.bonusesSubtitle}
                more={{ href: '/special-offers', label: COPY.home.seeAllBonuses, sr: '' }}
              />
              <BonusGroups sections={bonusSections} />
            </div>
          </section>
        ) : topOffers.length > 0 && (
          <section className="pt-14 sm:pt-[72px]" aria-labelledby="offers-heading">
            <div className={WRAP}>
              <SectionHead
                id="offers-heading"
                eyebrow={COPY.home.bonusesLabel}
                title={COPY.home.specialOffers}
                more={{ href: '/special-offers', label: COPY.home.viewAll, sr: ' special offers' }}
              />
              <div className={OFFER_GRID}>
                {topOffers.map((offer) => (
                  <SpecialOfferCard key={offer.id} offer={offer} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 4 — HOW WE REVIEW. The mockup's `.steps`: three white cards, each
            led by its number and a VERB in tracked teal capitals.

            The three verbs are LICENCE, TERMS and CASHIER, not the mockup's
            DEPOSIT, PLAY and WITHDRAW. Its own three describe funding a live
            account, playing through a bonus and timing a payout; nothing in
            this project records any of that, and a review site inventing its
            own test results is the one failure that cannot be walked back.
            These three are the reads that answer the same questions from
            pages anyone can open — and they are in the order a reader meets
            them on the other side of the link, which is what this whole site
            is about. */}
        <section className="pt-14 sm:pt-[72px]" aria-labelledby="method-heading">
          <div className={WRAP}>
            <SectionHead id="method-heading" eyebrow={COPY.home.methodLabel} title={COPY.home.methodTitle} subtitle={COPY.home.methodSubtitle} />
            <ol className="grid grid-cols-1 gap-3.5 sm:grid-cols-[repeat(auto-fit,minmax(240px,1fr))]">
              {COPY.home.methodSteps.map((step) => (
                <li key={step.no} className="step p-6 sm:p-[26px]">
                  <p className="lbl text-[13px] tracking-[0.08em] text-brand">
                    {step.no} <span aria-hidden>—</span> {step.verb}
                  </p>
                  <h3 className="font-display mb-2 mt-2.5 text-[22px] text-ink">{step.title}</h3>
                  <p className="text-[15.5px] leading-[1.6] text-ink-soft">{step.body}</p>
                </li>
              ))}
            </ol>

            {/* The disclosure again, and here it is the fourth step in all but
                name: the three above say what gets read, and this says who
                pays for the reading. On the pale teal panel — the one tinted
                ground this design has — because it is the only line in the
                section a reader might otherwise skim past. */}
            <p className="deep-panel mt-3.5 flex items-start gap-3.5 px-5 py-4 text-[15.5px] font-semibold">
              <svg aria-hidden width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0">
                <path d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
              <span>{COPY.home.methodLoop}</span>
            </p>
          </div>
        </section>

        {/* 5 — the FAQ. Every answer is in the HTML, open or closed, which
            the FAQPage schema requires. */}
        <section className="pt-14 sm:pt-[72px]" aria-labelledby="faq-heading">
          {/* NARROWER than every other section — the mockup's `.narrow`, 780px.
              An answer here is a paragraph at 16.5px, and a paragraph that
              runs the full 1160px is past the ~75-character measure where a
              reader starts losing the start of the next line. */}
          <div className="mx-auto w-full max-w-[780px] px-5">
            <SectionHead id="faq-heading" eyebrow={COPY.home.faqLabel} title={COPY.home.faqTitle} subtitle={COPY.home.faqSubtitle} />
            <FaqAccordion items={FAQ_ITEMS} />
          </div>
        </section>
      </main>
    </>
  )
}

/**
 * The mockup's `.sec-head`: a KICKER in tracked teal capitals, the heading
 * under it, a standfirst beneath that, and an optional link to the full list
 * pushed to the right margin and aligned with the bottom of the block.
 *
 * NO RULE, no band and no background — which is this site's whole approach to
 * structure: the cards below a heading are what say where a section begins,
 * and a line drawn under the name as well would be saying it twice. It is
 * also the one thing that keeps eight sections on one page from reading as
 * eight separate pages stacked.
 *
 * THE HEADING IS PLAIN INK, all of it. No word of it is tinted and none of it
 * is italic: this site has exactly one typographic highlight, the pale teal
 * bar in the hero, and spending the same gesture on every section head would
 * make it furniture rather than emphasis.
 *
 * `flex-[1_1_28rem]` on the text block and `flex-none` on the link, and both
 * are load-bearing. `flex-wrap` breaks lines on each item's HYPOTHETICAL size
 * — its flex-basis, which for an unconstrained block is its max-content width
 * — not on its min-content width. A 46px heading's max-content width runs to
 * well over 1000px, so with `auto` basis the pair wrapped at every viewport
 * and the "View all" link landed on its own line at the LEFT margin, under
 * the standfirst. A 28rem basis is what lets the two share a row until they
 * genuinely cannot.
 *
 * The kicker is `aria-hidden`. It is a second, shorter name for the same
 * section — "The ranking" over "Top Rated Casinos" — and announcing both
 * would read the heading twice.
 *
 * A local component rather than one in components/: every site in the network
 * heads its sections differently, and this shape is this design's own. Nothing
 * else renders it, so it lives where it is used.
 */
function SectionHead({
  id,
  eyebrow,
  title,
  subtitle,
  more,
}: {
  id: string
  eyebrow?: string
  title: string
  subtitle?: string
  more?: { href: string; label: string; sr: string }
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-x-4 gap-y-3">
      <div className="min-w-0 flex-[1_1_28rem]">
        {eyebrow && (
          <span aria-hidden className="lbl mb-2.5 block text-[12.5px] text-brand">
            {eyebrow}
          </span>
        )}
        <h2 id={id} className="font-display text-[clamp(30px,4vw,46px)] text-balance text-ink">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2 max-w-[640px] text-[17px] text-ink-soft">{subtitle}</p>
        )}
      </div>
      {more && (
        <Link href={more.href} className="inline-flex min-h-11 flex-none items-center gap-1.5 text-[15px] font-bold text-brand transition-colors hover:text-brand-dark">
          {more.label}{more.sr && <span className="sr-only">{more.sr}</span>} <span aria-hidden>→</span>
        </Link>
      )}
    </div>
  )
}
