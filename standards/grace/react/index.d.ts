import type { ReactNode, HTMLAttributes } from 'react'

export interface SkeletonProps extends HTMLAttributes<HTMLSpanElement> {
  className?: string
}
export function Skeleton(props: SkeletonProps): JSX.Element

export interface StateProps {
  heading?: string
  message?: string
  action?: string
  href?: string
  onAction?: () => void
  className?: string
  children?: ReactNode
}
export function Empty(props: StateProps): JSX.Element
export function ErrorState(props: StateProps): JSX.Element
export function NotFound(props: StateProps): JSX.Element
