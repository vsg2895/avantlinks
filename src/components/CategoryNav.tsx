import Link from 'next/link'
import { resolveImageUrl } from '@/lib/images'
import type { Category } from '@shared/types/category'

/**
 * AvantLinks category tabs, from sites/avantlinks.html (`.filters` / `.tab`):
 * a wrapped row of 999px PILLS — white with a control-weight edge — and the
 * current one filled SOLID INK with its count in the pale cyan.
 *
 * A pill, because on this site's radius ladder anything word-sized that stands
 * for a value is one: a tab is the name of a subset, exactly like a region
 * chip or an offer count. The ink fill is the strongest pair on the page
 * (17.23:1) and it is spent here deliberately — this is the one control that
 * changes what the list below it contains, so it has to be unmistakable which
 * one is on.
 *
 * The count inside the CURRENT tab takes #7FCAD2, and that is the only place
 * above the footer where this site's pale cyan appears. It works there for one
 * reason: it is on ink, where it measures 9.26:1. On white it is 1.44 and it
 * is never used.
 *
 * THEY WRAP, they do not scroll. Seven pills at ~150px wrap to two rows on a
 * laptop and four on a phone, all of them visible; a sideways-scrolling strip
 * would hide half the categories behind a gesture nobody is told about. The
 * mockup wraps them too (`.tabs{flex-wrap:wrap}`).
 *
 * THE MOCKUP'S COUNTRY SELECT IS NOT HERE. Its filter row opens with an "All
 * Countries" dropdown driven by a hard-coded `geo` field on each casino in its
 * demo data. The API has countries, but nothing scopes a casino LIST by one —
 * /countries/<slug> is its own page with its own rules — so a select here
 * would either do nothing or quietly filter on a field that does not mean what
 * its label says. The regions appear on each row instead, as chips, which is
 * where this site wants them anyway: in front of the link.
 *
 * The tabs NAVIGATE rather than filter in place: always the canonical
 * /categories/<slug> route. The query forms (`/?category=`,
 * `/casinos?category=`) are 301'd to it at the edge (lib/seo/redirects.ts), so
 * linking either would spend a redirect per visitor and crawl budget on URLs
 * that resolve elsewhere.
 */
export default function CategoryNav({
  categories,
  selected,
}: {
  categories: Category[]
  selected: string
}) {
  return (
    <nav aria-label="Casino categories" className="mb-6">
      <ul className="flex flex-wrap gap-2.5" role="list">
        {categories.map((c) => {
          const active = c.slug === selected
          return (
            <li key={c.id} className="flex">
              <Link
                href={`/categories/${c.slug}`}
                aria-current={active ? 'page' : undefined}
                className={`tab flex min-h-[46px] items-center gap-2 whitespace-nowrap px-[18px] text-[15px] font-semibold ${
                  active ? 'tab-on' : ''
                }`}
              >
                {/* The category's own icon, as in the Casinos menu. A plain <img>:
                    next/image refuses SVG. alt="" because the label names it. */}
                {c.logo_path && (
                  <img src={resolveImageUrl(c.logo_path)!} alt="" width={16} height={16} className="h-4 w-4 shrink-0" />
                )}
                <span>{c.name}</span>
                {typeof c.casinos_count === 'number' && (
                  /* The mockup's `.tab span`: the count beside the label at
                     12.5px. Both its colours live in globals.css beside
                     `.tab-on`, for the same layering reason the active tab
                     does — a `text-*` utility here would lose to the unlayered
                     `.tab` and win over nothing. */
                  <span className="tab-count text-[12.5px] tabular-nums">{c.casinos_count}</span>
                )}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
