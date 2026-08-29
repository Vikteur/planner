import { useState } from 'react'
import type { ComponentPropsWithoutRef, CSSProperties, ElementType } from 'react'

type HovOwn<T extends ElementType> = {
  /** Element to render. Defaults to a div. */
  as?: T
  /** Styles merged over `style` while the pointer is inside, the mock's `style-hover`. */
  hover?: CSSProperties
}

export type HovProps<T extends ElementType> = HovOwn<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof HovOwn<T>>

/**
 * Mirrors the `style-hover` attribute the design mock uses: a base inline style
 * with a hover overlay. Kept as inline state rather than CSS so the base style
 * stays a literal transcription of the mock and nothing needs `!important`.
 */
export function Hov<T extends ElementType = 'div'>({ as, hover, style, onMouseEnter, onMouseLeave, ...rest }: HovProps<T>) {
  const [on, setOn] = useState(false)
  const Tag = (as ?? 'div') as ElementType
  return (
    <Tag
      {...rest}
      style={on && hover ? { ...style, ...hover } : style}
      onMouseEnter={(e: never) => {
        setOn(true)
        ;(onMouseEnter as ((e: never) => void) | undefined)?.(e)
      }}
      onMouseLeave={(e: never) => {
        setOn(false)
        ;(onMouseLeave as ((e: never) => void) | undefined)?.(e)
      }}
    />
  )
}
