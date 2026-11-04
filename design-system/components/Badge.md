# Badge

A short status label on a row or card: an order's state, a listing's condition.

- Markup: `span.ts-badge.ts-badge--<status>` with the label and, optionally, a 12px icon (`svg.ts-badge__icon`, `aria-hidden="true"`).
- Same four variants and colors as Alert: `-subtle` fill, border and text in the status color, `radius-pill`.
- The consumer provides the label: one to three words that name the state ("Delivered", "Awaiting payment"). The word carries the meaning; color only reinforces it.
- Not interactive. For a removable or clickable tag, use a button.
