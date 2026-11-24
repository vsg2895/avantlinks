'use client'

import { useState } from 'react'
import { COPY } from '@/constants/copy'
import { useToast } from '@/components/ToastProvider'
import { isValidEmail } from '@/lib/email'

/**
 * `compact` means NO INTRO — the field and the button alone, without the title
 * and subtitle the component otherwise prints above them.
 *
 * Both of this site's capture points are compact: the band above the footer
 * already carries an <h2> and its line, and the header has room for a field
 * and nothing else. Letting the form print its own pair on the band would
 * publish both twice, once as a heading and once as a paragraph. The
 * accessible name still carries the copy either way (`aria-label` on the form).
 *
 * It does NOT mean "small": the smaller mode is 46px, over the 44px tap
 * target, and the larger is 52px.
 *
 * `tone` is WHICH OF THE TWO CAPTURE POINTS this is, and the difference
 * between them is only size — both stand on white, which is this site's one
 * card colour:
 *
 *   'bar'  — the WHITE STRIP under the header, this site's primary capture
 *            point, present at every width. The mockup's `.sub-form` with its
 *            `.btn-sm`: 46px.
 *   'band' — the white card above the footer, which has a whole section to
 *            itself and takes the mockup's full-size `.btn`: 52px.
 *
 * TWO SEPARATE SHAPES WITH A 10px GAP, in both tones — the mockup's own
 * `.sub-form{gap:10px}`, and the opposite of the siblings that draw one box
 * around the pair. On this site the field and the key are both on the 12px
 * control rung of the radius ladder, and that rung is what says they are
 * controls; welding them into one outline would make them a single object and
 * put the pair on a rung of its own for no reason.
 *
 * A boolean would have been enough today and wrong tomorrow: the next ground
 * this form lands on gets its own name here rather than a second flag.
 */
export default function NewsletterForm({
  compact = false,
  tone = 'band',
  className = '',
}: {
  compact?: boolean
  tone?: 'band' | 'bar'
  className?: string
}) {
  const onBar = tone === 'bar'
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [website, setWebsite] = useState('')
  // A domain-typo correction from SendGrid, e.g. user@gmial.com -> gmail.com.
  // The ONLY validation detail ever shown to a visitor: it is about their own
  // address, and it turns a dead form into a corrected signup.
  const [suggestedEmail, setSuggestedEmail] = useState<string | null>(null)
  const toast = useToast()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (loading) return
    if (!isValidEmail(email)) {
      toast('Please enter a valid email address.', 'error')
      return
    }
    setLoading(true)
    setSuggestedEmail(null)
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, website }),
      })
      if (!res.ok) {
        // Surface backend validation (e.g. 422 "You are already subscribed.").
        const data = (await res.json().catch(() => ({}))) as {
          message?: string
          errors?: { email?: string[] }
          suggested_email?: string | null
        }

        setSuggestedEmail(data.suggested_email ?? null)
        toast(data.errors?.email?.[0] ?? data.message ?? COPY.newsletter.error, 'error')
        return
      }
      // The API reports whether a verification email is actually going out
      // (`email_sent` mirrors the site's newsletter_emails_enabled switch).
      // Telling someone to watch their inbox — and dig through spam — for mail
      // this site is not sending would be a worse failure than not collecting
      // the address at all.
      const { email_sent: emailSent } = (await res.json().catch(() => ({}))) as { email_sent?: boolean }

      // Keep the form in place; confirm via a top-corner toast.
      toast(emailSent === false ? COPY.newsletter.successNoEmail : COPY.newsletter.success, 'success')
      setEmail('')
    } catch {
      toast(COPY.newsletter.error, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={compact ? `min-w-0 ${className}`.trim() : `flex flex-wrap items-center justify-between gap-4 ${className}`.trim()}>
      {/* The strip's introduction. The compact form drops it: see above. */}
      {!compact && (
        <div className="min-w-0 flex-[1_1_360px]">
          <p className="font-display text-[20px] leading-tight text-ink">{COPY.newsletter.title}</p>
          {/* 14px on a phone, 13px from `sm` up. Below `lg` this strip is the
            ONLY subscribe path on the site (the header pill drops its form),
            so the line that explains what you get has to clear the project's
            14px phone readability floor — which the globals.css rule only
            raises for `.text-xs`, not for a literal size. */}
        <p className="mt-1 text-sm text-ink-soft sm:text-[13.5px]">{COPY.newsletter.subtitle}</p>
        </div>
      )}

      <div className={compact ? 'w-full min-w-0' : 'w-full min-w-0 flex-[0_1_420px]'}>
        {/* Field and button share one row at every width, as in the mockup;
            `min-w-0` lets the field give way so the button never wraps. */}
        <form
          onSubmit={onSubmit}
          // TWO SHAPES, 10px apart, each carrying its own edge and its own
          // 12px radius — the mockup's `.sub-form{display:flex;gap:10px}`.
          // The form itself draws nothing: there is no enclosing box and no
          // focus ring here, because each control has a visible edge of its
          // own and shows its own focus.
          //
          // A ROW AT EVERY WIDTH, in both tones, which is where this departs
          // from the mockup — its own `@media(max-width:640px)` stacks the
          // pair. The strip sits at the top of every page on this site, and
          // stacked it costs ~106px of a 375px screen instead of ~48px, on
          // every page, for a signup nobody arrived for. It does not need the
          // height: the field gives way (`min-w-0` plus `flex-1`) and the key
          // tightens its padding, leaving a ~230px field at 375px, which is
          // wider than most addresses people type.
          className="relative flex flex-row gap-2.5"
          aria-label={`${COPY.newsletter.title} ${COPY.newsletter.subtitle}`}
        >

          {/* HONEYPOT. Never shown, never focusable, never autofilled — a human
              cannot reach it, a naive bot fills every field it finds. The server
              rejects any request that carries a value, before the site is
              touched and long before a paid validation credit could be spent.
              Positioned off-screen rather than display:none, which some bots
              skip. */}
          <input
            type="text"
            name="website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            // Hidden by an INLINE STYLE, deliberately not by a Tailwind class.
            // The class was a real bug: utility CSS can load late, fail, or be
            // purged, and for as long as it is missing this renders as an
            // ordinary focusable text input sitting in the middle of the
            // subscribe form. A person who types into it gets their signup
            // rejected as a bot — an anti-bot measure silently turning away the
            // humans it exists to protect. An inline style travels inside the
            // HTML, so it cannot desync from the markup that carries it.
            //
            // Still off-screen rather than display:none or the hidden
            // attribute: a honeypot only works while a bot believes the field
            // is real, and the obvious ways of hiding it are the ways a bot
            // checks for. pointer-events:none means that even a rendering
            // accident cannot let a human click into it.
            style={{
              position: 'absolute',
              left: '-9999px',
              width: 1,
              height: 1,
              opacity: 0,
              pointerEvents: 'none',
            }}
          />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={COPY.newsletter.placeholder}
            aria-label={COPY.newsletter.placeholder}
            autoComplete="email"
            // 48px in BOTH tones. `compact` means "no intro", not "small":
            // the sibling sites shrink the field to 42px for a header pill,
            // and 42px is under the 44px tap target.
            // `flex-1` IS BREAKPOINT-PREFIXED, and that is load-bearing.
            // The band form is `flex-col` on a phone and only becomes a row
            // further up. `flex-1` is `flex: 1 1 0%`, and flex-basis applies
            // to the MAIN axis — so in column mode it zeroed the field's
            // HEIGHT, and the `h-12` beside it lost: the subscribe field
            // shipped 22.5px tall on a phone, half its size and half the tap
            // target. In row mode it is still needed, or `w-full` takes the
            // whole line and pushes the key out. So it applies only from the
            // width the form actually becomes a row.
            //
            // THE PAGE GROUND INSIDE A WHITE CARD — the mockup's
            // `background:var(--bg)` on a field sitting in a white strip, and
            // it is what makes the field read as a well cut into the card
            // rather than as a white rectangle on white.
            //
            // `line-strong`, NOT the mockup's `--line`: that hairline is
            // 1.63:1 on this card and a field is a CONTROL, whose boundary
            // needs 3:1. #737F7E measures 4.15 there.
            //
            // The focus outline is the mockup's own — 2px of the teal, offset
            // 1px — drawn on each control rather than on the form, because
            // here the two are separate shapes and a ring around the pair
            // would enclose the gap between them.
            className={
              onBar
                ? 'h-[46px] w-full min-w-0 flex-1 rounded-xl border border-line-strong bg-cream px-3.5 text-[15px] text-ink placeholder:text-muted focus:outline-2 focus:outline-offset-1 focus:outline-brand'
                : 'h-[52px] w-full min-w-0 flex-1 rounded-xl border border-line-strong bg-cream px-4 text-[15px] text-ink placeholder:text-muted focus:outline-2 focus:outline-offset-1 focus:outline-brand'
            }
          />
          <button
            type="submit"
            disabled={loading}
            // The TEAL primary in both tones — the mockup's `.btn-primary`,
            // with white on it at 9.16:1. There is no second button colour on
            // this form: it is the one action in the strip.
            //
            // 46px on the strip (the mockup's own `.btn-sm`) and 52px on the
            // band (its full `.btn`), both over the 44px tap target. The
            // padding tightens below 440px so the field keeps its width
            // instead of the row breaking.
            className={
              onBar
                ? 'btn-or btn-flat h-[46px] shrink-0 whitespace-nowrap px-4 text-[15px] focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-60 min-[27.5rem]:px-[22px]'
                : 'btn-or h-[52px] shrink-0 whitespace-nowrap px-4 text-[15px] focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-60 min-[27.5rem]:px-[26px]'
            }
          >
            {loading ? COPY.newsletter.checking : COPY.newsletter.button}
          </button>
        </form>

        {/* One click swaps the address in and resubmits. The corrected address
            is a DIFFERENT cache key upstream, so it gets its own validation
            call rather than reusing the typo's verdict. */}
        {suggestedEmail && (
          <p className="mt-2 text-sm text-ink-soft">
            Did you mean{' '}
            <button
              type="button"
              onClick={() => { setEmail(suggestedEmail); setSuggestedEmail(null) }}
              className="font-semibold underline underline-offset-2"
            >
              {suggestedEmail}
            </button>
            ?
          </p>
        )}
      </div>
    </div>
  )
}
