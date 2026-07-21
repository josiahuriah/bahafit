// General-purpose monoline icon set — 24×24 viewBox, currentColor stroke.
// These replace the emoji glyphs that were previously used as category,
// feature, and placeholder icons across the app.

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

export function DumbbellIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M3 10v4M6 7v10M18 7v10M21 10v4M6 12h12" />
    </Stroke>
  )
}

export function TrophyIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M8 4h8v5a4 4 0 0 1-8 0V4Z" />
      <path d="M8 5H5v2a3 3 0 0 0 3 3M16 5h3v2a3 3 0 0 1-3 3" />
      <path d="M12 13v4M9 21h6M10 21a2 2 0 0 1 4 0" />
    </Stroke>
  )
}

export function BookIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M5 4h9a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H5V4Z" />
      <path d="M17 7h2v13H7a2 2 0 0 0-2 2" />
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

export function HandshakeIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M11 6 8 4 2 9l3 3M13 6l3-2 6 5-3 3" />
      <path d="M5 12l4-2 3 2 2-1M19 12l-5 5-2-2-2 2-2-2" />
    </Stroke>
  )
}

export function CertificateIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <rect x="4" y="4" width="16" height="12" rx="2" />
      <path d="M8 9h8M8 12h4" />
      <path d="M12 16v3l2-1.3L16 19v-3" />
    </Stroke>
  )
}

export function SparkleIcon(props: IconProps) {
  return (
    <Stroke strokeWidth={1.6} {...props}>
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.5 5.5l2 2M16.5 16.5l2 2M5.5 18.5l2-2M16.5 7.5l2-2" />
      <circle cx="12" cy="12" r="2" />
    </Stroke>
  )
}

export function ClipboardIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <rect x="5" y="5" width="14" height="16" rx="2" />
      <path d="M9 5a3 3 0 0 1 6 0" />
      <path d="M8 11h8M8 15h5" />
    </Stroke>
  )
}

export function MegaphoneIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M4 10v4a1 1 0 0 0 1 1h2l9 4V5L7 9H5a1 1 0 0 0-1 1Z" />
      <path d="M7 15v3a1 1 0 0 0 1 1h2v-4M19 9a3 3 0 0 1 0 6" />
    </Stroke>
  )
}

export function ChartBarIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M4 20V4M4 20h16" />
      <path d="M8 20v-6M12 20v-9M16 20v-4" />
    </Stroke>
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

export function CalendarXIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <rect x="3.5" y="5" width="17" height="15" rx="2" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
      <path d="m10 14 4 4M14 14l-4 4" />
    </Stroke>
  )
}

export function SearchIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </Stroke>
  )
}

export function SearchXIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
      <path d="m9 9 4 4M13 9l-4 4" />
    </Stroke>
  )
}

export function MapPinIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 1 1 13 0c0 5-6.5 11-6.5 11Z" />
      <circle cx="12" cy="10" r="2.3" />
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

export function PhoneIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <rect x="7" y="3" width="10" height="18" rx="2.5" />
      <path d="M11 18h2" />
    </Stroke>
  )
}

export function CheckBadgeIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M12 3.2 14 5l2.6-.3.9 2.5 2.3 1.3-.8 2.5.8 2.5-2.3 1.3-.9 2.5L14 19l-2 1.8L10 19l-2.6.3-.9-2.5L4.2 15.5 5 13l-.8-2.5 2.3-1.3.9-2.5L10 5Z" />
      <path d="m9.5 12 2 2 3.5-3.5" />
    </Stroke>
  )
}

export function StarIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="m12 3 2.7 5.5 6 .9-4.3 4.2 1 6L12 16.8 6.6 19.6l1-6L3.3 9.4l6-.9L12 3Z" />
    </svg>
  )
}

export function TicketIcon(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1a2 2 0 0 0 0 6v1a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-1a2 2 0 0 0 0-6V8Z" />
      <path d="M14 6v12" strokeDasharray="2 2" />
    </Stroke>
  )
}

export function ChevronLeftIcon(props: IconProps) {
  return (
    <Stroke strokeWidth={2} {...props}>
      <path d="m14 6-6 6 6 6" />
    </Stroke>
  )
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <Stroke strokeWidth={2} {...props}>
      <path d="m10 6 6 6-6 6" />
    </Stroke>
  )
}

export function XIcon(props: IconProps) {
  return (
    <Stroke strokeWidth={2} {...props}>
      <path d="M6 6l12 12M18 6 6 18" />
    </Stroke>
  )
}
