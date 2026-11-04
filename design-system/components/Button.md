# Button

Buttons trigger an action; the sheet defines primary, secondary and ghost, and terracotta is its color for calls to action.

- Markup: `<button class="ts-btn ts-btn--primary">`. `--primary`: `primary` fill, `on-primary` label. `--secondary`: `secondary` fill, `accent` border, `on-secondary` label. `--ghost`: label only, in `heading`. `--cta`: `cta` fill, `on-cta` label (terracotta and white in both themes). `--danger`: `danger` fill, `on-danger` label, for destructive actions only (delete, cancel an order, remove from shelf). `--sm` for dense layouts.
- The consumer provides the label and, if any, a leading icon.
- One `--cta` per view at most.
- A `--danger` label names what will be destroyed ("Delete listing", not "OK"); ask for confirmation before the action runs. Never use `--cta` for destructive actions: terracotta is for buying and selling, not for errors.
