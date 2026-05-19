// Monoline stroke icons for the homepage — 24×24 viewBox, currentColor.

import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

function Stroke({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {children}
    </svg>
  )
}

export function CalendarIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <rect x="3.5" y="5" width="17" height="15" rx="2" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
    </Stroke>
  )
}

export function StoreIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M4 10v9h16v-9" />
      <path d="M3 6h18l-1.5 4.5a3 3 0 0 1-2.9 2.1 3 3 0 0 1-2.8-2.1A3 3 0 0 1 12 12.6a3 3 0 0 1-2.8-2.1A3 3 0 0 1 6.4 12.6 3 3 0 0 1 3.5 10.5L3 6Z" />
    </Stroke>
  )
}

export function TicketIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <rect x="5" y="5" width="14" height="14" rx="2.5" />
      <path d="M9 8h6" />
    </Stroke>
  )
}

export function UsersIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <circle cx="9" cy="8" r="3.2" />
      <circle cx="17" cy="9" r="2.6" />
      <path d="M3 19c.5-3 3-5 6-5s5.5 2 6 5" />
      <path d="M14.8 14.5c2.6 0 4.6 1.6 5.2 4" />
    </Stroke>
  )
}

export function DumbbellIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M3 10v4M6 7v10M18 7v10M21 10v4M6 12h12" />
    </Stroke>
  )
}

export function UserIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <circle cx="12" cy="9" r="3.5" />
      <path d="M5 20c1-3.5 4-5.5 7-5.5s6 2 7 5.5" />
    </Stroke>
  )
}

export function LotusIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M12 6c-1 3-3 5-5 6 1 3 3 5 5 5s4-2 5-5c-2-1-4-3-5-6Z" />
      <path d="M12 6c1 3 3 5 5 6" />
      <path d="M7 12c-1.5-.4-3-.4-4 0 .5 2.5 2 4 4 4.5" />
      <path d="M17 12c1.5-.4 3-.4 4 0-.5 2.5-2 4-4 4.5" />
    </Stroke>
  )
}

export function RunIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <circle cx="14.5" cy="5.5" r="1.8" />
      <path d="M7 21l3-5 2-3-3-2-1 3-3 1" />
      <path d="M12 13l3 2 2 4" />
      <path d="M15 10l3-1 2 2" />
    </Stroke>
  )
}

export function GroupIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <circle cx="12" cy="7" r="2.2" />
      <circle cx="6" cy="9" r="1.8" />
      <circle cx="18" cy="9" r="1.8" />
      <path d="M4 17c.4-2 1.8-3.2 3.5-3.5" />
      <path d="M20 17c-.4-2-1.8-3.2-3.5-3.5" />
      <path d="M8 19c.5-2.5 2-3.8 4-3.8S15.5 16.5 16 19" />
    </Stroke>
  )
}

export function StudioIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M3 19h18" />
      <circle cx="12" cy="9" r="2" />
      <path d="M7 19c.5-3 2.5-5 5-5s4.5 2 5 5" />
    </Stroke>
  )
}

export function ClassesIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <circle cx="6.5" cy="6" r="1.6" />
      <circle cx="12" cy="5" r="1.6" />
      <circle cx="17.5" cy="6" r="1.6" />
      <path d="M5 16l1.5-7 2 3h6.5l2-3L19 16" />
      <path d="M5 16l1 4M19 16l-1 4" />
    </Stroke>
  )
}

export function PinIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 1 1 13 0c0 5-6.5 11-6.5 11Z" />
      <circle cx="12" cy="10" r="2.3" />
    </Stroke>
  )
}

export function HeartIcon(props: IconProps) {
  return (
    <Stroke strokeWidth={1.6} {...props}>
      <path d="M12 20s-7-4.3-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.7-7 10-7 10Z" />
    </Stroke>
  )
}

export function MoreIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <circle cx="6" cy="12" r="1.6" />
      <circle cx="12" cy="12" r="1.6" />
      <circle cx="18" cy="12" r="1.6" />
    </svg>
  )
}

export function StarIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="m12 3 2.7 5.5 6 .9-4.3 4.2 1 6L12 16.8 6.6 19.6l1-6L3.3 9.4l6-.9L12 3Z" />
    </svg>
  )
}
