# TextField

A single-line text input: `surface` fill, `border` outline, `radius-sm`, as on the sheet.

- Markup: `<input class="ts-input">`.
- The consumer provides a visible label (or `aria-label`) and the input's `name`.
- Error: add `ts-input--error` (border turns `danger`), set `aria-invalid="true"`, and point `aria-describedby` at a `p.ts-field-error` right below the field. The message says how to fix the value; the red border alone is never the error.
