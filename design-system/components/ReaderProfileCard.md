# ReaderProfileCard

The sheet's Reader Profile Card: avatar, title, a subtitle, two toggles and a primary/secondary button pair on a `surface` card.

- Markup: `article.ts-card.ts-profile` with `.ts-profile__head` (avatar, `.ts-profile__title`, `.ts-profile__subtitle`, `.ts-profile__toggles`) and `.ts-profile__actions`.
- Avatar: 72px circle in `background`. With no photo it shows the symbol, as on the sheet: `symbol-on-light` marked `ts-only-light` and `symbol-on-dark` marked `ts-only-dark`.
- The consumer provides the reader's name and subtitle, the toggles' labels (`aria-label` when unlabelled) and the two actions.
- In the card, the secondary button takes the `background` fill without a border, as on the sheet.
