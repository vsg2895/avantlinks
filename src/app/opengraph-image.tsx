import { ImageResponse } from 'next/og'
import { SHARE_IMAGE_ALT } from '@/lib/seo'

/**
 * Dynamic Open Graph / Twitter card image.
 *
 * Until now no og:image existed anywhere while twitter:card was set to
 * `summary_large_image`, so every share of these pages rendered as an empty
 * card — the single most visible SEO/social gap on the site. Generating it here
 * means it can never drift out of sync with the site name, and needs no binary
 * asset committed to the repo.
 *
 * Next.js links this file automatically on the home page only. Every other
 * page sets its own `openGraph`, which REPLACES the layout's (metadata
 * merges shallowly) and drops this card — so those pages restate it via
 * `SHARE_IMAGES` in lib/seo, which also holds the alt text below.
 */
export const alt = SHARE_IMAGE_ALT
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/**
 * THE HERO at card size.
 *
 * The composition is what the page itself opens with and what a share card has
 * room for: the mark, the wordmark, the eyebrow, and the claim with its key
 * phrase sitting on the pale teal bar. Centred, because the hero is.
 *
 * Satori renders a subset of CSS, so nothing here leans on anything clever —
 * these are solid blocks, borders and one radius, which is all the page is
 * anyway. Notably ABSENT: the hero's hatch band, because Satori does not
 * render `repeating-linear-gradient`, and a mask even less; it is texture at
 * 12% and its absence costs the card nothing.
 *
 * Every element with more than one child carries an EXPLICIT `display`, which
 * Satori requires and a browser would have defaulted for us.
 */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          background: '#dce3e2',
          color: '#161b26',
          fontFamily: 'Helvetica, Arial, sans-serif',
          padding: '0 80px',
        }}
      >
        {/* THE MARK AND THE WORDMARK, side by side as in the header. */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <svg width="60" height="60" viewBox="0 0 42 42">
            <rect width="42" height="42" rx="10" fill="#0e4f5c" />
            <path d="M9 33L21 8l12 25" fill="none" stroke="#ffffff" strokeWidth="4.4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M15.5 24.5h11" stroke="#7fcad2" strokeWidth="4.4" strokeLinecap="round" />
          </svg>
          <div style={{ display: 'flex', fontSize: 44, fontWeight: 700, letterSpacing: '-0.03em' }}>
            <span>Avant</span>
            <span style={{ color: '#0e4f5c' }}>Links</span>
          </div>
        </div>

        {/* The eyebrow pill. No beating dot: a still card cannot pulse, and a
            solid teal disc is what the animation resolves to anyway — which
            is also what `prefers-reduced-motion` leaves on the page. */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginTop: 40,
            padding: '10px 24px',
            borderRadius: 999,
            border: '1px solid #c2cdcc',
            background: '#ffffff',
            color: '#434b5c',
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: 3.5,
            textTransform: 'uppercase',
          }}
        >
          <div style={{ display: 'flex', width: 10, height: 10, borderRadius: 999, background: '#0e4f5c' }} />
          Independent casino rankings
        </div>

        {/* THE CLAIM. The highlight is drawn as a BLOCK BEHIND the phrase —
            a positioned div under the text rather than `.hl`'s pseudo-element,
            which Satori does not render. Same bar, same colour, same place. */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginTop: 34, fontSize: 82, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.08 }}>
          <span>Casino reviews that&nbsp;</span>
          <div style={{ display: 'flex', position: 'relative' }}>
            <div style={{ display: 'flex', position: 'absolute', left: 0, right: 0, bottom: 10, height: 10, borderRadius: 4, background: '#d5e9eb' }} />
            <span style={{ color: '#0e4f5c' }}>stay ahead.</span>
          </div>
        </div>

        <div style={{ display: 'flex', marginTop: 30, fontSize: 26, color: '#434b5c', textAlign: 'center' }}>
          The licence, the terms and the cashier — stated before the link.
        </div>

        {/* The ink foot, which is where the page ends too. */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: 64,
            padding: '0 56px',
            background: '#161b26',
            color: '#8e97aa',
            fontSize: 21,
          }}
        >
          18+ · Gamble responsibly · avantlinks.com
        </div>
      </div>
    ),
    size,
  )
}
