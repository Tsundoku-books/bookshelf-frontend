import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useAuth } from './AuthContext'
import { playgroundService } from '../services/playground.service'
import type { PlaygroundBug } from '../types/playground'

interface PlaygroundContextType {
  bugs: PlaygroundBug[]
  /** True when the signed-in account switched this bug on. UI bugs are applied by checking it. */
  isOn: (id: string) => boolean
  activeCount: number
  setEnabled: (ids: string[]) => Promise<void>
}

// Components outside the provider (and the tests that render them alone) simply see every bug off.
const PlaygroundContext = createContext<PlaygroundContextType>({
  bugs: [],
  isOn: () => false,
  activeCount: 0,
  setEnabled: async () => {},
})

export function PlaygroundProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()
  const [bugs, setBugs] = useState<PlaygroundBug[]>([])

  useEffect(() => {
    if (!isAuthenticated) return
    let cancelled = false
    playgroundService
      .list()
      .then((list) => {
        if (!cancelled) setBugs(list)
      })
      .catch(() => {
        // The playground is optional: without the list every bug stays off.
      })
    return () => {
      cancelled = true
    }
  }, [isAuthenticated])

  const setEnabled = useCallback(async (ids: string[]) => {
    setBugs(await playgroundService.setEnabled(ids))
  }, [])

  const value = useMemo<PlaygroundContextType>(() => {
    const visible = isAuthenticated ? bugs : []
    const on = new Set(visible.filter((bug) => bug.enabled).map((bug) => bug.id))
    return { bugs: visible, isOn: (id) => on.has(id), activeCount: on.size, setEnabled }
  }, [bugs, isAuthenticated, setEnabled])

  return <PlaygroundContext.Provider value={value}>{children}</PlaygroundContext.Provider>
}

export function usePlayground(): PlaygroundContextType {
  return useContext(PlaygroundContext)
}
