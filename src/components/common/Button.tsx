import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  icon?: ReactNode
  fullWidth?: boolean
}

export default function Button({
  variant = 'primary',
  icon,
  fullWidth,
  className = '',
  children,
  ...rest
}: ButtonProps) {
  const classes = ['btn', `btn-${variant}`, fullWidth ? 'btn-full' : '', className]
    .filter(Boolean)
    .join(' ')

  const { type = 'button', ...restProps } = rest

  return (
    <button className={classes} type={type} {...restProps}>
      {icon && <span className="btn-icon">{icon}</span>}
      <span>{children}</span>
    </button>
  )
}
