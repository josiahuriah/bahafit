/**
 * Fygaro Payment Link Generator
 *
 * Generates payment links for the centralized Fygaro merchant account.
 * All event payments are collected by the platform and dispersed to organizers.
 *
 * Environment variables required:
 *   NEXT_PUBLIC_FYGARO_MERCHANT_ID  – Your Fygaro merchant/store identifier
 *   NEXT_PUBLIC_FYGARO_BASE_URL     – Fygaro payment page base URL
 *                                     (e.g. https://app.fygaro.com/pay)
 */

interface FygaroPaymentParams {
  registrationId: string
  amount: number
  currency: string
  eventTitle: string
  customerEmail: string
  customerName: string
}

export function generateFygaroPaymentLink(params: FygaroPaymentParams): string | null {
  const baseUrl = process.env.NEXT_PUBLIC_FYGARO_BASE_URL
  const merchantId = process.env.NEXT_PUBLIC_FYGARO_MERCHANT_ID

  if (!baseUrl || !merchantId) {
    return null
  }

  const url = new URL(`${baseUrl}/${merchantId}`)

  url.searchParams.set('amount', params.amount.toFixed(2))
  url.searchParams.set('currency', params.currency)
  url.searchParams.set('reference', params.registrationId)
  url.searchParams.set('description', params.eventTitle)
  url.searchParams.set('email', params.customerEmail)
  url.searchParams.set('name', params.customerName)

  return url.toString()
}

export function isFygaroConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_FYGARO_BASE_URL &&
    process.env.NEXT_PUBLIC_FYGARO_MERCHANT_ID
  )
}
