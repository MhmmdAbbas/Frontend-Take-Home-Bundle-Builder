import type { BundleLineItem } from '../../types'
import { makeQuantityKey, useBundle } from '../../context/BundleContext'
import { getVariantImage } from '../../data/variantImages'
import { formatCurrency } from '../../utils/pricing'
import { QuantityStepper } from '../QuantityStepper'

interface SummaryItemProps {
  item: BundleLineItem
  priceSuffix?: string
}

export function SummaryItem({ item, priceSuffix = '' }: SummaryItemProps) {
  const { setQuantity } = useBundle()
  const key = makeQuantityKey(item.productId, item.variantId)
  const image =
    getVariantImage(item.productId, item.variantId) ?? item.product.image
  const linePrice = item.product.price * item.quantity
  const lineCompare =
    item.product.compareAtPrice != null
      ? item.product.compareAtPrice * item.quantity
      : null

  const variantLabel =
    item.variantId !== 'default'
      ? item.product.variants?.find((v) => v.variantId === item.variantId)
          ?.label
      : undefined

  const displayName = variantLabel
    ? `${item.product.title} (${variantLabel})`
    : item.product.title

  return (
    <div className="grid grid-cols-[41px_1fr_72px_auto] items-center gap-3">
      <img
        src={image}
        alt=""
        width={41}
        height={41}
        className="h-[41px] w-[41px] shrink-0 rounded-[5px] bg-white object-contain"
      />
      <span className="text-xs font-medium leading-4 tracking-[0.06px] text-ink">
        {displayName}
      </span>
      <QuantityStepper
        quantity={item.quantity}
        onChange={(quantity) => setQuantity(key, quantity)}
        tone="review"
        label={`${displayName} quantity`}
      />
      <div className="flex shrink-0 flex-col items-end whitespace-nowrap">
        {lineCompare != null ? (
          <span className="text-xs leading-4 text-text-tertiary line-through">
            {formatCurrency(lineCompare)}
            {priceSuffix}
          </span>
        ) : null}
        {item.product.price === 0 ? (
          <span className="text-xs font-semibold leading-4 text-brand">
            FREE
          </span>
        ) : (
          <span className="text-xs font-semibold leading-4 text-brand">
            {formatCurrency(linePrice)}
            {priceSuffix}
          </span>
        )}
      </div>
    </div>
  )
}
