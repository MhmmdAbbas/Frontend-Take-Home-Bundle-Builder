import type { Product } from '../../types'
import { makeQuantityKey, useBundle } from '../../context/BundleContext'
import { getVariantImage } from '../../data/variantImages'
import { formatCurrency } from '../../utils/pricing'
import { QuantityStepper } from '../QuantityStepper'
import { VariantSelector } from '../VariantSelector'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const {
    getActiveVariant,
    getQuantity,
    setActiveVariant,
    setQuantity,
  } = useBundle()

  const hasVariants = Boolean(product.variants?.length)
  const activeVariantId = getActiveVariant(product)
  const quantityKey = makeQuantityKey(product.productId, activeVariantId)
  const quantity = getQuantity(product.productId, activeVariantId)
  const selected = quantity > 0
  const imageSrc =
    getVariantImage(product.productId, activeVariantId) ?? product.image

  return (
    <article
      className={`relative flex min-w-0 flex-1 items-center gap-[13px] rounded-[10px] border bg-white p-[11px] transition-[border-color,box-shadow] max-w-[360px] ${
        selected
          ? 'border-brand shadow-[0_0_0_1px_#4E2FD2]'
          : 'border-border'
      }`}
    >
      {product.badge ? (
        <span className="absolute left-1.5 top-1.5 z-10 flex h-[19px] w-[65px] items-center justify-center rounded-[10px] bg-brand px-1.5 text-[11px] font-semibold whitespace-nowrap text-white">
          {product.badge}
        </span>
      ) : null}

      <div className="relative shrink-0">
        <img
          src={imageSrc}
          alt={product.title}
          width={101}
          height={101}
          className="block h-auto w-[101px] rounded-[5px]"
          loading="lazy"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <h3 className="text-base font-semibold text-ink">{product.title}</h3>
        <p className="text-sm leading-[1.4] text-text-tertiary">
          {product.description}{' '}
          {product.learnMoreUrl ? (
            <a
              href={product.learnMoreUrl}
              className="whitespace-nowrap font-medium text-brand underline"
            >
              Learn More
            </a>
          ) : null}
        </p>

        {hasVariants && product.variants ? (
          <VariantSelector
            productId={product.productId}
            variants={product.variants}
            value={activeVariantId}
            onChange={(variantId) =>
              setActiveVariant(product.productId, variantId)
            }
            name={`${product.title} color`}
          />
        ) : null}

        <div className="mt-auto flex items-center justify-between gap-2">
          <QuantityStepper
            quantity={quantity}
            onChange={(next) => setQuantity(quantityKey, next)}
            label={`${product.title} quantity`}
            tone="card"
          />
          <div className="flex flex-col items-end whitespace-nowrap">
            {product.compareAtPrice != null ? (
              <span className="text-base tracking-[0.6px] text-[#D8392B] line-through">
                {formatCurrency(product.compareAtPrice)}
              </span>
            ) : null}
            {product.price === 0 ? (
              <span className="text-base tracking-[0.6px] text-[#575757]">
                FREE
              </span>
            ) : (
              <span className="text-base tracking-[0.6px] text-[#575757]">
                {formatCurrency(product.price)}
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}
