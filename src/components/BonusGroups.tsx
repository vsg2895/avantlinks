import Link from 'next/link'
import { COPY } from '@/constants/copy'
import SpecialOfferCard, { OFFER_GRID } from '@/components/SpecialOfferCard'
import type { BonusSection } from '@/lib/api'

/**
 * The home page's Bonuses: one subhead per bonus type over a grid of that
 * type's offer cards.
 *
 * NO CARD AROUND A GROUP, which is where this differs from most of the
 * network — the siblings wrap each type in a card with a coloured head band.
 * It cannot work here: an offer is already a 20px card with a picture well in
 * it, and a card holding three of those would be a container of containers
 * with nothing left to say. The group is a subhead and a count, and the cards
 * beneath it are the group.
 *
 * The subhead is the display face at 22px with the count beside it in a pill
 * — the bottom rung of the radius ladder, where anything word-sized that
 * stands for a value is one, the same shape the bonus-type cells and the
 * region chips use. The link to the type's full page is pushed to the right
 * margin, which is where every "more" link on this site sits.
 *
 * The count is resolved server-side over the unlimited set, so it is the
 * number of offers of this kind on the whole site rather than the number of
 * cards under it.
 *
 * Every type's offers are in the server HTML, and each group keeps the
 * `#bonus-<slug>` anchor the bonus-type cells land on.
 */
export default function BonusGroups({ sections }: { sections: BonusSection[] }) {
  if (sections.length === 0) return null

  return (
    <div className="flex flex-col gap-12">
      {sections.map((section) => (
        <section
          key={section.id}
          id={`bonus-${section.slug}`}
          aria-labelledby={`bonus-${section.slug}-heading`}
          className="scroll-mt-28"
        >
          <div className="mb-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
            <h3 id={`bonus-${section.slug}-heading`} className="font-display flex min-w-0 items-center gap-3 text-[22px] text-ink sm:text-[24px]">
              <span className="[overflow-wrap:anywhere]">{section.name}</span>
              <span className="sr-only">
                {' '}— {section.offers_count} {section.offers_count === 1 ? COPY.bonusCategory.countOne : COPY.bonusCategory.countMany}
              </span>
              {/* The count pill — the mockup's `.btype .ct`, reused here so the
                  same figure looks the same in both places it appears. */}
              <span aria-hidden className="btype-ct flex-none px-[9px] py-[3px] text-[12.5px] font-bold tabular-nums">
                {section.offers_count}
              </span>
            </h3>
            <Link
              href={`/bonuses/${section.slug}`}
              className="inline-flex min-h-11 flex-none items-center text-[15px] font-bold text-brand transition-colors hover:text-brand-dark"
            >
              {COPY.home.seeMore}<span className="sr-only"> {section.name}</span> <span aria-hidden className="ml-1.5">→</span>
            </Link>
          </div>
          {section.description && <p className="mb-5 max-w-[640px] text-[15.5px] text-ink-soft">{section.description}</p>}
          <div className={OFFER_GRID}>
            {section.offers.map((offer) => (
              <SpecialOfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
