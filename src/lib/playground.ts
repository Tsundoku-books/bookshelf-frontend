export const BUG_IDS = [
  'api-create-book-status-200',
  'api-stats-total-off-by-one',
  'api-slow-book-list',
  'ui-cover-without-alt',
  'ui-dashboard-title-typo',
] as const

export type BugId = (typeof BUG_IDS)[number]

export const BUG_AREAS = ['books', 'stats', 'dashboard'] as const

export type BugArea = (typeof BUG_AREAS)[number]
