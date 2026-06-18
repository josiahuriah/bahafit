import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

export const VENDOR_FEE_RATE = 0.09
export const PROCESSING_FEE_RATE = 0.01

export interface CheckoutFees {
  subtotal: number
  vendorFee: number
  processingFee: number
  total: number
}

// Round to cents to avoid float drift between the displayed breakdown
// and the amount we sign for Fygaro.
const round2 = (n: number) => Math.round(n * 100) / 100

export function computeCheckoutFees(subtotal: number): CheckoutFees {
  const safe = subtotal > 0 ? subtotal : 0
  const vendorFee = round2(safe * VENDOR_FEE_RATE)
  const processingFee = round2(safe * PROCESSING_FEE_RATE)
  return {
    subtotal: round2(safe),
    vendorFee,
    processingFee,
    total: round2(safe + vendorFee + processingFee),
  }
}

// The price a buyer actually pays for a ticket: the vendor's listed price
// plus the 9% service charge and 1% facility fee. Used wherever a price is
// shown to buyers so listings match what they're charged at checkout.
export function grossPrice(listedPrice: number): number {
  return computeCheckoutFees(listedPrice).total
}
