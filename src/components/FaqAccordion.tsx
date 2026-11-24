type Item = { readonly question: string; readonly answer: string }

/**
 * The home FAQ. The mockup has no FAQ section at all, so this is this site's
 * own: WHITE CARDS on the 8px structural rung, one per question, each a native
 * `<details>` with a `+` at the right margin that rotates into a cross and
 * turns teal while the answer is open.
 *
 * Cards rather than a hairline-parted list (bigbrightday), letters to an
 * editor (goodnewsdrop) or a two-column grid (goldenspinhq, bonanzasmile),
 * because on this site a card is the unit of one thing you can read on its
 * own, and that is exactly what a question is. They sit in ONE column, with a
 * gap: an answer here runs to five or six lines, and two of these side by side
 * would set that paragraph across a measure where a reader starts losing the
 * start of the next line.
 *
 * `self-start` is unnecessary in one column and is deliberately absent — in a
 * single-column grid nothing stretches to a neighbour's height.
 *
 * Native `<details>`, no client state: every answer is in the server HTML,
 * open or closed — which the FAQPage schema built from the same array needs.
 * `[&::-webkit-details-marker]:hidden` and `list-none` drop the browser's own
 * triangle so only the `+` shows.
 *
 * The first one is open, so the section is never a column of closed boxes with
 * nothing to read in it.
 */
export default function FaqAccordion({ items }: { items: readonly Item[] }) {
  return (
    <div className="grid grid-cols-1 gap-3">
      {items.map((item, i) => (
        <details key={item.question} open={i === 0} className="fq group">
          <summary className="grid cursor-pointer list-none grid-cols-[minmax(0,1fr)_28px] items-start gap-4 px-5 py-[18px] [&::-webkit-details-marker]:hidden sm:px-6">
            <h3 className="fq-q font-display text-[19px] leading-[1.25] text-ink [overflow-wrap:anywhere] sm:text-[21px]">
              {item.question}
            </h3>
            {/* Decoration: the <summary> already announces its own state. */}
            <span aria-hidden className="pm font-display justify-self-end text-[24px] leading-[1.1] text-brand">
              +
            </span>
          </summary>
          <p className="fq-answer px-5 pb-5 pr-6 text-[16px] leading-[1.7] text-ink-soft sm:px-6 sm:pb-6 sm:pr-10 sm:text-[16.5px]">
            {item.answer}
          </p>
        </details>
      ))}
    </div>
  )
}
