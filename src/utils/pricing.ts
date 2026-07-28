import type {
  BundleLineItem,
  BundlePricing,
  BundleState,
  Product,
} from '../types'

export const SHIPPING_COMPARE = 5.99
export const SHIPPING_PRICE = 0

export function makeQuantityKey(productId: string, variantId = 'default'): string {
  return `${productId}::${variantId}`
}

export function parseQuantityKey(key: string): {
  productId: string
  variantId: string
} {
  const [productId, variantId = 'default'] = key.split('::')
  return { productId, variantId }
}

export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`
}

export function getActiveVariantId(
  product: Product,
  activeVariants: Record<string, string>,
): string {
  if (!product.variants?.length) return 'default'
  return activeVariants[product.productId] ?? product.variants[0].variantId
}

export function getProductQuantity(
  quantities: Record<string, number>,
  productId: string,
  variantId: string,
): number {
  return quantities[makeQuantityKey(productId, variantId)] ?? 0
}

/** Distinct products in a step with any variant quantity > 0 */
export function countSelectedProducts(
  products: Product[],
  quantities: Record<string, number>,
): number {
  return products.filter((product) => {
    if (product.variants?.length) {
      return product.variants.some(
        (variant) =>
          (quantities[makeQuantityKey(product.productId, variant.variantId)] ??
            0) > 0,
      )
    }
    return (quantities[makeQuantityKey(product.productId)] ?? 0) > 0
  }).length
}

export function buildLineItems(
  quantities: Record<string, number>,
  products: Product[],
): BundleLineItem[] {
  const catalog = new Map(products.map((product) => [product.productId, product]))

  return Object.entries(quantities)
    .filter(([, quantity]) => quantity > 0)
    .map(([key, quantity]) => {
      const { productId, variantId } = parseQuantityKey(key)
      const product = catalog.get(productId)
      if (!product) return null
      return { productId, variantId, quantity, product }
    })
    .filter((item): item is BundleLineItem => item != null)
}

export function calculateBundlePricing(
  state: BundleState,
  products: Product[],
): BundlePricing {
  const lineItems = buildLineItems(state.quantities, products)
  const hardwareItems = lineItems.filter((item) => item.product.category !== 'plan')
  const planItem = lineItems.find((item) => item.product.category === 'plan')

  const hardwareSubtotal = hardwareItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  )
  const hardwareCompare = hardwareItems.reduce(
    (sum, item) =>
      sum + (item.product.compareAtPrice ?? item.product.price) * item.quantity,
    0,
  )

  const hasPlan = Boolean(planItem)
  const planPrice = planItem
    ? planItem.product.price * planItem.quantity
    : 0
  const planCompare = planItem
    ? (planItem.product.compareAtPrice ?? planItem.product.price) *
      planItem.quantity
    : 0

  const total = hardwareSubtotal + planPrice + SHIPPING_PRICE
  // Figma struck grand total excludes shipping compare
  const compareTotal = hardwareCompare + planCompare
  const savings = Math.max(0, compareTotal - total)

  return {
    lineItems,
    hardwareSubtotal,
    hardwareCompare,
    planPrice,
    planCompare,
    shippingCompare: SHIPPING_COMPARE,
    shippingPrice: SHIPPING_PRICE,
    compareTotal,
    total,
    savings,
    // Matches Figma "as low as $19.19/mo" for seeded total $187.89
    monthlyPayment: total > 0 ? Math.round(total * 0.10214 * 100) / 100 : 0,
    hasPlan,
  }
}
