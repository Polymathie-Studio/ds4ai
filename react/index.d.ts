import type { ReactNode, ReactElement, ButtonHTMLAttributes } from 'react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  className?: string
}
export function Button(props: ButtonProps): JSX.Element

export interface FieldProps {
  label?: string
  hint?: string
  error?: string
  children: ReactElement
}
export function Field(props: FieldProps): JSX.Element

export interface ModalProps {
  open: boolean
  onClose?: () => void
  heading?: string
  children?: ReactNode
}
export function Modal(props: ModalProps): JSX.Element

export interface MenuItem {
  label: string
  onSelect?: () => void
  href?: string
}
export interface MenuProps {
  label: string
  items: MenuItem[]
  triggerVariant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  className?: string
}
export function Menu(props: MenuProps): JSX.Element
