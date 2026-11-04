# Select

The sheet's dropdown: a native `<select>` styled like the input field, with a chevron.

- Markup: `span.ts-select` wrapping a native `select`.
- The consumer provides the options and a label.
- Error: add `ts-select--error` to the wrapper (the select's border turns `danger`), set `aria-invalid="true"` on the select, and point `aria-describedby` at a `p.ts-field-error` below it.
