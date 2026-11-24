import Image from 'next/image'
import Link from 'next/link'
import { resolveImageUrl } from '@/lib/images'
import { COPY } from '@/constants/copy'
import type { CasinoWithAttachment } from '@shared/types/casino'

/** How many regions a row names before collapsing the rest into a count. */
const REGIONS_SHOWN = 3

/**
 * Exported so the top-three list shows the same stars a row does.
 *
 * `--color-gold` is #8A5A00, A BRONZE, not the mockup's #E3A21A. That amber is
 * 1.71:1 on this page and 2.22 on a card: at those ratios a filled star and an
 * empty one are the same pale smear, and deepening it a little would not fix
 * it. The bronze measures 4.55 / 5.93, and the exact figure is printed beside
 * the stars everywhere they appear, so the colour is never the only carrier.
 */
export function Stars({ rating, onDark = false }: { rating: number; onDark?: boolean }) {
  // `Math.round` rather than a partial star: the ratings are whole or half
  // numbers and a half-filled glyph at 18px reads as a rendering fault.
  const filled = Math.round(rating)
  const on = onDark ? 'text-night-accent' : 'text-gold'
  const off = onDark ? 'text-night-line' : 'text-line'

  return (
    <span
      className="inline-flex items-center tracking-[2px] text-[18px] leading-none"
      role="img"
      aria-label={`${rating} out of 5`}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < filled ? on : off} aria-hidden>
          ★
        </span>
      ))}
    </span>
  )
}

/**
 * The list the rows sit in — the mockup's `.list`: ONE COLUMN at every width,
 * with a 14px gap. Callers render `<ol className={CASINO_LIST}>`; the order of
 * the list is the ranking.
 *
 * One column is the whole point of this layout and it is what no sibling does:
 * the row is the widest element on the site, and the reason it is wide is that
 * the two links live at its far right edge with every fact a reader should
 * have before pressing one laid out to their left. Put two of these side by
 * side and the plate, the facts and the actions all have to shrink until the
 * row is a card — which is what every other site in this network already is.
 */
export const CASINO_LIST = 'grid grid-cols-1 gap-3.5'

/**
 * A casino as THE HANDOVER ROW — `.ccard` in sites/avantlinks.html.
 *
 * A white card on the 8px structural rung of this site's radius ladder (the
 * squarest thing on the page, because it is the most structural), laid out
 * left to right as: the logo plate, the facts, and then the two links in a
 * column of their own at the right margin.
 *
 * THAT ORDER IS THE SITE'S ARGUMENT. This page is the last one before an
 * operator's own, so everything to the LEFT of those buttons is what a reader
 * should already know by the time they press one: who the operator says it
 * accepts (the region chips), what it is offering (the bonus), and how it
 * places (the rating, with the figure printed beside the stars). The actions
 * are last in the row because they are last in the sequence.
 *
 * THE GRID, at the mockup's own breakpoints:
 *   ≥1024px  180px logo · 1fr facts · auto actions  — one line
 *   ≥640px   140px logo · 1fr facts, actions spanning the full width in two
 *   <640px   one column: plate, facts, actions, each full width
 *
 * THE LOGO COLUMN IS A FIXED WIDTH, never `auto`. Operator artwork runs from
 * square to wide banner, and an `auto` track sizes itself to whatever each
 * file happens to be: one row renders an 84px logo and the next 173px,
 * squeezing that row's name into what is left. `object-contain` letterboxes
 * both inside the same plate.
 *
 * THE MOCKUP'S 40px RANK NUMERAL IS NOT SHIPPED. The `<ol>` order is the
 * ranking on every site in this network, and a "1" beside a 5.0 rating invites
 * being read as a second score. The leader takes a chip on its plate instead,
 * driven by `rank === 1` rather than `:first-child`, so page 2 of /casinos
 * does not crown its own first row.
 *
 * ITS "Payout: Under 1 hour" CHIP IS NOT SHIPPED EITHER. There is no payout
 * column in this project and this site has promised not to invent one. The
 * chips carry the REGIONS, which are real and which — on a site about what
 * you should know before the click — are the single most consequential fact
 * on the row: an account opened from an excluded country can be closed on
 * withdrawal.
 */
export default function CasinoCard({
  casino,
  rank,
}: {
  casino: CasinoWithAttachment
  rank?: number
}) {
  // The casino's "Image" (logo), NOT the wide "Banner Image" used big on the
  // casino page. Falls back to the banner if there is no Image.
  const image = resolveImageUrl(casino.image_path ?? casino.banner_image)

  const regions = casino.countries ?? []
  const shownRegions = regions.slice(0, REGIONS_SHOWN)
  const extraRegions = regions.length - shownRegions.length
  const isLeader = rank === 1

  return (
    <li>
      <article className="ccard grid grid-cols-1 items-center gap-x-6 gap-y-5 p-[18px] min-[40rem]:grid-cols-[140px_minmax(0,1fr)] min-[64rem]:grid-cols-[180px_minmax(0,1fr)_auto] min-[64rem]:px-6 min-[64rem]:py-[22px]">
        {/* THE PLATE. 110px tall at every width — the mockup's own figure —
            with the artwork letterboxed inside it, or the operator's name set
            in the display face when there is none. The leader's chip is pinned
            to its top-left corner. */}
        <div className="clogo relative grid h-[110px] place-items-center p-2.5">
          {image ? (
            <Image
              src={image}
              alt={`${casino.name} logo`}
              width={340}
              height={200}
              sizes="(min-width: 64rem) 180px, (min-width: 40rem) 140px, 92vw"
              className="max-h-[90px] w-full object-contain"
            />
          ) : (
            <span className="font-display text-center text-[clamp(15px,1.6vw,22px)] leading-[1.1] text-ink [overflow-wrap:anywhere]">
              {casino.name}
            </span>
          )}
          {isLeader && (
            <span className="flag lbl absolute left-1.5 top-1.5 px-2 py-[3px] text-[10.5px] tracking-[0.1em]">
              {COPY.casinos.topPick}
            </span>
          )}
        </div>

        {/* THE FACTS, in the order they decide the choice. */}
        <div className="min-w-0">
          <h3 className="cc-name font-display text-[24px] text-ink [overflow-wrap:anywhere] sm:text-[26px]">
            {/* `inline-flex min-h-11`: the name IS a way into the review, and
                at 26px its link box was 26px tall — well under the 44px tap
                target. A floor, not a fixed height, so a two-line operator
                name still grows the box instead of clipping it. */}
            <Link href={`/casinos/${casino.slug}`} className="inline-flex min-h-11 items-center">
              {casino.name}
            </Link>
          </h3>

          <p className="mt-0.5 flex flex-wrap items-center gap-x-2.5 gap-y-1">
            <Stars rating={casino.rating} />
            {/* The figure, always. The bronze clears 4.5:1 on a card, but a
                rating is the one place this design asks a colour to carry a
                VALUE, and a number beside it means the colour never has to. */}
            <span aria-hidden className="text-[15px] font-semibold text-muted tabular-nums">
              {casino.rating.toFixed(1)} / 5
            </span>
          </p>

          {casino.bonuses && (
            <p className="mt-2 text-[17.5px] font-bold text-brand [overflow-wrap:anywhere]">
              {casino.bonuses}
            </p>
          )}

          {/* THE REGION CHIPS — the mockup's `.chip` on `--good` / `--good-soft`,
              which measures 5.28:1 and ships as drawn. Pills, because on the
              radius ladder anything word-sized that stands for a value is one.
              The mint says this is a fact in the reader's favour: it is the
              list of places the operator itself says it accepts. */}
          {shownRegions.length > 0 && (
            <p className="mt-2.5 flex flex-wrap items-center gap-2">
              <span className="sr-only">Accepted countries: </span>
              {shownRegions.map((c) => (
                <span key={c.id} className="inline-flex items-center rounded-full bg-win-bg px-[11px] py-1 text-[13px] font-semibold text-win">
                  {c.name}
                </span>
              ))}
              {extraRegions > 0 && (
                <span className="inline-flex items-center rounded-full bg-surface px-[11px] py-1 text-[13px] font-semibold text-ink-soft">
                  +{extraRegions} more
                </span>
              )}
            </p>
          )}
        </div>

        {/* THE ACTIONS — the mockup's `.cact`: a 220px column at the right
            margin from 1024px, spanning the full row in two columns below
            that, and one per line on a phone.

            `btn-flat` on both: the row itself already borrows a shadow and a
            darker edge on hover, and a button lifting inside a card that is
            also reacting makes the card look loose. */}
        <div className="grid gap-2.5 min-[40rem]:col-span-full min-[40rem]:grid-cols-2 min-[64rem]:col-span-1 min-[64rem]:min-w-[220px] min-[64rem]:grid-cols-1">
          <a
            href={casino.attachment.affiliate_url}
            target="_blank"
            rel="nofollow sponsored noopener"
            className="btn-or btn-flat min-h-[46px] px-5 text-[15px]"
          >
            {COPY.casinos.visitCasino}
            <span className="sr-only"> — {casino.name}</span>
          </a>
          <Link href={`/casinos/${casino.slug}`} className="btn-ln btn-flat min-h-[46px] px-5 text-[15px]">
            {COPY.casinos.readReview}
            <span className="sr-only"> of {casino.name}</span>
          </Link>
        </div>
      </article>
    </li>
  )
}
