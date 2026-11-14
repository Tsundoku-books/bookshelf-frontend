import { useEffect, useId, useRef, useState, type ReactNode } from 'react'

interface MenuProps {
  trigger: ReactNode
  label: string
  testId: string
  align?: 'left' | 'right'
  children: ReactNode
}

// A click inside an element marked data-keep-open (the theme and language groups) leaves the panel open.
export function Menu({ trigger, label, testId, align = 'right', children }: MenuProps) {
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const panelId = useId()

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: MouseEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <div ref={root} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        aria-label={label}
        data-testid={testId}
        className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-text-muted transition-colors hover:bg-background hover:text-heading"
      >
        {trigger}
      </button>
      {open && (
        <div
          id={panelId}
          data-testid={`${testId}-panel`}
          onClick={(event) => {
            if (!(event.target as HTMLElement).closest('[data-keep-open]')) setOpen(false)
          }}
          className={`absolute top-full z-20 mt-2 min-w-56 rounded-xl border border-border bg-surface p-2 shadow-lg ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
        >
          {children}
        </div>
      )}
    </div>
  )
}

export const MENU_ITEM =
  'flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-text hover:bg-background hover:text-heading'
