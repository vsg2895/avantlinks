import type { Metadata, Viewport } from 'next'
import { Space_Grotesk, Inter_Tight } from 'next/font/google'
import Link from 'next/link'
import ScrollToTopOnNavigate from '@/components/ScrollToTopOnNavigate'
import NewsletterForm from '@/components/NewsletterForm'
import SocialIcons from '@/components/SocialIcons'
import CookieConsent from '@/components/CookieConsent'
import ToastProvider from '@/components/ToastProvider'
import CookieSettingsButton from '@/components/CookieSettingsButton'
import Logo from '@/components/Logo'
import { getSocialLinks, hasSpecialOffers, getCategories, getBonusArea } from '@/lib/api'
import { buildOrganizationSchema, buildWebSiteSchema, jsonLdScript, SHARE_IMAGES } from '@/lib/seo'
import { SITE_URL } from '@/lib/config'
import { COPY } from '@/constants/copy'
import NavDropdown from '@/components/NavDropdown'
import FooterNavGroup from '@/components/FooterNavGroup'
import MobileNav from '@/components/MobileNav'
import { resolveImageUrl } from '@/lib/images'
import { LEGAL_PAGES } from '@/constants/legalPages'
import type { SocialLink } from '@shared/types/socialLink'
import './globals.css'

// The TWO faces of sites/avantlinks.html, and two is the point: this site is
// the last page before an operator's own, and a page whose job is to be
// believed does not need a third voice.
//
// SPACE GROTESK carries every heading, the wordmark, and the all-caps labels
// (`.lbl`). It STOPS AT 700 — the mockup asks for 800 in six places and would
// get a synthesised, smeared outline for it — so `.font-display` pins 700 and
// nothing in the markup says `font-extrabold`. The geometric, slightly
// squared capitals are also why it carries the labels rather than the body
// face: at the 0.16em tracking a kicker is set with, Inter Tight's narrower
// capitals close up into a band.
//
// INTER TIGHT carries everything that is read — the deck, the facts, the
// chips, the buttons, the form fields, the prose. It is the tight-width
// Inter, drawn for exactly this: a page of short factual lines at 15 to 17px
// that has to fit three columns of them beside each other.
const spaceGrotesk = Space_Grotesk({ variable: '--font-space-grotesk', subsets: ['latin'] })
const interTight = Inter_Tight({ variable: '--font-inter-tight', subsets: ['latin'] })

/**
 * Subscribe capture: every entry point on this site — the newsletter form and,
 * where the site has one, the timed subscribe modal.
 *
 * The components, the /api/newsletter route and the backend double-opt-in flow
 * are never touched by this; it only decides whether they are rendered. That is
 * the point of a flag rather than deleted markup: turning capture off and back
 * on is one edit, and nothing has to be rebuilt from memory.
 */
const SUBSCRIBE_ENABLED = true

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? 'AvantLinks'

// Both strings live in COPY so this site's wording is defined in exactly one
// place — the same place the page-level titles and descriptions come from.
// The previous SITE_DESCRIPTION here was byte-identical to a sibling domain's,
// which made this site's default meta/og/twitter description duplicate content
// on every page that falls back to it.
const SITE_TITLE = `${SITE_NAME} — ${COPY.site.titleTail}`
const SITE_DESCRIPTION = `${SITE_NAME} ${COPY.site.description}`

export const metadata: Metadata = {
  // THE origin every relative canonical and og:url in the app resolves
  // against. `SITE_URL` is validated at module load (see lib/config), so the
  // old `|| 'https://…'` literal is gone: a second hardcoded host here is
  // exactly how the canonical and the sitemap drifted onto different hosts.
  metadataBase: new URL(SITE_URL),
  // Root default. Every page overrides it with its own path, so each URL
  // gets a SELF-referencing canonical rather than inheriting the homepage's.
  alternates: { canonical: '/' },
  title: {
    // Home & inner pages set their own; this is the SEO-friendly fallback title.
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  // Terms that describe what THIS site publishes. The generic set that was
  // here was shared with a sibling domain and described neither in particular.
  keywords: [...COPY.site.keywords, SITE_NAME],
  // Tab icon.
  //
  // This used to offer ONLY icon.svg. Browsers that do not take an SVG favicon
  // — Safari most visibly — then had nothing to fall back to, because
  // /favicon.ico 404'd, so they showed a placeholder or a stale cached icon
  // instead of this site's own mark. app/favicon.ico now holds 16/32/48 rasters
  // cut from that same artwork, and Next links it automatically from the file
  // convention, so it is deliberately NOT repeated here.
  //
  // `apple` DOES have to be listed: an explicit icons object suppresses the
  // apple-icon file convention, so app/apple-icon.tsx was generating a 180x180
  // PNG at /apple-icon that no page ever linked to.
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/apple-icon', sizes: '180x180', type: 'image/png' }],
  },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    // Relative on purpose: Next resolves it against metadataBase, so og:url
    // and the canonical can never disagree about the host.
    url: '/',
    images: SHARE_IMAGES,
  },
  // The card TYPE only. A title and description here were inherited by every
  // page that does not set `twitter` itself — nearly all of them — so a shared
  // /casinos or /about went out on X under the HOME page's title. With these
  // tags absent, X reads the page's own og:title, og:description and og:image.
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
  manifest: '/manifest.webmanifest',
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  // Search-engine ownership verification, supplied per environment. Absent env
  // vars simply produce no tag, so nothing has to be committed to the repo.
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
    other: {
      ...(process.env.NEXT_PUBLIC_BING_VERIFICATION
        ? { 'msvalidate.01': process.env.NEXT_PUBLIC_BING_VERIFICATION }
        : {}),
      ...(process.env.NEXT_PUBLIC_PINTEREST_VERIFICATION
        ? { 'p:domain_verify': process.env.NEXT_PUBLIC_PINTEREST_VERIFICATION }
        : {}),
    },
  },
}

/**
 * Viewport + theme colour.
 *
 * Next 14 moved these out of `metadata` into their own export; leaving
 * themeColor in `metadata` is silently ignored, which is why the sites had no
 * theme-color at all. `viewport-fit=cover` is deliberately omitted — nothing
 * here draws into the notch area.
 */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0e4f5c',
}

const NAV_LINKS = [
  { href: '/casinos', label: COPY.nav.casinos },
  { href: '/special-offers', label: COPY.nav.specialOffers },
  { href: '/categories', label: COPY.nav.categories },
]

/** A nav link — the mockup's `.hdr .nav a`: sentence case, semibold, 15px,
 *  no fill, no box, no rule. It only changes colour on hover.
 *
 *  It is NOT `.lbl`. This site's labels are tracked capitals and they mark
 *  things that are not links — kickers, column heads, the glance sheet's
 *  terms. Three nav entries set that way would make the one row a reader
 *  actually navigates with look like the least clickable thing on the page.
 *
 *  `min-h-11` with no horizontal padding beyond the 32px gap the strip
 *  already sets: the row is the target, and the gap is what keeps two
 *  neighbouring targets from touching. */
const NAV_LINK = 'flex min-h-11 items-center whitespace-nowrap py-2 text-[15px] font-semibold text-ink transition-colors hover:text-brand'

const FOOTER_LINK = 'inline-flex min-h-11 min-w-11 items-center text-[15px] font-medium text-night-muted transition-colors hover:text-night-ink'

/** A footer column head — the mockup's `.ftr h4`: 16px of Space Grotesk in
 *  WHITE, with no rule under it. Not `.lbl`: the mockup sets these in the
 *  display face at sentence case, and at 16px that is what tells a column
 *  head from the tracked 10.5px strapline two inches to its left. */
const FOOTER_HEAD = 'font-display block text-[16px] text-night-ink'

// The 11 legal pages split into the footer's three columns, as in the mockup.
// Every page in LEGAL_PAGES lands in exactly one of them.
const FOOTER_EXPLORE = ['about', 'contact']
const FOOTER_LEGAL = ['privacy-policy', 'terms', 'cookie-policy', 'disclaimer']
const FOOTER_POLICIES = ['responsible-gambling', 'affiliate-disclosure', 'editorial-policy', 'aml-policy', 'kyc-policy']

function footerPages(slugs: string[]) {
  return LEGAL_PAGES.filter(({ slug }) => slugs.includes(slug))
}

/** The header dropdown panel, in this site's own palette.
 *
 *  20px and a soft slate blur — a panel is a CONTAINER, so it takes the same
 *  rung as an offer card, which is the other thing on this site that holds
 *  elements of its own. The teal tint on a hovered row is the same
 *  `--color-brand-soft` the bonus bar uses, so a pointed-at row and the
 *  figure a reader came for are the same colour by construction. */
const NAV_PANEL = {
  panelClassName: 'bg-paper border border-line rounded-[20px] shadow-[0_20px_40px_-26px_rgba(22,27,38,0.45)]',
  itemClassName: 'text-ink-soft hover:bg-brand-soft hover:text-brand-dark',
  allItemClassName: 'text-ink hover:bg-brand-soft hover:text-brand-dark',
  arrowClassName: 'text-brand',
}

/** The phone menu (below `md`), in this site's own palette — the mockup's
 *  `.burger` and `.mnav`: a 44px button on the 12px CONTROL rung with a
 *  control-weight edge, over rows parted by hairlines on the page ground.
 *
 *  `line-strong`, not the mockup's `--line`: the burger is the only control
 *  in the header bar at phone width and a 1.63:1 boundary is not one. */
const NAV_MOBILE = {
  triggerClassName: 'rounded-xl border border-line-strong bg-paper text-ink hover:border-ink hover:bg-paper',
  panelClassName: 'bg-cream border-line border-t',
  rowClassName: 'text-ink hover:bg-brand-soft hover:text-brand-dark',
  rowExpandedClassName: 'bg-brand-soft text-brand-dark',
  allClassName: 'text-ink hover:bg-brand-soft hover:text-brand-dark',
  childClassName: 'text-ink-soft hover:bg-brand-soft hover:text-brand-dark',
  guideClassName: 'border-line',
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  /*
   * Widened to `string` deliberately.
   *
   * COPY is `as const`, so this would otherwise carry the LITERAL type of
   * whatever address is written in copy.ts — and TypeScript then rejects
   * `!== ''` as a comparison that can never be true. The check is not
   * pointless: a freshly cloned site ships with this blank, and the footer has
   * to omit the whole <address> element rather than print an empty one.
   */
  const postalAddress: string = COPY.footer.postalAddress

  let socialLinks: SocialLink[] = []
  try {
    socialLinks = (await getSocialLinks()).data
  } catch {
    socialLinks = []
  }

  // "Special Offers" only earns its slot in the nav when this site actually has
  // a visible offer to show; with none, the link would lead to an empty page,
  // so both the header and the footer drop it.
  const showSpecialOffers = await hasSpecialOffers()
  const navLinks = NAV_LINKS.filter(({ href }) => href !== '/special-offers' || showSpecialOffers)

  // Children for the Casinos and Bonuses entries, header and footer
  // alike. Each carries the icon its chip shows, resolved here on the server so
  // the client menus never need the storage URL. A failed fetch yields no
  // items, and the entry then stays the plain link it always was.
  const categoryMenuItems = await getCategories()
    .then((res) => res.data.map((c) => ({ slug: c.slug, name: c.name, icon: resolveImageUrl(c.logo_path) })))
    .catch(() => [])
  // Bonus types with at least one visible offer on this site (the API drops
  // empty ones). getBonusArea already falls back to [] on failure.
  const bonusMenuItems = (await getBonusArea()).map((section) => ({
    slug: section.slug,
    name: section.name,
    icon: resolveImageUrl(section.icon_path),
  }))

  // Site-wide structured data, rendered once here so every page carries it.
  // Next.js manages the document <head> (manual <head> tags in a root layout are
  // discouraged), so per the framework's JSON-LD guide the <script> is rendered
  // in the layout body — crawlers read JSON-LD from anywhere in the document.
  // The `<` escaping keeps the payload XSS-safe.
  //
  // Two nodes, cross-referenced by @id: the publisher (Organization) and the
  // site (WebSite). socialLinks is already fetched above for the footer, so
  // `sameAs` costs no extra request.
  const siteGraph = [buildOrganizationSchema(socialLinks), buildWebSiteSchema()]

  return (
    <html lang="en" className={`${interTight.variable} ${spaceGrotesk.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-cream text-ink">
        {/* Opens every page at its top — see the component. */}
        <ScrollToTopOnNavigate />
        <ToastProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLdScript(siteGraph),
          }}
        />
        {/* THE HEADER — the mockup's `.hdr`: sticky, 72px tall, the page's own
            colour at 92% behind a 10px blur, closed by a hairline. The
            wordmark at the left, the three sections at the right, and nothing
            else in the row.

            FROSTED, which on this site is the correct call and on some of its
            siblings would not be: the page is white cards on a cool ground
            with no texture anywhere, so a translucent bar over it reads as
            glass over paper rather than as a smear over a pattern. It is also
            the only element on the site that is not flat, apart from the one
            beating dot.

            `z-50`, above the dropdown panels' own stacking, because those are
            portalled into `<body>` and have to sit under the bar they hang
            from rather than over it. */}
        <header className="sticky top-0 z-50 border-b border-line bg-cream/[0.92] backdrop-blur-[10px]">
          <div className="mx-auto flex min-h-[72px] w-full max-w-[1160px] items-center justify-between gap-4 px-5 py-2.5 min-[90rem]:max-w-[1240px]">
            {/* The tagline under the wordmark goes first when the row runs
                out of width: at 375px the mark, the name and the burger take
                the whole row, and the four tracked words underneath are the
                one part of it a reader already has from the page itself. */}
            <Logo taglineClassName="hidden min-[26rem]:block" />

            <nav aria-label="Main navigation" className="hidden md:block">
              <ul className="flex items-center gap-8" role="list">
                {navLinks.map(({ href, label }) =>
                  href === '/casinos' && categoryMenuItems.length > 0 ? (
                    <NavDropdown key={href} label={label} href={href} allLabel={COPY.nav.allCasinos} itemBasePath="/categories" items={categoryMenuItems} triggerClassName={NAV_LINK} {...NAV_PANEL} />
                  ) : href === '/special-offers' && bonusMenuItems.length > 0 ? (
                    <NavDropdown key={href} label={label} href={href} allLabel={COPY.nav.allOffers} itemBasePath="/bonuses" items={bonusMenuItems} triggerClassName={NAV_LINK} {...NAV_PANEL} />
                  ) : (
                    <li key={href} className="flex">
                      <Link href={href} className={NAV_LINK}>
                        {label}
                      </Link>
                    </li>
                  ),
                )}
              </ul>
            </nav>

            {/* NO FORM HERE. The strip below carries it at every width — see
                the comment there — so the header is the mark and the nav and
                nothing else, which is how the mockup draws it. */}

            {/* Below md the nav strip above is hidden and this menu replaces it. */}
            <MobileNav
              links={navLinks}
              groups={{
                '/casinos': { allLabel: COPY.nav.allCasinos, items: categoryMenuItems, itemBasePath: '/categories' },
                '/special-offers': { allLabel: COPY.nav.allOffers, items: bonusMenuItems, itemBasePath: '/bonuses' },
              }}
              theme={NAV_MOBILE}
            />
          </div>
        </header>

        {/* THE SUBSCRIBE STRIP — the mockup's `.strip`: a WHITE band directly
            under the header carrying the brief's name, one line about it, and
            the field.

            OUTSIDE THE <header>, and that is the whole reason it is a second
            element rather than a second row inside it. Inside, it would
            inherit `position: sticky` and cost ~90px of every phone screen on
            top of the header's own 72 — about a fifth of an 812px viewport,
            permanently, on every page. Out here it scrolls away under the
            header once it has been seen, which is all a subscribe row needs
            to do. It is also where the mockup puts it, after `.hdr` and
            before `<main>`.

            The heading and its line are the first thing to give when the row
            narrows: the field beside them carries its own label, so nothing
            is lost below `md` except the explanation. */}
        {SUBSCRIBE_ENABLED && (
          <section className="border-b border-line bg-paper" aria-label="Newsletter">
            <div className="mx-auto flex max-w-[1160px] flex-wrap items-center justify-between gap-x-6 gap-y-4 px-5 py-[22px] min-[90rem]:max-w-[1240px]">
              <div className="hidden min-w-0 flex-1 md:block">
                <p className="font-display text-[20px] text-ink">{COPY.newsletter.barLead}</p>
                <p className="mt-0.5 text-[14.5px] text-ink-soft">{COPY.newsletter.barTail}</p>
              </div>
              {/* `compact` = no intro: the two lines beside it are the intro. */}
              <NewsletterForm compact tone="bar" className="w-full md:w-auto md:flex-[1_1_460px] md:max-w-[460px]" />
            </div>
          </section>
        )}

        <div className="flex-1">{children}</div>

        {/* Subscribe, a SECOND time, directly above the footer.

            The mockup has only the strip under the header, and that strip
            scrolls away: on a page this long, someone who reads all the way
            to the end has no way in without going back up. So the band stays
            — as a WHITE CARD on the 20px container rung, inset from both
            margins, which is the same object every offer on the page is and
            the only band treatment this design has. Not a full-bleed colour
            strip: the footer directly beneath it is already a full-bleed
            block of ink, and two bands touching would read as one confused
            one. */}
        {SUBSCRIBE_ENABLED && (
          <section className="mt-[96px] px-5" aria-label="Newsletter">
            <div className="mx-auto flex max-w-[1160px] flex-wrap items-center justify-between gap-8 rounded-[20px] border border-line bg-paper px-6 py-11 sm:px-11 min-[90rem]:max-w-[1240px]">
              <div className="min-w-[260px] flex-[1_1_340px]">
                <span className="lbl block text-[12.5px] text-brand">{COPY.newsletter.bandKicker}</span>
                <h2 className="font-display mt-2.5 text-[clamp(28px,3.4vw,40px)] text-ink">
                  {COPY.newsletter.bandTitle}
                </h2>
                <p className="mt-3 max-w-[440px] text-[16.5px] text-ink-soft">{COPY.newsletter.bandSubtitle}</p>
              </div>
              {/* `compact` = no intro: the band carries the heading itself. */}
              <NewsletterForm compact className="min-w-[260px] flex-[1_1_380px] lg:max-w-[440px]" />
            </div>
          </section>
        )}

        {/* Footer — the mockup's `.ftr`: the INK ground, carrying the brand
            and its line, Explore / Legal / Policies, and the legal bar.

            NO TOP RULE, and no colour band opening it. The ink arrives against
            the cool page with a 17:1 step between them, which is the hardest
            edge on the site already; a stripe over it would be decorating a
            boundary that needs no help. This is also the only dark surface on
            the site, and the one place the pale cyan #7FCAD2 is allowed — at
            9.26:1 on the ink, against 1.44 on white. */}
        <footer className="relative bg-navy text-night-muted">
          <div className="relative mx-auto max-w-[1160px] px-5 pb-7 pt-14 min-[90rem]:max-w-[1240px]">
            <div className="flex flex-wrap justify-between gap-10">
              <div className="max-w-[360px] flex-[1_1_260px]">
                {/* The Logo component itself, so the mark and wordmark here can
                    never drift from the header's. */}
                <Logo onDark />
                <p className="mt-4 text-[14.5px] text-night-muted">{COPY.footer.tagline}</p>
                {socialLinks.length > 0 && (
                  <div className="mt-5">
                    <p className={`${FOOTER_HEAD} mb-3`}>Follow us</p>
                    <SocialIcons links={socialLinks} onDark />
                  </div>
                )}
              </div>

              <div className="grid flex-[2_1_480px] grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-6">
                <div>
                  <p className={FOOTER_HEAD}>Explore</p>
                  <ul className="mt-2.5 flex flex-col">
                    {navLinks.map(({ href, label }) =>
                      href === '/casinos' && categoryMenuItems.length > 0 ? (
                        <FooterNavGroup key={href} label={label} href={href} allLabel={COPY.nav.allCasinos} itemBasePath="/categories" items={categoryMenuItems} linkClassName={FOOTER_LINK} guideClassName="border-night-line" />
                      ) : href === '/special-offers' && bonusMenuItems.length > 0 ? (
                        <FooterNavGroup key={href} label={label} href={href} allLabel={COPY.nav.allOffers} itemBasePath="/bonuses" items={bonusMenuItems} linkClassName={FOOTER_LINK} guideClassName="border-night-line" />
                      ) : (
                        <li key={href}>
                          <Link href={href} className={FOOTER_LINK}>{label}</Link>
                        </li>
                      ),
                    )}
                    {footerPages(FOOTER_EXPLORE).map(({ slug, label }) => (
                      <li key={slug}><Link href={`/${slug}`} className={FOOTER_LINK}>{label}</Link></li>
                    ))}
                  </ul>
                </div>
                <nav aria-label="Legal">
                  <p className={FOOTER_HEAD}>Legal</p>
                  <ul className="mt-2.5 flex flex-col">
                    {footerPages(FOOTER_LEGAL).map(({ slug, label }) => (
                      <li key={slug}><Link href={`/${slug}`} className={FOOTER_LINK}>{label}</Link></li>
                    ))}
                    <li>
                      <CookieSettingsButton className={FOOTER_LINK} />
                    </li>
                  </ul>
                </nav>
                <nav aria-label="Policies">
                  <p className={FOOTER_HEAD}>Policies</p>
                  <ul className="mt-2.5 flex flex-col">
                    {footerPages(FOOTER_POLICIES).map(({ slug, label }) => (
                      <li key={slug}><Link href={`/${slug}`} className={FOOTER_LINK}>{label}</Link></li>
                    ))}
                  </ul>
                </nav>
              </div>
            </div>

            {/* The 18+ mark and the legal line, on one rule — the mockup's
                `.legal`. Not `aria-hidden`: the sentence beside it never says
                the age, so a screen reader needs the "18+" too.

                The mockup's `.age`: a 34px CIRCLE drawn as a 2px RING in the
                pale cyan, not a fill — the bottom rung of the radius ladder,
                where anything word-sized that stands for a value becomes a
                pill. On the ink ground the cyan is 9.26:1 either way, and the
                ring is the right one: a filled disc here would be the only
                solid block of colour in the footer. */}
            <div className="mt-11 flex flex-wrap items-center justify-between gap-4 border-t border-night-line pt-[22px] text-[14px] text-night-muted">
              <p className="flex min-w-0 flex-[1_1_320px] items-center gap-2.5">
                <span className="grid h-[34px] w-[34px] shrink-0 place-items-center rounded-full border-2 border-night-accent text-[12px] font-bold text-night-accent">18+</span>
                <span>
                  <b className="font-semibold text-night-ink">Gamble responsibly.</b> {COPY.footer.disclaimer}
                </span>
              </p>
            </div>

            <div className="mt-4 flex flex-wrap justify-between gap-3 text-[14px] text-night-faint">
              <p>© {new Date().getFullYear()} {SITE_NAME}. All rights reserved.</p>
              {/* Rendered only when an address exists: a freshly cloned site
                  ships with this blank, and an empty <address> is worse than
                  none. `not-italic` is load-bearing — Preflight does not reset
                  the tag's italic default. */}
              {postalAddress !== '' && <address className="not-italic">{postalAddress}</address>}
            </div>
          </div>
        </footer>

        <CookieConsent />
        </ToastProvider>
      </body>
    </html>
  )
}
