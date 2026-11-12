# Tsundoku design system

Source of truth for the Tsundoku brand in this repo. Code imports `tokens/tokens.css`; never hard-code a color, font or radius that exists here, and use the semantic color tokens (`background`, `text`, `primary`…) so both themes work.

| Folder | Contents |
|---|---|
| `tokens/` | `tokens.json` (source) and `tokens.css` (CSS custom properties, light and dark) |
| `components/` | `components.css` and one guideline file per component |
| `previews/` | static HTML previews; open in a browser, add `?theme=dark` or `?theme=light` to force a theme |
| `assets/logo/` | logo lockups and symbol (SVG) in four colorways, plus `as-presented/` tiles |
| `assets/app-icon/` | app icons in the sheet's five colorways |
| `assets/favicon/` | favicon set and `site.webmanifest`, copied to `public/` |

Tsundoku is a social reading app with a second-hand bookshop inside it. This system follows the Tsundoku brand sheet; where the sheet gives no value (type sizes, spacing, radii, text color), the value here is a proposal and is marked as such.

## About the name

*Tsundoku* (積ん読) is the Japanese word for buying books and letting them pile up unread. Wherever the name appears without context (landing page, About), explain it in one line: "Tsundoku — Japanese for the pile of books you still mean to read."

## Tone of voice

Not defined on the brand sheet yet.

## Color

The four brand colors and their roles, as on the sheet:

- `forest-green` — headings, primary buttons, the logo.
- `sage-green` — secondary accents. The sheet's hex (#98C1D9) is a blue that contradicts its own swatch; `sage-green` uses the swatch's color.
- `warm-cream` — backgrounds.
- `terracotta` — calls to action, labelled in `white` (4.53:1; `warm-cream` on it is only 4.03:1).

Supporting neutrals visible on the sheet: `ink` (text) and `white` (cards, inputs).

Components never use these brand tokens directly. They use semantic tokens that resolve per theme:

| Token | Role |
|---|---|
| `background` | Page background. |
| `surface` | Cards, inputs, dropdowns, menus. |
| `text` / `text-muted` | Body text / secondary text and placeholders. |
| `heading` | Headings and icons. |
| `primary` / `on-primary` | Primary button fill, toggle on, focus ring / text on it. |
| `secondary` / `on-secondary` | Secondary button fill / text on it. |
| `accent` | Secondary accents: secondary button border, sage toggle. |
| `cta` / `on-cta` | Calls to action (buy, sell, list a copy) / text on it. Never for errors. |
| `border` | Field outlines and dividers. |
| `danger` / `on-danger` | Errors, refusals and destructive actions: alert, badge and field-error text and borders, `ts-btn--danger` fill / text on that fill. |
| `danger-subtle` | Fill of danger alerts and badges. |
| `success` / `success-subtle` | Something completed (order placed, copy delivered) / its alert and badge fill. |
| `warning` / `warning-subtle` | Attention needed, nothing failed yet (last copy, payment pending) / its fill. |
| `info` / `info-subtle` | Neutral information and tips / its fill. |

## Dark theme

Not on the sheet: a proposal derived from the same palette, so the brand reads the same in both themes.

- The page turns to a neutral near-black (#101312) and text to an off-white (#E6E9E8), as in common dark UIs; cards and fields sit on a slightly lighter neutral surface (#1A1E1D).
- Sage takes over as the primary color (`primary` = `sage-green`, with `ink` text on it); headings become a light grey-sage (#C9D3CF).
- `cta` stays `terracotta` with `white` text in both themes, so calls to action look identical.
- Logos: use the `-on-dark` files on dark backgrounds. Code that shows a logo renders both and marks them `ts-only-light` / `ts-only-dark`.
- The theme follows the system setting (`prefers-color-scheme`) unless the page sets `data-theme="light"` or `data-theme="dark"` on `<html>`.

## Status

- Status colors come only from the status tokens. Never use a raw red, green, amber or blue anywhere in the app, and never borrow `cta` (terracotta) to mean "error".
- Status is never told by color alone: every alert carries an icon and words, every badge a word, every field error a `ts-field-error` message. Someone who can't tell red from green must get the same information.
- Each status color reads as text at 4.5:1 or more on `surface`, `background` and its own `-subtle` fill, in both themes. The `-subtle` fills are almost the surface's lightness, so alerts and badges always draw a border in the status color.
- Which component:
  - `ts-alert--<status>` — a message about the page or the last action (payment failed, order placed).
  - `ts-badge--<status>` — a short state label on a row or card (Delivered, Cancelled).
  - `ts-input--error`, `ts-select--error` + `ts-field-error` — a field's value is invalid; the message says how to fix it.
  - `ts-btn--danger` — the button that performs a destructive action, after a confirmation.

```html
<div class="ts-alert ts-alert--danger" role="alert">
  <svg class="ts-alert__icon" aria-hidden="true">…</svg>
  <div><p class="ts-alert__title">Payment failed</p><p>Your card was declined. Try another card.</p></div>
</div>

<span class="ts-badge ts-badge--success">Delivered</span>

<input class="ts-input ts-input--error" aria-invalid="true" aria-describedby="price-error">
<p class="ts-field-error" id="price-error">Enter a price in reais, like 24,90.</p>

<button class="ts-btn ts-btn--danger">Delete listing</button>
```

## Typography

- Roboto is primary: interface, headings (`h1`–`h3`), body (`body`) and `small-text`. Weights Light, Regular, Medium, Bold.
- Merriweather is secondary: editorial text — book titles, reviews, synopses, quotes (`serif-h1`, `serif-h2`, `serif-body`, `serif-italic`, `serif-small-text`). Weights Regular, Italic, Bold.
- Headings use `heading`; body text uses `text`.
- The sheet names the hierarchy (H1, H2, H3, Body, Small Text) but gives no sizes: the sizes here are proposals.

## Spacing, radius, elevation

Proposals (not on the sheet): a 4px spacing scale (`space-1`…`space-8`), `radius-sm` for buttons and fields, `radius-md` for cards and logo tiles, `radius-pill` for toggles and avatars, `shadow-card` for cards as on the Reader Profile Card.

## Logo

- The mark is a hardcover book: cover with rounded spine-side corners, the back board poking out at the top-right, a page strip across the top, a spine rule on the left and 読 ("read") on the cover.
- Three lockups, as on the sheet: **vertical** (symbol over the wordmark), **horizontal** (symbol beside the wordmark) and **small stacked** (a smaller symbol over a larger wordmark, for tight spaces). The wordmark is Roboto Regular.
- Each lockup comes in four colorways: `on-light` (forest book, cream details, ink wordmark) for cream and light backgrounds, `on-forest` (cream book, forest details, cream wordmark), `on-terracotta` (cream book, terracotta details, cream wordmark) and `on-dark` (cream book, ink details, cream wordmark) for the dark theme. The details are cut in the background's color, so use each file only on its named background.
- Logos as presented holds the three tiles exactly as the sheet shows them.
- Clear space and minimum size: the sheet marks both rules but gives no values. Proposed: clear space equal to the page strip's height ×2 on every side; minimum width 120px for the horizontal lockup, 24px height for the symbol.

## App icons and favicons

The sheet shows the book on rounded-square tiles in five colorways: forest, sage, cream, terracotta and white. `app-icon-forest` is the default and the source of the favicon set. `app-icon-forest-square` (Apple touch icon) and `app-icon-forest-maskable` (Android/PWA) are full-bleed because those platforms round the corners themselves.

## Iconography

The sheet shows filled, rounded icons in `forest-green` (the `heading` token, so they follow the theme) (search, profile, book, edit, mail, delete…). Material Symbols Rounded, filled, matches them; this pick is a proposal, the sheet names no icon set.

## Components

From the sheet: buttons (primary, secondary, ghost), input field, dropdown, toggles (forest, sage, off, call to action) and the Reader Profile Card.

Added for the app (not on the sheet): the destructive button (`ts-btn--danger`), field error states (`ts-input--error`, `ts-select--error`, `ts-field-error`), Alert and Badge.
