import { MinusIcon, PlusIcon } from '../icons'

interface QuantityStepperProps {
  quantity: number
  onChange: (quantity: number) => void
  min?: number
  max?: number
  tone?: 'card' | 'review'
  label?: string
}

export function QuantityStepper({
  quantity,
  onChange,
  min = 0,
  max = 99,
  tone = 'card',
  label = 'Quantity',
}: QuantityStepperProps) {
  const canDecrease = quantity > min
  const canIncrease = quantity < max

  return (
    <div
      className="flex w-[72px] items-center justify-between py-1"
      role="group"
      aria-label={label}
    >
      <button
        type="button"
        aria-label="Decrease quantity"
        disabled={!canDecrease}
        onClick={() => onChange(quantity - 1)}
        className={
          tone === 'card'
            ? 'flex h-5 w-5 items-center justify-center rounded bg-[#F0F4F7] text-[#575757] transition-colors hover:bg-[#e4ebf1] disabled:border-2 disabled:border-[#E6EBF0] disabled:bg-white disabled:opacity-100'
            : 'flex h-5 w-5 items-center justify-center rounded bg-white text-[#575757] transition-colors hover:bg-[#f5f5f5] disabled:cursor-default disabled:opacity-30'
        }
      >
        <MinusIcon />
      </button>
      <span
        className="w-2 text-center text-sm font-semibold leading-4 text-ink"
        aria-live="polite"
      >
        {quantity}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        disabled={!canIncrease}
        onClick={() => onChange(quantity + 1)}
        className={
          tone === 'card'
            ? 'flex h-5 w-5 items-center justify-center rounded bg-[#F0F4F7] text-[#575757] transition-colors hover:bg-[#e4ebf1] disabled:border-2 disabled:border-[#E6EBF0] disabled:bg-white disabled:opacity-100'
            : 'flex h-5 w-5 items-center justify-center rounded bg-white text-[#575757] transition-colors hover:bg-[#f5f5f5] disabled:cursor-default disabled:opacity-30'
        }
      >
        <PlusIcon />
      </button>
    </div>
  )
}
