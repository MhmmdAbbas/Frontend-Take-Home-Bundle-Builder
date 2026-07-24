import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import type {
  BundleAction,
  BundlePricing,
  BundleState,
  Product,
} from '../types'
import {
  calculateBundlePricing,
  countSelectedProducts,
  getActiveVariantId,
  getProductQuantity,
  makeQuantityKey,
} from '../utils/pricing'
import { STORAGE_KEY } from '../utils/storage'

/** Seeded to match the review-panel demo state */
export const defaultBundleState: BundleState = {
  currentStep: 1,
  quantities: {
    'wyze-cam-v4::white': 1,
    'wyze-cam-pan-v3::white': 2,
    'cam-unlimited::default': 1,
    'wyze-sense-motion-sensor::default': 2,
    'wyze-sense-hub::default': 1,
    'wyze-microsd-card::default': 2,
  },
  activeVariants: {
    'wyze-cam-v4': 'white',
    'wyze-cam-pan-v3': 'white',
    'wyze-cam-floodlight-v2': 'white',
    'wyze-battery-cam-pro': 'white',
  },
}

function bundleReducer(state: BundleState, action: BundleAction): BundleState {
  switch (action.type) {
    case 'SET_QUANTITY': {
      const quantities = { ...state.quantities }
      if (action.quantity > 0) {
        quantities[action.key] = action.quantity
      } else {
        delete quantities[action.key]
      }
      return { ...state, quantities }
    }
    case 'SET_STEP':
      return { ...state, currentStep: action.step }
    case 'SET_ACTIVE_VARIANT':
      return {
        ...state,
        activeVariants: {
          ...state.activeVariants,
          [action.productId]: action.variantId,
        },
      }
    case 'RESTORE':
      return action.state
    default:
      return state
  }
}

type CatalogStatus = 'loading' | 'ready' | 'error'

interface BundleContextValue {
  products: Product[]
  catalogStatus: CatalogStatus
  catalogError: string | null
  reloadCatalog: () => void
  state: BundleState
  pricing: BundlePricing
  setQuantity: (key: string, quantity: number) => void
  setActiveVariant: (productId: string, variantId: string) => void
  setStep: (step: number) => void
  toggleStep: (step: number) => void
  goToNextStep: (fromStep: number) => void
  getQuantity: (productId: string, variantId?: string) => number
  getActiveVariant: (product: Product) => string
  getStepSelectedCount: (step: number) => number
  getProductsByStep: (step: number) => Product[]
  saveForLater: () => void
}

const BundleContext = createContext<BundleContextValue | null>(null)

async function fetchProducts(): Promise<Product[]> {
  const response = await fetch('/api/products')
  if (!response.ok) {
    throw new Error(`Failed to load products (${response.status})`)
  }
  return (await response.json()) as Product[]
}

export function BundleProvider({ children }: { children: ReactNode }) {
  const [, , persistBundle] = useLocalStorage<BundleState>(
    STORAGE_KEY,
    defaultBundleState,
  )

  const [products, setProducts] = useState<Product[]>([])
  const [catalogStatus, setCatalogStatus] = useState<CatalogStatus>('loading')
  const [catalogError, setCatalogError] = useState<string | null>(null)
  const [catalogTick, setCatalogTick] = useState(0)

  useEffect(() => {
    let cancelled = false

    setCatalogStatus('loading')
    setCatalogError(null)

    fetchProducts()
      .then((data) => {
        if (cancelled) return
        setProducts(data)
        setCatalogStatus('ready')
      })
      .catch((error: unknown) => {
        if (cancelled) return
        setProducts([])
        setCatalogStatus('error')
        setCatalogError(
          error instanceof Error ? error.message : 'Failed to load products',
        )
      })

    return () => {
      cancelled = true
    }
  }, [catalogTick])

  const reloadCatalog = useCallback(() => {
    setCatalogTick((tick) => tick + 1)
  }, [])

  const [state, dispatch] = useReducer(
    bundleReducer,
    defaultBundleState,
    (fallback) => {
      try {
        const saved = window.localStorage.getItem(STORAGE_KEY)
        if (saved) return JSON.parse(saved) as BundleState
      } catch {
        // fall through
      }
      return fallback
    },
  )

  const pricing = useMemo(
    () => calculateBundlePricing(state, products),
    [state, products],
  )

  const setQuantity = useCallback((key: string, quantity: number) => {
    dispatch({ type: 'SET_QUANTITY', key, quantity })
  }, [])

  const setActiveVariant = useCallback(
    (productId: string, variantId: string) => {
      dispatch({ type: 'SET_ACTIVE_VARIANT', productId, variantId })
    },
    [],
  )

  const setStep = useCallback((step: number) => {
    dispatch({ type: 'SET_STEP', step })
  }, [])

  const toggleStep = useCallback(
    (step: number) => {
      dispatch({
        type: 'SET_STEP',
        step: state.currentStep === step ? 0 : step,
      })
    },
    [state.currentStep],
  )

  const goToNextStep = useCallback((fromStep: number) => {
    dispatch({ type: 'SET_STEP', step: Math.min(fromStep + 1, 4) })
  }, [])

  const getQuantity = useCallback(
    (productId: string, variantId = 'default') =>
      getProductQuantity(state.quantities, productId, variantId),
    [state.quantities],
  )

  const getActiveVariant = useCallback(
    (product: Product) => getActiveVariantId(product, state.activeVariants),
    [state.activeVariants],
  )

  const getProductsByStep = useCallback(
    (step: number) => products.filter((product) => product.step === step),
    [products],
  )

  const getStepSelectedCount = useCallback(
    (step: number) =>
      countSelectedProducts(getProductsByStep(step), state.quantities),
    [getProductsByStep, state.quantities],
  )

  const saveForLater = useCallback(() => {
    persistBundle(state)
  }, [persistBundle, state])

  const value = useMemo(
    () => ({
      products,
      catalogStatus,
      catalogError,
      reloadCatalog,
      state,
      pricing,
      setQuantity,
      setActiveVariant,
      setStep,
      toggleStep,
      goToNextStep,
      getQuantity,
      getActiveVariant,
      getStepSelectedCount,
      getProductsByStep,
      saveForLater,
    }),
    [
      products,
      catalogStatus,
      catalogError,
      reloadCatalog,
      state,
      pricing,
      setQuantity,
      setActiveVariant,
      setStep,
      toggleStep,
      goToNextStep,
      getQuantity,
      getActiveVariant,
      getStepSelectedCount,
      getProductsByStep,
      saveForLater,
    ],
  )

  return (
    <BundleContext.Provider value={value}>{children}</BundleContext.Provider>
  )
}

export function useBundle(): BundleContextValue {
  const context = useContext(BundleContext)
  if (!context) {
    throw new Error('useBundle must be used within a BundleProvider')
  }
  return context
}

export { makeQuantityKey }
