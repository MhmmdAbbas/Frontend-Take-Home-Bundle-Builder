import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'outline' | 'ghost'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: ButtonVariant
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'w-full rounded-lg bg-brand px-4 py-4 text-base font-semibold text-white transition-colors hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-45',
  outline:
    'inline-flex items-center justify-center gap-2 self-center rounded-[7px] border border-brand bg-transparent px-6 py-[5px] text-lg font-semibold text-brand transition-colors hover:bg-brand/5 disabled:cursor-not-allowed disabled:opacity-45',
  ghost:
    'w-full bg-transparent text-sm font-medium text-text-tertiary underline transition-colors hover:text-brand disabled:cursor-not-allowed disabled:opacity-45',
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
