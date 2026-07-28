import type { BundleLineItem } from '../../types'
import { makeQuantityKey, useBundle } from '../../context/BundleContext'
import { formatCurrency } from '../../utils/pricing'
import { QuantityStepper } from '../QuantityStepper'

interface SummaryItemProps {
  item: BundleLineItem
  priceSuffix?: string
}

export function SummaryItem({ item, priceSuffix = '' }: SummaryItemProps) {
  const { setQuantity } = useBundle()
  const key = makeQuantityKey(item.productId, item.variantId)
  const linePrice = item.product.price * item.quantity
  const lineCompare =
    item.product.compareAtPrice != null
      ? item.product.compareAtPrice * item.quantity
      : null

  const displayName = item.product.title

  return (
    <div className="flex items-center gap-3 md:gap-4">
      <img
        src={item.product.image}
        alt=""
        width={41}
        height={41}
        className="h-[41px] w-[41px] shrink-0 rounded-[5px] bg-white object-contain"
      />
      <span className="min-w-0 flex-1 text-[14px] font-medium leading-4 tracking-[0.07px] text-ink md:text-lg md:tracking-[0.09px] xl:text-[14px]">
        {displayName}
      </span>
      <QuantityStepper
        quantity={item.quantity}
        onChange={(quantity) => setQuantity(key, quantity)}
        tone="review"
        label={`${displayName} quantity`}
      />
      {/* Phone/laptop: stacked prices · iPad: inline */}
      <div className="flex shrink-0 flex-col items-end whitespace-nowrap md:flex-row md:items-center md:gap-2.5 xl:flex-col xl:gap-0">
        {lineCompare != null ? (
          <span className="text-sm leading-4 tracking-[0.07px] text-text-tertiary line-through md:text-base xl:text-sm">
            {formatCurrency(lineCompare)}
            {priceSuffix}
          </span>
        ) : null}
        {item.product.price === 0 ? (
          <span className="text-sm font-semibold leading-4 tracking-[0.07px] text-brand md:text-base xl:text-sm">
            FREE
          </span>
        ) : (
          <span className="text-sm font-semibold leading-4 tracking-[0.07px] text-brand md:text-base xl:text-sm">
            {formatCurrency(linePrice)}
            {priceSuffix}
          </span>
        )}
      </div>
    </div>
  )
}
