import type { ProductVariant } from '../../types'
import { getVariantImage } from '../../data/variantImages'

interface VariantSelectorProps {
  productId: string
  variants: ProductVariant[]
  value: string
  onChange: (variantId: string) => void
  name: string
}

export function VariantSelector({
  productId,
  variants,
  value,
  onChange,
  name,
}: VariantSelectorProps) {
  return (
    <div className="flex flex-nowrap gap-2" role="radiogroup" aria-label={name}>
      {variants.map((variant) => {
        const selected = variant.variantId === value
        const image = getVariantImage(productId, variant.variantId)

        return (
          <button
            key={variant.variantId}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(variant.variantId)}
            className={
              selected
                ? 'box-border flex h-[26px] w-[65px] shrink-0 items-center justify-center gap-1 rounded-[2px] border-[0.5px] border-[#0AA288] bg-[rgba(29,240,187,0.04)] px-[3px] py-px text-xs font-medium text-brand'
                : 'box-border flex h-[26px] w-[63px] shrink-0 items-center justify-center gap-1 rounded-[2px] border-[0.5px] border-[#CCCCCC] bg-white px-[5px] py-px text-xs font-medium text-text-tertiary transition-colors hover:border-[#999]'
            }
          >
            {image ? (
              <img
                src={image}
                alt=""
                width={18}
                height={18}
                className="h-[18px] w-[18px] shrink-0 rounded-[2px] object-cover"
              />
            ) : (
              <span
                className="h-[18px] w-[18px] shrink-0 rounded-[3px] border border-black/10"
                style={{ backgroundColor: variant.swatchColor }}
                aria-hidden="true"
              />
            )}
            <span>{variant.label}</span>
          </button>
        )
      })}
    </div>
  )
}
