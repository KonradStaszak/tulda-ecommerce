import type { CartLine } from "../../features/cart/types"
import { supabase } from "../../lib/supabase"

export interface QuoteRequestForm {
  fullName: string
  company: string
  email: string
  phone: string
  notes: string
}

export async function createQuoteRequest(
  form: QuoteRequestForm,
  lines: CartLine[],
) {
  const nameParts = form.fullName.trim().split(/\s+/)
  const firstName = nameParts[0] ?? ""
  const lastName = nameParts.slice(1).join(" ") || firstName
  const { data, error } = await supabase.functions.invoke<{
    request_number: number
  }>("create-quote-request", {
    // Keep the legacy name keys while the live Edge Function is being rolled out.
    // The current function reads `fullName`; the existing production version reads
    // `firstName` and `lastName`, so both versions receive a valid customer name.
    body: {
      idempotency_key: crypto.randomUUID(),
      customer: { ...form, firstName, lastName },
      lines: lines.map((line) => ({
        variant_id: line.variantId,
        quantity: line.quantity,
      })),
    },
  })
  if (error) throw new Error(error.message)
  if (!data) throw new Error("The enquiry service returned no confirmation.")
  return data
}
