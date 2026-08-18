import type { CartLine } from '../../features/cart/types'
import type { CheckoutFormData } from '../../features/checkout/types'
import { supabase } from '../../lib/supabase'

export interface DraftOrderResult {
  order_id: string
  order_number: number
  order_status: 'draft'
  payment_status: 'unpaid'
  subtotal_minor: number
  currency: 'GBP'
  reused_existing_order: boolean
}

interface CreateOrderDraftInput {
  idempotencyKey: string
  checkout: CheckoutFormData
  lines: Pick<CartLine, 'variantId' | 'quantity'>[]
}

export class CreateOrderError extends Error {}

export async function createOrderDraft({ idempotencyKey, checkout, lines }: CreateOrderDraftInput): Promise<DraftOrderResult> {
  const { data, error } = await supabase.functions.invoke<DraftOrderResult>('create-order', {
    body: {
      idempotency_key: idempotencyKey,
      customer: {
        email: checkout.customer.email,
        phone: checkout.customer.phone,
        first_name: checkout.customer.firstName,
        last_name: checkout.customer.lastName,
        company: checkout.customer.company,
      },
      delivery_address: {
        address_line_1: checkout.deliveryAddress.addressLine1,
        address_line_2: checkout.deliveryAddress.addressLine2,
        city: checkout.deliveryAddress.city,
        region: checkout.deliveryAddress.region,
        postcode: checkout.deliveryAddress.postcode,
        country: checkout.deliveryAddress.country,
      },
      billing_same_as_delivery: checkout.billingSameAsDelivery,
      billing_address: {
        address_line_1: checkout.billingAddress.addressLine1,
        address_line_2: checkout.billingAddress.addressLine2,
        city: checkout.billingAddress.city,
        region: checkout.billingAddress.region,
        postcode: checkout.billingAddress.postcode,
        country: checkout.billingAddress.country,
      },
      notes: checkout.orderNotes,
      lines: lines.map((line) => ({ variant_id: line.variantId, quantity: line.quantity })),
    },
  })

  if (error || !data) throw new CreateOrderError('Unable to create a draft order. Please review your cart and try again.')
  return data
}
