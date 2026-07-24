import { useMemo, useState } from 'react'
import type { BundleLineItem, Category } from '../../types'
import { makeQuantityKey, useBundle } from '../../context/BundleContext'
import { formatCurrency } from '../../utils/pricing'
import { PlanShieldIcon, ShippingIcon } from '../icons'
import { Button } from '../Button'
import { QuantityStepper } from '../QuantityStepper'
import { SummaryItem } from '../SummaryItem'

const categoryLabel: Record<Exclude<Category, 'plan'>, string> = {
  cameras: 'Cameras',
  sensors: 'Sensors',
  accessories: 'Accessories',
}

const categoryOrder: Array<Exclude<Category, 'plan'>> = [
  'cameras',
  'sensors',
  'accessories',
]

export function ReviewPanel() {
  const { pricing, saveForLater, setQuantity } = useBundle()
  const [savedMessage, setSavedMessage] = useState<string | null>(null)
  const [checkoutMessage, setCheckoutMessage] = useState<string | null>(null)

  const planItem = useMemo(
    () => pricing.lineItems.find((item) => item.product.category === 'plan'),
    [pricing.lineItems],
  )

  const grouped = useMemo(() => {
    const map = new Map<Exclude<Category, 'plan'>, BundleLineItem[]>()
    for (const item of pricing.lineItems) {
      if (item.product.category === 'plan') continue
      const category = item.product.category as Exclude<Category, 'plan'>
      const list = map.get(category) ?? []
      list.push(item)
      map.set(category, list)
    }
    return map
  }, [pricing.lineItems])

  const handleSave = () => {
    saveForLater()
    setSavedMessage('Your system has been saved for later.')
    window.setTimeout(() => setSavedMessage(null), 2500)
  }

  const handleCheckout = () => {
    setCheckoutMessage(
      'Checkout is a prototype placeholder — your bundle is ready.',
    )
    window.setTimeout(() => setCheckoutMessage(null), 3000)
  }

  return (
    <aside
      className="w-full shrink-0 rounded-[10px] bg-wash p-5 lg:sticky lg:top-5 lg:w-[399px]"
      aria-label="Bundle review"
    >
      <p className="mb-2 text-xs font-medium uppercase leading-none tracking-[1.6px] text-text-secondary">
        Review
      </p>
      <h2 className="mb-1 pt-2 text-[22px] font-semibold leading-none tracking-[0.6px] text-text-dark">
        Your security system
      </h2>
      <p className="mb-4 pt-2 text-sm font-medium leading-[130%] tracking-[0.6px] text-[rgba(31,31,31,0.75)]">
        Review your personalized protection system designed to keep what
        matters most safe.
      </p>

      <div className="flex flex-col">
        {categoryOrder.map((category) => {
          const items = grouped.get(category)
          if (!items?.length) return null

          return (
            <section
              key={category}
              className="mt-3 flex flex-col gap-3 border-t border-[#CED6DE] pt-[15px] first:mt-0"
            >
              <h3 className="text-xs uppercase leading-4 tracking-[0.03em] text-[#A8B2BD]">
                {categoryLabel[category]}
              </h3>
              {items.map((item) => (
                <SummaryItem
                  key={`${item.productId}::${item.variantId}`}
                  item={item}
                />
              ))}
            </section>
          )
        })}

        {planItem ? (
          <section className="mt-3 flex flex-col gap-3 border-t border-[#CED6DE] pt-[15px]">
            <h3 className="text-xs uppercase leading-4 tracking-[0.03em] text-[#A8B2BD]">
              Plan
            </h3>
            <div className="grid grid-cols-[41px_1fr_72px_auto] items-center gap-3">
              <div className="flex h-[41px] w-[41px] shrink-0 items-center justify-center">
                <PlanShieldIcon />
              </div>
              <span className="text-base font-bold tracking-[-0.002em] text-black">
                Cam <span className="text-brand">Unlimited</span>
              </span>
              <QuantityStepper
                quantity={planItem.quantity}
                onChange={(quantity) =>
                  setQuantity(
                    makeQuantityKey(planItem.productId, planItem.variantId),
                    quantity,
                  )
                }
                tone="review"
                label="Cam Unlimited quantity"
              />
              <div className="flex flex-col items-end whitespace-nowrap">
                {planItem.product.compareAtPrice != null ? (
                  <span className="text-xs leading-4 text-text-tertiary line-through">
                    {formatCurrency(
                      planItem.product.compareAtPrice * planItem.quantity,
                    )}
                    /mo
                  </span>
                ) : null}
                <span className="text-xs font-semibold leading-4 text-brand">
                  {formatCurrency(planItem.product.price * planItem.quantity)}
                  /mo
                </span>
              </div>
            </div>
          </section>
        ) : null}

        <section className="mt-3 flex flex-col gap-3 border-t border-[#CED6DE] pt-[15px]">
          <h3 className="text-xs uppercase leading-4 tracking-[0.03em] text-[#A8B2BD]">
            Shipping
          </h3>
          <div className="flex items-center gap-2">
            <div className="flex h-[41px] w-[41px] shrink-0 items-center justify-center rounded-[5px] bg-white">
              <ShippingIcon />
            </div>
            <span className="flex-1 text-sm font-semibold leading-4 text-ink">
              Fast Shipping
            </span>
            <div className="flex flex-col items-end whitespace-nowrap">
              <span className="text-xs leading-4 text-text-tertiary line-through">
                {formatCurrency(pricing.shippingCompare)}
              </span>
              <span className="text-xs font-semibold leading-4 text-brand">
                FREE
              </span>
            </div>
          </div>
        </section>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <img
          src="/images/satisfaction-badge.png"
          alt="Satisfaction Guarantee"
          width={78}
          height={78}
          className="h-[78px] w-[78px]"
        />
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center justify-center rounded-[3px] bg-brand px-[5px] py-0.5">
            <span className="whitespace-nowrap text-xs font-medium leading-4 text-white">
              as low as {formatCurrency(pricing.monthlyPayment)}/mo
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-medium leading-5 tracking-[0.0025em] text-text-tertiary line-through">
              {formatCurrency(pricing.compareTotal)}
            </span>
            <span className="text-2xl font-bold leading-8 tracking-[-0.00125em] text-brand">
              {formatCurrency(pricing.total)}
            </span>
          </div>
        </div>
      </div>

      {pricing.savings > 0 ? (
        <p className="mt-3 text-center text-xs font-semibold leading-4 text-accent-teal">
          Congrats! You&apos;re saving {formatCurrency(pricing.savings)} on
          your security bundle!
        </p>
      ) : null}

      <div className="mt-1 flex flex-col gap-3">
        <Button variant="primary" onClick={handleCheckout}>
          Checkout
        </Button>
        <Button variant="ghost" onClick={handleSave}>
          Save my system for later
        </Button>
        {checkoutMessage ? (
          <p className="text-center text-xs text-brand" role="status">
            {checkoutMessage}
          </p>
        ) : null}
        {savedMessage ? (
          <p className="text-center text-xs text-accent-teal" role="status">
            {savedMessage}
          </p>
        ) : null}
      </div>
    </aside>
  )
}
