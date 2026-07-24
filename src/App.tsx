import type { ReactNode } from 'react'
import { BundleProvider, useBundle } from './context/BundleContext'
import { Home } from './pages/Home'
import { Button } from './components/Button'

function CatalogGate({ children }: { children: ReactNode }) {
  const { catalogStatus, catalogError, reloadCatalog } = useBundle()

  if (catalogStatus === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-5">
        <p className="text-base font-medium text-text-secondary">
          Loading products…
        </p>
      </div>
    )
  }

  if (catalogStatus === 'error') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white px-5 text-center">
        <p className="text-base font-medium text-ink">
          Couldn’t load the product catalog.
        </p>
        <p className="max-w-md text-sm text-text-secondary">
          {catalogError ?? 'Make sure the API is running, then try again.'}
        </p>
        <Button variant="outline" onClick={reloadCatalog}>
          Retry
        </Button>
      </div>
    )
  }

  return children
}

export default function App() {
  return (
    <BundleProvider>
      <CatalogGate>
        <Home />
      </CatalogGate>
    </BundleProvider>
  )
}
