import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react'
import productsData from '../data/products.json'
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

const products = productsData as Product[]

/** Seeded to match the Figma review-panel demo state */
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

interface BundleContextValue {
  products: Product[]
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

export function BundleProvider({ children }: { children: ReactNode }) {
  const [, , persistBundle] = useLocalStorage<BundleState>(
    STORAGE_KEY,
    defaultBundleState,
  )

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
    [state],
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
    [],
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
