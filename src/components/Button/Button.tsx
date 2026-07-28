import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'outline' | 'ghost'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: ButtonVariant
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'w-full rounded-[4px] bg-brand px-4 py-[13px] text-[17px] font-bold text-white transition-colors hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-45',
  outline:
    'inline-flex h-[39px] items-center justify-center gap-2 self-center rounded-[7px] border border-brand bg-transparent px-6 py-[5px] text-lg font-semibold leading-6 text-brand transition-colors hover:bg-brand/5 disabled:cursor-not-allowed disabled:opacity-45',
  ghost:
    'w-full bg-transparent text-[14px] font-normal leading-[1.2] tracking-[-0.016px] text-[#484848] underline transition-colors hover:text-brand disabled:cursor-not-allowed disabled:opacity-45',
}

export function Button({
  children,
  variant = 'primary',
  className = '',
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`${variantClasses[variant]} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  )
}
