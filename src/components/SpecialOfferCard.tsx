import Image from 'next/image'
import Link from 'next/link'
import { resolveImageUrl } from '@/lib/images'
import { Stars } from '@/components/CasinoCard'
import { COPY } from '@/constants/copy'
import type { SpecialOffer } from '@shared/types/specialOffer'

/**
 * The bonus type whose cards carry a Claim button.
 *
 * WHY A TYPE AND NOT THE LINK. Claim used to appear on any offer that happened
 * to carry an affiliate URL, which made the card's primary action a property of
 * the data rather than an editorial decision: filing a bonus under "Free Spins"
 * or "Cashback" still produced a Claim button, because those offers have links
 * too. Claim now means one thing — this is a Special Offer — and whether the
 * offer has a link of its own no longer decides it.
 */
export const CLAIMABLE_BONUS_CATEGORY = 'special-offers'

/**
 * The grid the offer cards sit in — the mockup's `.offers`:
 * `minmax(min(100%,280px),1fr)` with a 22px gutter.
 *
 * `auto-fit` rather than `auto-fill` so a row holding one card gives it the
 * whole row instead of parking it beside two empty tracks.
 *
 * `offer-grid` stays in the class list: it is the hook the `:nth-child` cycles
 * in globals.css hang off on the sibling sites, and keeping the name means a
 * caller can be moved between sites unchanged.
 */
export const OFFER_GRID = 'offer-grid grid grid-cols-1 gap-[22px] sm:grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))]'

/** Up to two initials, for a casino with no logo artwork. */
function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

/**
 * An offer card for the listing grids — `.offer` in sites/avantlinks.html.
 *
 * A white card on the 20px CONTAINER rung of this site's radius ladder, and
 * the only element on it that earns that rung by holding three things each on
 * a rung of their own: a 16:7 picture well with no radius of its own (it is
 * clipped by the card), the bonus on a 6px panel, and a 12px button. It lifts
 * 3px into a TEAL blur on hover — the one coloured shadow on the site, spent
 * on the one card a reader is being invited to act on.
 *
 * THE ORDER INSIDE IT IS THE SITE'S ORDER: whose offer it is, what it is
 * called, the figure it leads with, how the operator places, and only then the
 * way in. The button is last because the decision is made above it.
 *
 * The picture well carries the offer's own artwork when there is any and the
 * teal gradient when there is not — never the mockup's "Offer banner 800×350"
 * placeholder text, which is a note to a designer rather than a thing to ship.
 *
 * `logo` is ACCEPTED AND USED: a casino page passes its own logo down because
 * the offers it lists arrive without their casino attached, and the well falls
 * back to it where the offer has no artwork of its own.
 */
export default function SpecialOfferCard({ offer, logo: logoOverride }: { offer: SpecialOffer; logo?: string | null }) {
  const casinoName = offer.casino?.name ?? ''
  const kind = offer.bonus_category_name ?? 'Bonus'
  const art = resolveImageUrl(offer.banner_image ?? offer.image_path) ?? logoOverride ?? null
  // Claim is a property of the bonus TYPE, not of whether a link happens
  // to be filled in. See CLAIMABLE_BONUS_CATEGORY.
  const claimable = offer.bonus_category_slug === CLAIMABLE_BONUS_CATEGORY

  return (
    <article className="offer flex flex-col">
      {/* THE PICTURE WELL — the mockup's `.oimg`: 16:7, the teal gradient with
          a lit corner, the artwork laid over it where there is any. No radius
          of its own: the card's 20px corner clips it, which is why the card
          carries `overflow: hidden`. */}
      <div className="oimg relative grid aspect-[16/7] place-items-center p-3">
        {art ? (
          /* `object-contain`, not the mockup's `cover`. Operator offer
             artwork is a wide banner with its own headline set into it, and
             cropping a 16:7 well out of it cut the first and last word off
             every card. Contained, the banner sits whole on the teal gradient,
             which is what the gradient is there for. */
          <Image
            src={art}
            alt=""
            fill
            sizes="(min-width: 40rem) 380px, 92vw"
            className="object-contain"
          />
        ) : (
          /* No artwork: the type's name, set small and tracked in white on the
             gradient (9.16:1 on the deep end of it), so the well still says
             what the card is rather than sitting empty. */
          <span className="lbl text-center text-[12.5px] tracking-[0.14em] text-white">{kind}</span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 px-[22px] pb-[22px] pt-5 sm:px-[26px]">
        {/* Whose offer it is — the mockup's `.by`, in the teal at 7.04:1. */}
        <p className="min-w-0 truncate text-[15.5px] font-bold text-brand">{casinoName || kind}</p>

        <h3 className="font-display text-[23px] text-ink [overflow-wrap:anywhere]">
          <Link href={`/special-offers/${offer.slug}`} className="after:absolute after:inset-0 after:content-['']">
            {offer.title}
          </Link>
        </h3>

        {/* THE FIGURE, on the one tinted panel this design has — the mockup's
            `.obar`: the pale teal with the DARK teal on it at 10.08:1. The 6px
            inner-plate rung. */}
        {offer.bonuses && (
          <p className="deep-panel px-4 py-3 text-[16.5px] font-bold [overflow-wrap:anywhere]">{offer.bonuses}</p>
        )}

        {/* THE RATING, only when there IS one. An offer whose rating has
            never been set comes back as 0, and five empty stars beside a
            "0.0 / 5" does not read as "unrated" — it reads as rated zero,
            which is a worse claim than saying nothing. The mockup prints five
            filled stars on every offer regardless; this prints the figure the
            record actually holds, or nothing. */}
        {offer.rating > 0 && (
          <p className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
            <Stars rating={offer.rating} />
            <span aria-hidden className="text-[14px] font-semibold text-muted tabular-nums">
              {offer.rating.toFixed(1)} / 5
            </span>
          </p>
        )}

        {/* The way in — the mockup's full-width `.btn-ghost .btn-sm` pinned to
            the foot of the card by `mt-auto`, so every card in a row ends its
            button on the same baseline whatever the title above it did.

            `relative z-10` lifts it over the heading's stretched link, or the
            card-wide hit area would swallow the control inside it. */}
        <div className="relative z-10 mt-auto pt-1">
          {claimable ? (
            offer.affiliate_url ? (
              <a href={offer.affiliate_url} target="_blank" rel="nofollow sponsored noopener" className="btn-or btn-flat min-h-[46px] w-full px-4 text-[15px]">
                {COPY.specialOffers.claim}
                <span className="sr-only"> — {offer.title}</span>
              </a>
            ) : (
              // No affiliate URL of its own: the offer's page is the only place
              // that can lead to the operator. An internal link, so no sponsored rel.
              <Link href={`/special-offers/${offer.slug}`} className="btn-or btn-flat min-h-[46px] w-full px-4 text-[15px]">
                {COPY.specialOffers.claim}
                <span className="sr-only"> — {offer.title}</span>
              </Link>
            )
          ) : (
            <Link href={`/special-offers/${offer.slug}`} className="btn-ln btn-flat min-h-[46px] w-full px-4 text-[15px]">
              Details
              <span className="sr-only"> — {offer.title}</span>
            </Link>
          )}
        </div>

        <p className="text-[12.5px] text-muted">T&amp;Cs apply · 18+</p>
      </div>
    </article>
  )
}

/**
 * An offer as a row inside a group: the logo, whose offer it is, its name and
 * amount, and on the right the way in. The whole row opens the offer (the
 * title link is stretched over it) and takes the page ground on hover.
 *
 * The SAME Claim rule as the card: Claim only for the Special Offers type —
 * to the casino when the offer has a link, to its own page when it has none.
 * Any other type shows "Details →".
 *
 * `heading` is the title's level: `h4` under a group card's `h3` (the home
 * page), `h3` where the rows sit straight under a section's `h2`.
 */
export function OfferRow({ offer, logo: logoOverride, heading: Heading = 'h4' }: { offer: SpecialOffer; logo?: string | null; heading?: 'h3' | 'h4' }) {
  const logo = logoOverride ?? resolveImageUrl(offer.casino?.image_path ?? offer.image_path)
  const claimable = offer.bonus_category_slug === CLAIMABLE_BONUS_CATEGORY
  const kicker = offer.casino?.name ?? offer.bonus_category_name ?? ''

  return (
    <li className="of relative grid grid-cols-[52px_minmax(0,1fr)] items-center gap-x-3.5 gap-y-2.5 border-b border-line px-4 py-3.5 last:border-b-0 sm:grid-cols-[52px_minmax(0,1fr)_auto] sm:px-5">
      {/* The plate stays WHITE: operator logos arrive with their own white
          ground baked in, and any other fill behind one shows as a hard
          rectangle inside the plate. 6px — the inner-plate rung. */}
      <span aria-hidden className="flex h-[52px] w-[52px] items-center justify-center overflow-hidden rounded-md border border-line bg-white p-1.5 text-xs font-bold text-ink">
        {logo ? (
          <Image src={logo} alt="" width={104} height={104} sizes="52px" className="h-full w-full object-contain" />
        ) : (
          initials(kicker || offer.title)
        )}
      </span>
      <div className="min-w-0">
        {kicker && <p className="text-[13px] font-bold text-brand">{kicker}</p>}
        <Heading className="font-display text-[17px] leading-[1.25] text-ink [overflow-wrap:anywhere]">
          <Link href={`/special-offers/${offer.slug}`} className="after:absolute after:inset-0 after:content-['']">
            {offer.title}
          </Link>
        </Heading>
        {offer.bonuses && <p className="text-[15px] font-semibold text-ink-soft [overflow-wrap:anywhere]">{offer.bonuses}</p>}
      </div>
      <div className="relative z-10 col-span-2 flex items-center justify-end gap-3 sm:col-span-1">
        {claimable ? (
          offer.affiliate_url ? (
            <a href={offer.affiliate_url} target="_blank" rel="nofollow sponsored noopener" className="btn-or btn-flat min-h-11 px-4 text-sm">Claim</a>
          ) : (
            // No affiliate URL of its own: the offer's page is the only place
            // that can lead to the operator. An internal link, so no sponsored rel.
            <Link href={`/special-offers/${offer.slug}`} className="btn-or btn-flat min-h-11 px-4 text-sm">Claim</Link>
          )
        ) : (
          <span aria-hidden className="inline-flex items-center text-[14px] font-semibold text-brand">Details →</span>
        )}
      </div>
    </li>
  )
}
