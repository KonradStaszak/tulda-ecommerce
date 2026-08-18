import { useEffect, useState } from 'react'
import type { CatalogueData } from './repository'
import { getCatalogue } from './repository'

export interface CatalogueState {
  data: CatalogueData | null
  loading: boolean
  error: Error | null
}

export function useCatalogue(): CatalogueState {
  const [state, setState] = useState<CatalogueState>({ data: null, loading: true, error: null })

  useEffect(() => {
    let active = true
    getCatalogue()
      .then((data) => active && setState({ data, loading: false, error: null }))
      .catch((error: unknown) => active && setState({ data: null, loading: false, error: error instanceof Error ? error : new Error('Unable to load catalogue.') }))
    return () => { active = false }
  }, [])

  return state
}
