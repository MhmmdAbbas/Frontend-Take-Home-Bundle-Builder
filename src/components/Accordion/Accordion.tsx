import { useId, useRef, type ReactNode } from 'react'
import { flushSync } from 'react-dom'
import { ChevronUp } from '../icons'
import { Button } from '../Button'

interface AccordionProps {
  step: number
  totalSteps?: number
  title: string
  icon: ReactNode
  selectedCount: number
  isOpen: boolean
  onToggle: () => void
  nextLabel?: string
  onNext?: () => void
  showNext?: boolean
  children: ReactNode
}

/** Keep the clicked accordion header at the same viewport Y after open/close. */
function preserveHeaderViewportPosition(
  header: HTMLElement | null,
  update: () => void,
) {
  if (!header) {
    update()
    return
  }

  const topBefore = header.getBoundingClientRect().top
  flushSync(update)

  const delta = header.getBoundingClientRect().top - topBefore
  if (Math.abs(delta) > 0.5) {
    window.scrollBy(0, delta)
  }
}

export function Accordion({
  step,
  totalSteps = 4,
  title,
  icon,
  selectedCount,
  isOpen,
  onToggle,
  nextLabel,
  onNext,
  showNext = false,
  children,
}: AccordionProps) {
  const panelId = useId()
  const headerId = useId()
  const headerRef = useRef<HTMLButtonElement>(null)

  const handleToggle = () => {
    preserveHeaderViewportPosition(headerRef.current, onToggle)
  }

  return (
    <section
      className={
        isOpen
          ? 'overflow-hidden rounded-[10px] bg-wash transition-colors [overflow-anchor:none]'
          : 'bg-white transition-colors [overflow-anchor:none]'
      }
    >
      <p className="px-[15px] pb-1 pt-2 text-[10px] font-medium uppercase leading-none tracking-[1.6px] text-text-secondary">
        Step {step} of {totalSteps}
      </p>

      <h2 className="m-0 text-inherit font-inherit">
        <button
          ref={headerRef}
          id={headerId}
          type="button"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={handleToggle}
          className={`flex w-full items-center justify-between border-y border-[rgba(31,31,31,0.5)] bg-transparent px-[15px] py-5 text-left ${
            isOpen ? 'border-b-transparent' : ''
          }`}
        >
          <span className="flex items-center gap-2">
            <span className="flex items-center justify-center">{icon}</span>
            <span className="text-lg font-semibold leading-none text-ink">
              {title}
            </span>
            <span className="whitespace-nowrap text-sm font-medium leading-4 text-brand">
              {selectedCount} selected
            </span>
          </span>
          <span
            className={`flex transition-transform ${isOpen ? '' : 'rotate-180'}`}
          >
            <ChevronUp />
          </span>
        </button>
      </h2>

      {isOpen ? (
        <div
          id={panelId}
          role="region"
          aria-labelledby={headerId}
          className="flex flex-col gap-3 px-[22px] pb-5 pt-1"
        >
          {children}
          {showNext && nextLabel && onNext ? (
            <Button variant="outline" onClick={onNext}>
              Next: {nextLabel}
            </Button>
          ) : null}
        </div>
      ) : null}
    </section>
  )
}
