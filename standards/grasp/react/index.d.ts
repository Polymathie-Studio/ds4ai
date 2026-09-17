import type { ReactNode, ReactElement, ChangeEvent, ButtonHTMLAttributes, InputHTMLAttributes, SelectHTMLAttributes, ProgressHTMLAttributes, MeterHTMLAttributes } from 'react'

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

export type ComboboxOption = string | { label: string; value: string }
export interface ComboboxProps {
  options: ComboboxOption[]
  placeholder?: string
  onSelect?: (value: string) => void
  className?: string
}
export function Combobox(props: ComboboxProps): JSX.Element

export interface SliderProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string
}
export function Slider(props: SliderProps): JSX.Element

export interface SpinbuttonProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string
}
export function Spinbutton(props: SpinbuttonProps): JSX.Element

export interface ProgressProps extends ProgressHTMLAttributes<HTMLProgressElement> {
  className?: string
}
export function Progress(props: ProgressProps): JSX.Element

export interface MeterProps extends MeterHTMLAttributes<HTMLMeterElement> {
  className?: string
}
export function Meter(props: MeterProps): JSX.Element

export interface BreadcrumbItem { label: ReactNode; href?: string }
export interface BreadcrumbProps {
  items: BreadcrumbItem[]
  label?: string
  className?: string
}
export function Breadcrumb(props: BreadcrumbProps): JSX.Element

export type ToggleOption = string | { label: ReactNode; value: string }
export interface ToggleGroupProps {
  options: ToggleOption[]
  name?: string
  value?: string | string[]
  defaultValue?: string | string[]
  multiple?: boolean
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  label?: string
  className?: string
}
export function ToggleGroup(props: ToggleGroupProps): JSX.Element

export interface ToolbarProps {
  children?: ReactNode
  orientation?: 'horizontal' | 'vertical'
  label?: string
  className?: string
}
export function Toolbar(props: ToolbarProps): JSX.Element

export interface ToastItem {
  id: string
  message: ReactNode
  variant?: 'success' | 'danger'
  assertive?: boolean
}
export interface ToastProps {
  toasts: Array<ToastItem | string>
  onDismiss?: (id: string) => void
  assertive?: boolean
  label?: string
  className?: string
}
export function Toast(props: ToastProps): JSX.Element

export interface PopoverProps {
  trigger: ReactNode
  triggerVariant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  children?: ReactNode
  className?: string
}
export function Popover(props: PopoverProps): JSX.Element
