# Toggle

A switch for a setting that takes effect immediately, in the four looks the sheet shows.

- Markup: `button.ts-toggle[role=switch][aria-checked]` with `span.ts-toggle__track` and the label.
- On: `primary` track (default), `--sage` (`accent`) for secondary settings, `--cta` for a setting that starts a sale or purchase. Off: `surface` track with an `accent` edge.
- In light theme the off state's edge is 2.0:1 on `background`, below the 3:1 WCAG asks of control borders; kept as on the sheet. The label and `aria-checked` carry the state.
