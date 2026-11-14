function initialsOf(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return '?'
  const first = words[0][0]
  const last = words.length > 1 ? words[words.length - 1][0] : ''
  return (first + last).toUpperCase()
}

export function Avatar({ name }: { name: string }) {
  return (
    <span
      aria-hidden="true"
      data-testid="user-avatar"
      className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-on-primary"
    >
      {initialsOf(name)}
    </span>
  )
}
