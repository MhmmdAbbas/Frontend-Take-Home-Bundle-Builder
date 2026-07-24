export type Category = 'cameras' | 'plan' | 'sensors' | 'accessories'

export interface ProductVariant {
  variantId: string
  label: string
  swatchColor: string
}

export interface Product {
  productId: string
  category: Category
  step: number
  title: string
  description: string
  image: string
  badge?: string
  variants?: ProductVariant[]
  price: number
  compareAtPrice?: number
  learnMoreUrl?: string
}

/** Normalized quantity key: `${productId}::${variantId}` */
export type QuantityKey = string

export interface BundleState {
  currentStep: number
  /** Per-variant quantities. Keys never overwrite sibling variants. */
  quantities: Record<QuantityKey, number>
  /** UI-only: which variant is currently shown on each product card */
  activeVariants: Record<string, string>
}

export type BundleAction =
  | { type: 'SET_QUANTITY'; key: QuantityKey; quantity: number }
  | { type: 'SET_STEP'; step: number }
  | { type: 'SET_ACTIVE_VARIANT'; productId: string; variantId: string }
  | { type: 'RESTORE'; state: BundleState }

export interface BundleLineItem {
  productId: string
  variantId: string
  quantity: number
  product: Product
}

export interface BundlePricing {
  lineItems: BundleLineItem[]
  hardwareSubtotal: number
  hardwareCompare: number
  planPrice: number
  planCompare: number
  shippingCompare: number
  shippingPrice: number
  compareTotal: number
  total: number
  savings: number
  monthlyPayment: number
  hasPlan: boolean
}

export interface StepConfig {
  step: number
  title: string
  nextLabel: string
}
