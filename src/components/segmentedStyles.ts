export type SegmentedVariant = 'onLight' | 'onDark'

export const SEGMENTED_STYLES: Record<SegmentedVariant, { group: string; active: string; inactive: string }> = {
  onLight: {
    group: 'border-border bg-background',
    active: 'bg-surface text-heading shadow-sm',
    inactive: 'text-text-muted hover:text-text',
  },
  onDark: {
    group: 'border-on-hero/30 bg-on-hero/10',
    active: 'bg-surface text-heading shadow-sm',
    inactive: 'text-on-hero/70 hover:text-on-hero',
  },
}
