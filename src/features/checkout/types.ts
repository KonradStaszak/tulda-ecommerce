export interface CustomerDetails {
  email: string
  phone: string
  firstName: string
  lastName: string
  company: string
}

export interface Address {
  country: string
  addressLine1: string
  addressLine2: string
  city: string
  region: string
  postcode: string
}

export interface CheckoutFormData {
  customer: CustomerDetails
  deliveryAddress: Address
  billingSameAsDelivery: boolean
  billingAddress: Address
  orderNotes: string
}

export type CheckoutField =
  | 'email'
  | 'phone'
  | 'firstName'
  | 'lastName'
  | 'deliveryCountry'
  | 'deliveryAddressLine1'
  | 'deliveryCity'
  | 'deliveryPostcode'
  | 'billingCountry'
  | 'billingAddressLine1'
  | 'billingCity'
  | 'billingPostcode'

export type CheckoutErrors = Partial<Record<CheckoutField, string>>
