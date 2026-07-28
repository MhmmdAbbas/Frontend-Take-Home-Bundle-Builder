import type { ReactNode } from 'react'
import { Accordion } from '../components/Accordion'
import { ProductCard } from '../components/ProductCard'
import { ReviewPanel } from '../components/ReviewPanel'
import {
  CameraIcon,
  PlanIcon,
  ProtectionIcon,
  SensorIcon,
} from '../components/icons'
import { useBundle } from '../context/BundleContext'

interface StepMeta {
  step: number
  title: string
  nextLabel: string
  icon: ReactNode
}

const STEPS: StepMeta[] = [
  {
    step: 1,
    title: 'Choose your cameras',
    nextLabel: 'Choose your plan',
    icon: <CameraIcon />,
  },
  {
    step: 2,
    title: 'Choose your plan',
    nextLabel: 'Choose your sensors',
    icon: <PlanIcon />,
  },
  {
    step: 3,
    title: 'Choose your sensors',
    nextLabel: 'Add extra protection',
    icon: <SensorIcon />,
  },
  {
    step: 4,
    title: 'Add extra protection',
    nextLabel: '',
    icon: <ProtectionIcon />,
  },
]

function StepProducts({ step }: { step: number }) {
  const { getProductsByStep } = useBundle()
  const products = getProductsByStep(step)

  if (step === 1) {
    return (
      <>
        {/* Phone: 1 col · iPad: 5-col row · Laptop: 2+2+1 */}
        <div className="flex flex-col gap-[15px] md:hidden">
          {products.map((product) => (
            <ProductCard key={product.productId} product={product} />
          ))}
        </div>

        <div className="hidden gap-[15px] md:flex md:flex-row xl:hidden">
          {products.map((product) => (
            <ProductCard key={product.productId} product={product} />
          ))}
        </div>

        <div className="hidden flex-col gap-[15px] xl:flex">
          <div className="flex flex-row gap-[15px]">
            {products.slice(0, 2).map((product) => (
              <ProductCard key={product.productId} product={product} />
            ))}
          </div>
          <div className="flex flex-row gap-[15px]">
            {products.slice(2, 4).map((product) => (
              <ProductCard key={product.productId} product={product} />
            ))}
          </div>
          <div className="flex justify-center">
            {products[4] ? (
              <div className="w-full max-w-[361px]">
                <ProductCard product={products[4]} />
              </div>
            ) : null}
          </div>
        </div>
      </>
    )
  }

  return (
    <div
      className={
        step === 3
          ? 'flex flex-col gap-3.5 md:flex-row md:justify-center'
          : 'flex flex-col items-stretch gap-3.5 md:items-center'
      }
    >
      {products.map((product) => (
        <ProductCard key={product.productId} product={product} />
      ))}
    </div>
  )
}

export function Home() {
  const {
    state,
    toggleStep,
    goToNextStep,
    getStepSelectedCount,
  } = useBundle()

  return (
    <div className="min-h-screen bg-white">
      {/* Phone only — Figma iPhone frame */}
      <h1 className="mx-auto block px-5 pt-8 pb-5 text-center text-[32px] font-bold leading-[110%] tracking-[-0.064px] text-text-dark md:hidden">
        Let&apos;s get started!
      </h1>

      {/*
        Phone (<md): stack
        iPad (md–xl): stack builder then review (Frame 1736)
        Laptop (xl+): side-by-side (Frame 1735)
      */}
      <div className="mx-auto flex max-w-[1240px] flex-col items-stretch gap-5 px-3 py-3 md:gap-6 md:px-5 md:py-8 xl:flex-row xl:items-start xl:justify-center xl:gap-[29px] xl:py-12">
        <div className="flex w-full flex-col gap-[13px] xl:max-w-[768px] xl:shrink-0">
          {STEPS.map((meta) => {
            const isOpen = state.currentStep === meta.step

            return (
              <Accordion
                key={meta.step}
                step={meta.step}
                title={meta.title}
                icon={meta.icon}
                isOpen={isOpen}
                selectedCount={getStepSelectedCount(meta.step)}
                onToggle={() => toggleStep(meta.step)}
                nextLabel={meta.nextLabel}
                showNext={isOpen && meta.step < 4}
                onNext={() => goToNextStep(meta.step)}
              >
                <StepProducts step={meta.step} />
              </Accordion>
            )
          })}
        </div>

        <ReviewPanel />
      </div>
    </div>
  )
}
