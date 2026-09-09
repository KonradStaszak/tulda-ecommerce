import type { CartLine } from '../../features/cart/types'
import { supabase } from '../../lib/supabase'

export interface QuoteRequestForm { firstName: string; lastName: string; company: string; email: string; phone: string; notes: string }

export async function createQuoteRequest(form: QuoteRequestForm, lines: CartLine[]) {
  const { data, error } = await supabase.functions.invoke<{ request_number: number }>('create-quote-request', {
    body: { idempotency_key: crypto.randomUUID(), customer: form, lines: lines.map((line) => ({ variant_id: line.variantId, quantity: line.quantity })) },
  })
  if (error || !data) throw new Error('Unable to send your enquiry.')
  return data
}
