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
        <div className="flex flex-col gap-3.5 md:flex-row">
          {products.slice(0, 2).map((product) => (
            <ProductCard key={product.productId} product={product} />
          ))}
        </div>
        <div className="flex flex-col gap-3.5 md:flex-row">
          {products.slice(2, 4).map((product) => (
            <ProductCard key={product.productId} product={product} />
          ))}
        </div>
        <div className="flex justify-center">
          {products[4] ? <ProductCard product={products[4]} /> : null}
        </div>
      </>
    )
  }

  return (
    <div
      className={
        step === 3
          ? 'flex justify-center'
          : 'flex flex-col items-center gap-3.5'
      }
    >
      {step === 3 ? (
        <div className="flex w-full flex-col gap-3.5 md:flex-row md:justify-center">
          {products.map((product) => (
            <ProductCard key={product.productId} product={product} />
          ))}
        </div>
      ) : (
        products.map((product) => (
          <ProductCard key={product.productId} product={product} />
        ))
      )}
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
      <h1 className="mx-auto hidden px-5 pt-10 pb-7 text-center text-[31.875px] font-bold leading-[110%] tracking-[-0.064px] text-text-dark max-[900px]:block">
        Let&apos;s get started!
      </h1>

      <div className="mx-auto flex max-w-[1240px] items-start justify-center gap-[29px] px-5 py-12 max-[1200px]:gap-6 max-[900px]:flex-col max-[900px]:gap-5 max-[900px]:px-5 max-[900px]:py-5 max-[600px]:gap-4 max-[600px]:px-3 max-[600px]:py-3">
        <div className="flex w-full max-w-[768px] shrink-0 flex-col gap-4 max-[1200px]:max-w-none max-[1200px]:flex-1">
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
