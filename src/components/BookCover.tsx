import { useState } from 'react'
import { BookOpen } from 'lucide-react'
import { usePlayground } from '../contexts/PlaygroundContext'

interface BookCoverProps {
  url: string
  alt: string
  className?: string
  testId?: string
}

/** Cover thumbnail that falls back to a placeholder when the image cannot load. */
export function BookCover({ url, alt, className = 'h-20 w-14', testId }: BookCoverProps) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null)
  const { isOn } = usePlayground()

  if (failedUrl === url) {
    return (
      <div
        className={`${className} flex flex-shrink-0 items-center justify-center rounded bg-background`}
        aria-hidden="true"
      >
        <BookOpen className="h-5 w-5 text-text-muted" />
      </div>
    )
  }

  return (
    <img
      src={url}
      alt={isOn('ui-cover-without-alt') ? '' : alt}
      loading="lazy"
      onError={() => setFailedUrl(url)}
      className={`${className} flex-shrink-0 rounded object-cover shadow-sm`}
      data-testid={testId}
    />
  )
}
