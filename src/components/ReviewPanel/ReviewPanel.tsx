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

  const lineSections = (
    <>
      {categoryOrder.map((category) => {
        const items = grouped.get(category)
        if (!items?.length) return null

        return (
          <section
            key={category}
            className="flex flex-col gap-2 border-t border-[#CED6DE] pt-[15px]"
          >
            <h3 className="text-xs uppercase leading-4 tracking-[0.36px] text-[#A8B2BD]">
              {categoryLabel[category]}
            </h3>
            <div className="flex flex-col gap-3">
              {items.map((item) => (
                <SummaryItem
                  key={`${item.productId}::${item.variantId}`}
                  item={item}
                />
              ))}
            </div>
          </section>
        )
      })}

      {planItem ? (
        <section className="flex flex-col gap-2 border-t border-[#CED6DE] pt-[15px]">
          <h3 className="text-xs uppercase leading-4 tracking-[0.36px] text-[#A8B2BD]">
            Plan
          </h3>
          <div className="flex items-center gap-3">
            <div className="flex h-[41px] w-[41px] shrink-0 items-center justify-center">
              <PlanShieldIcon />
            </div>
            <span className="min-w-0 flex-1 text-base font-bold tracking-[-0.04px] text-black md:text-xl xl:text-base">
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
            <div className="flex shrink-0 flex-col items-end whitespace-nowrap md:flex-row md:items-center md:gap-2.5 xl:flex-col xl:gap-0">
              {planItem.product.compareAtPrice != null ? (
                <span className="text-sm leading-4 tracking-[0.07px] text-text-tertiary line-through md:text-base xl:text-sm">
                  {formatCurrency(
                    planItem.product.compareAtPrice * planItem.quantity,
                  )}
                  /mo
                </span>
              ) : null}
              <span className="text-sm font-semibold leading-4 tracking-[0.07px] text-brand md:text-base xl:text-sm">
                {formatCurrency(planItem.product.price * planItem.quantity)}
                /mo
              </span>
            </div>
          </div>
        </section>
      ) : null}

      <section className="flex flex-col border-t border-[#CED6DE] pt-[15px]">
        <div className="flex items-center gap-3">
          <div className="flex h-[41px] w-[41px] shrink-0 items-center justify-center rounded-[5px] bg-white">
            <ShippingIcon />
          </div>
          <span className="flex-1 text-sm font-medium leading-4 text-ink md:text-lg">
            Fast Shipping
          </span>
          <div className="flex items-center gap-2.5 whitespace-nowrap">
            <span className="text-sm leading-4 tracking-[0.07px] text-text-tertiary line-through md:text-base xl:text-sm">
              {formatCurrency(pricing.shippingCompare)}
            </span>
            <span className="text-sm font-semibold leading-4 tracking-[0.07px] text-brand md:text-base xl:text-sm">
              FREE
            </span>
          </div>
        </div>
      </section>
    </>
  )

  const checkoutBlock = (
    <div className="flex w-full flex-col gap-2">
      {/* iPad: badge + returns copy side by side */}
      <div className="flex items-center gap-4 md:gap-6">
        <img
          src="/images/satisfaction-badge.png"
          alt="Satisfaction Guarantee"
          width={131}
          height={131}
          className="h-[78px] w-[78px] shrink-0 md:h-[131px] md:w-[131px] xl:h-[78px] xl:w-[78px]"
        />
        <div className="hidden min-w-0 flex-1 md:block xl:hidden">
          <p className="text-lg font-semibold leading-[1.1] tracking-[0.6px] text-text-dark">
            30-day hassle-free returns
          </p>
          <p className="mt-2 text-lg leading-[1.1] tracking-[0.6px] text-text-dark">
            If you&apos;re not totally in love with the product, we will refund
            you 100%.
          </p>
        </div>
        <div className="ml-auto flex flex-col items-end gap-2 md:hidden xl:flex">
          <div className="flex items-center justify-center rounded-[3px] bg-brand px-2 py-0.5">
            <span className="whitespace-nowrap text-xs font-medium leading-4 text-white">
              as low as {formatCurrency(pricing.monthlyPayment)}/mo
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-medium leading-5 text-text-tertiary line-through">
              {formatCurrency(pricing.compareTotal)}
            </span>
            <span className="text-2xl font-bold leading-8 text-brand">
              {formatCurrency(pricing.total)}
            </span>
          </div>
        </div>
      </div>

      {/* iPad financing + totals row */}
      <div className="hidden items-center justify-between md:flex xl:hidden">
        <div className="rounded-[3px] bg-brand p-2">
          <span className="whitespace-nowrap text-base font-medium tracking-[-0.8px] text-white">
            as low as {formatCurrency(pricing.monthlyPayment)}/mo
          </span>
        </div>
        <div className="flex flex-1 items-baseline justify-end gap-2">
          <span className="text-[22px] font-medium leading-5 text-text-tertiary line-through">
            {formatCurrency(pricing.compareTotal)}
          </span>
          <span className="text-[28px] font-bold leading-8 text-brand">
            {formatCurrency(pricing.total)}
          </span>
        </div>
      </div>

      {pricing.savings > 0 ? (
        <p className="text-center text-xs font-semibold leading-none text-accent-teal md:text-sm">
          Congrats! You&apos;re saving {formatCurrency(pricing.savings)} on your
          security bundle!
        </p>
      ) : null}

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
  )

  return (
    <aside
      className="flex w-full shrink-0 flex-col gap-[5px] rounded-[10px] bg-wash pt-[15px] xl:sticky xl:top-5 xl:w-[399px]"
      aria-label="Bundle review"
    >
      <p className="px-[15px] text-xs font-medium uppercase leading-none tracking-[1.6px] text-text-secondary">
        Review
      </p>

      <div className="flex flex-col gap-2.5 px-5 pb-8 pt-5 md:gap-0">
        {/*
          Phone + Laptop: single column
          iPad: two columns — lines | checkout (Frame 1736)
        */}
        <div className="flex flex-col gap-6 md:flex-row md:gap-[52px] xl:flex-col xl:gap-0">
          <div className="flex min-w-0 flex-1 flex-col gap-2.5 md:max-w-[552px] xl:max-w-none">
            <div className="flex flex-col gap-1.5 tracking-[0.6px]">
              <h2 className="text-[22px] font-semibold leading-none text-text-dark md:text-[28px] xl:text-[22px]">
                Your security system
              </h2>
              <p className="text-sm font-medium leading-[1.3] text-[rgba(31,31,31,0.75)] md:text-base xl:text-sm">
                Review your personalized protection system designed to keep what
                matters most safe.
              </p>
            </div>

            <div className="flex flex-col gap-2.5">{lineSections}</div>
          </div>

          <div className="w-full shrink-0 md:w-[486px] xl:mt-6 xl:w-full">
            {checkoutBlock}
          </div>
        </div>
      </div>
    </aside>
  )
}
