import Link from 'next/link'
import { resolveImageUrl } from '@/lib/images'
import { COPY } from '@/constants/copy'
import type { BonusSection } from '@/lib/api'

/**
 * The catch-all heading, which the mix deliberately leaves out.
 *
 * Every offer not filed under a real type lands under "Special Offers", so it
 * is not a type at all — it is the whole area, already reachable from the nav
 * and the offers page. Hidden here rather than in the admin: the admin's
 * "Shown" switch would also remove it from the menu and the sections.
 */
export const CATCH_ALL_SLUG = 'special-offers'

/**
 * "Bonuses by kind", from sites/avantlinks.html (`.btypes` / `.btype`): ONE
 * WHITE PANEL holding a grid of cells.
 *
 * The panel takes 24px — the top rung of this site's radius ladder, and the
 * only element that gets it, because it is the only element whose whole job is
 * to hold other elements. Inside it the cells take 6px, the inner-plate rung,
 * each with a 9px ink square for its icon and a 999px pill for its count: four
 * rungs of the ladder in one component, which is the clearest place on the
 * site to read the system off.
 *
 * A PANEL OF CELLS is also what none of the siblings does with this block —
 * they use a hairline grid (bigbrightday, bettingbetway), a wrapped row of
 * pills (affliliate, luckystreakly), a contents page with dotted leaders
 * (viglinksi, goodnewsdrop), coins (goldenspinhq) or scoreboard tiles
 * (netbetus). The set of bonus types is one thing with parts, and on this site
 * that is drawn as one container with cells in it.
 *
 * `line-strong` on each cell, NOT the mockup's hairline: a cell is a link and
 * its edge is what says where it starts. #C2CDCC is 1.63:1 on this panel;
 * #737F7E is 4.15.
 *
 * The icon square is the only place the INK is a fill above the footer, apart
 * from the current category tab and the leader's chip. All three mean the same
 * thing — this is the solid one — and there is nothing else it could be
 * confused with.
 *
 * This component renders NO HEADING. The section's head — its title and
 * kicker — is drawn by the page's own `SectionHead`, and a second <h2>
 * carrying the same id as that one is a duplicate id, not a heading.
 *
 * Each cell opens that type's own page. The counts are the SITE's — active,
 * claimable, owned by a casino attached here — resolved server-side. Renders
 * nothing when the site has no Bonus area or every type is empty.
 */
export default function BonusCategoryNav({ sections }: { sections: BonusSection[] }) {
  const types = sections.filter((section) => section.slug !== CATCH_ALL_SLUG)
  if (types.length === 0) return null

  return (
    <div className="btypes p-5 sm:p-6">
      <ul className="grid grid-cols-1 gap-3 min-[30rem]:grid-cols-[repeat(auto-fill,minmax(200px,1fr))]" role="list">
        {types.map((section) => (
          <li key={section.id} className="flex min-w-0">
            <Link href={`/bonuses/${section.slug}`} className="btype flex min-h-[60px] w-full items-center gap-3 px-4 py-3.5 text-[15px] font-semibold text-ink">
              {/* The icon — the mockup's `.ic`: a 32px square at the left of
                  every cell, as in the Bonus menu. A plain <img>: next/image
                  refuses SVG. alt="" because the label beside it names the
                  type.

                  THE INK PLATE IS DRAWN ONLY WHERE THERE IS NO UPLOADED MARK.
                  The admin's own type icons already arrive as coloured rounded
                  squares, so an ink plate behind one rendered as two nested
                  rounded squares in different colours — a plate inside a plate.
                  The fallback glyph has no ground of its own and needs one.

                  Either way the slot is 32px, which is what gives every cell
                  the same left edge: an icon on some rows and not others would
                  start the names at two different places down one column. */}
              <span
                aria-hidden
                className={`grid h-8 w-8 shrink-0 place-items-center overflow-hidden ${section.icon_path ? '' : 'btype-ic'}`}
              >
                {section.icon_path ? (
                  <img src={resolveImageUrl(section.icon_path)!} alt="" width={32} height={32} className="h-8 w-8 object-contain" />
                ) : (
                  <svg width="17" height="17" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <rect x="3" y="8" width="14" height="9" rx="1.5" />
                    <path d="M2 5h16v3H2zM10 5v12M10 5c-2-3-5-2-4 0M10 5c2-3 5-2 4 0" />
                  </svg>
                )}
              </span>
              <span className="min-w-0 flex-1 [overflow-wrap:anywhere]">{section.name}</span>
              <span className="btype-ct flex-none px-[9px] py-[3px] text-[12.5px] font-bold tabular-nums">
                {section.offers_count}
                <span className="sr-only"> {section.offers_count === 1 ? COPY.bonusCategory.countOne : COPY.bonusCategory.countMany}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
