import type { Product } from '../../types'
import { makeQuantityKey, useBundle } from '../../context/BundleContext'
import { formatCurrency } from '../../utils/pricing'
import { QuantityStepper } from '../QuantityStepper'
import { VariantSelector } from '../VariantSelector'

interface ProductCardProps {
  product: Product
}

/**
 * Laptop (xl+): horizontal card — image 101×137 left, content right (Frame 1735)
 * iPad (md–xl): vertical card — image on top, content below (Frame 1736)
 * Phone (<md): vertical full-width card (iPhone frame)
 */
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

  return (
    <article
      className={`relative flex min-w-0 flex-1 flex-col items-center gap-[19px] overflow-hidden rounded-[10px] border-2 bg-white px-[11px] py-[15px] transition-colors xl:flex-row xl:items-center xl:p-[11px] ${
        selected
          ? 'border-[rgba(78,47,210,0.7)]'
          : 'border-border'
      }`}
    >
      {/* Always HD catalog image — never color swatches */}
      <div className="relative aspect-[214/124] w-full shrink-0 rounded-[5px] xl:aspect-auto xl:h-[137px] xl:w-[101px]">
        {product.badge ? (
          <span className="absolute left-0 top-0 z-10 flex max-w-full items-center justify-center rounded-[10px] bg-brand px-1.5 py-0.5 text-[11px] font-semibold leading-none whitespace-nowrap text-white lg:text-[12px]">
            {product.badge}
          </span>
        ) : null}
        <div className="h-full w-full overflow-hidden rounded-[5px]">
          <img
            src={product.image}
            alt={product.title}
            className="block h-full w-full object-contain"
            loading="lazy"
          />
        </div>
      </div>

      <div className="flex w-full min-w-0 flex-1 flex-col gap-2.5 xl:max-w-[205px] xl:gap-2.5">
        <div className="flex flex-col gap-2 tracking-[0.6px]">
          <h3 className="text-lg font-semibold leading-none text-text-dark xl:text-base">
            {product.title}
          </h3>
          <p className="text-sm leading-[1.3] text-[rgba(31,31,31,0.75)] xl:text-[12px]">
            {product.description}{' '}
            {product.learnMoreUrl ? (
              <a
                href={product.learnMoreUrl}
                className="font-medium text-[#00e] underline"
              >
                Learn More
              </a>
            ) : null}
          </p>
        </div>

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

        <div className="mt-auto flex w-full items-center justify-between gap-2 pt-1">
          <QuantityStepper
            quantity={quantity}
            onChange={(next) => setQuantity(quantityKey, next)}
            label={`${product.title} quantity`}
            tone="card"
          />
          {/* iPad: prices inline; laptop: stacked */}
          <div className="flex flex-row items-center gap-1 tracking-[0.6px] xl:flex-col xl:items-end xl:gap-0.5">
            {product.compareAtPrice != null ? (
              <span className="text-base text-[#D8392B] line-through">
                {formatCurrency(product.compareAtPrice)}
              </span>
            ) : null}
            {product.price === 0 ? (
              <span className="text-base font-semibold text-[#575757]">
                FREE
              </span>
            ) : (
              <span className="text-base font-semibold text-[#575757]">
                {formatCurrency(product.price)}
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}
