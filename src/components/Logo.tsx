import Link from 'next/link'

/**
 * AvantLinks brand mark, from sites/avantlinks.html: a LETTER A BUILT AS A
 * RISING STROKE. A teal plate with a 10px radius, a white chevron drawn in
 * one unbroken line from the bottom left up to the apex and down to the
 * bottom right, and a pale-cyan crossbar through it.
 *
 * It reads two ways at once, which is the whole reason it is this shape: as
 * the A of Avant, and as a line going up. The same diagonal is what the
 * hero's `.hatch` band repeats.
 *
 * ON THE INK FOOTER THE MARK INVERTS rather than changing colour: the plate
 * goes white, the chevron goes teal, and the crossbar takes the mockup's own
 * #1C7A88. Every one of those measures clean — the cyan crossbar is 4.92:1 on
 * the teal plate, the teal chevron 9.16 on the white one, and the white plate
 * 17.23 on the ink — so the mark ships exactly as drawn in both directions.
 *
 * Inlined SVG rather than an image: it renders instantly with no extra request
 * and stays crisp at any size. The artwork is aria-hidden; the Link's name is
 * its visible text.
 *
 * THE WORDMARK CARRIES A TAGLINE — the mockup's `.logo-tag`, four words in
 * tracked capitals under the name. `taglineClassName` is how the caller hides
 * it where a row runs out of room.
 */
export default function Logo({
  className = '',
  taglineClassName = '',
  onDark = false,
}: {
  className?: string
  taglineClassName?: string
  onDark?: boolean
}) {
  return (
    <Link
      href="/"
      className={`inline-flex min-h-11 shrink-0 items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 ${
        onDark ? 'focus-visible:ring-offset-navy' : 'focus-visible:ring-offset-cream'
      } ${className}`.trim()}
    >
      <svg
        viewBox="0 0 42 42"
        className={onDark ? 'h-[38px] w-[38px] shrink-0' : 'h-[42px] w-[42px] shrink-0'}
        aria-hidden="true"
        focusable="false"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="42" height="42" rx="10" fill={onDark ? '#ffffff' : '#0e4f5c'} />
        <path
          d="M9 33L21 8l12 25"
          fill="none"
          stroke={onDark ? '#0e4f5c' : '#ffffff'}
          strokeWidth="4.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M15.5 24.5h11"
          stroke={onDark ? '#1c7a88' : '#7fcad2'}
          strokeWidth="4.4"
          strokeLinecap="round"
        />
      </svg>

      <span className="flex flex-col leading-none">
        <span
          className={`font-display whitespace-nowrap text-[22px] tracking-[-0.03em] ${
            onDark ? 'text-night-ink' : 'text-ink'
          }`}
        >
          Avant
          <b className={`font-bold ${onDark ? 'text-night-accent' : 'text-brand'}`}>Links</b>
        </span>
        {/* The tagline. `aria-hidden`: it is a second, shorter name for the
            same link, and a screen reader announcing both would read the
            brand twice over. */}
        <span
          aria-hidden
          className={`lbl mt-1 block text-[10.5px] tracking-[0.2em] ${
            onDark ? 'text-night-faint' : 'text-muted'
          } ${taglineClassName}`.trim()}
        >
          Casino Reviews &amp; Rankings
        </span>
        {/* The link's name is its visible text plus this — no aria-label that
            could disagree with what is on screen. */}
        <span className="sr-only"> home</span>
      </span>
    </Link>
  )
}
