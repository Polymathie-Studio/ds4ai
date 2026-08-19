import type { ReactNode, ReactElement, ButtonHTMLAttributes, InputHTMLAttributes, SelectHTMLAttributes } from 'react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  className?: string
}
export function Button(props: ButtonProps): JSX.Element

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string
}
export function Checkbox(props: CheckboxProps): JSX.Element
export function Radio(props: CheckboxProps): JSX.Element
export function Switch(props: CheckboxProps): JSX.Element

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  className?: string
}
export function Select(props: SelectProps): JSX.Element

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

export interface TabItem { label: ReactNode; content: ReactNode }
export interface TabsProps { tabs: TabItem[] }
export function Tabs(props: TabsProps): JSX.Element

export interface TooltipProps { text: string; children: ReactElement }
export function Tooltip(props: TooltipProps): JSX.Element

export interface AccordionItem { header: ReactNode; content: ReactNode }
export interface AccordionProps { items: AccordionItem[]; single?: boolean }
export function Accordion(props: AccordionProps): JSX.Element
