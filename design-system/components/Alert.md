# Alert

An inline message about the state of the page or of something the reader just did.

- Markup: `div.ts-alert.ts-alert--<status>` with an icon (`svg.ts-alert__icon`, 20px, `aria-hidden="true"`) and the text; an optional `.ts-alert__title` line in medium weight.
- Variants: `--danger` (something failed or was refused), `--success` (an action completed), `--warning` (attention needed, nothing failed yet), `--info` (neutral information or a tip).
- Fill is the status's `-subtle` token; border and all text are the status color.
- The consumer provides the icon and the text. Never ship an alert that relies on color alone: the icon and the words must say what happened.
- Roles: `role="alert"` for `--danger` messages that appear after an action; `role="status"` for the others.
- Icons: Material Symbols `error`, `check_circle`, `warning`, `info` (the preview uses equivalent inline SVGs).
