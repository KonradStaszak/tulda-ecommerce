import type { Address, CheckoutErrors, CheckoutFormData } from './types'

function validateAddress(address: Address, prefix: 'delivery' | 'billing', errors: CheckoutErrors) {
  const label = prefix === 'delivery' ? 'Delivery' : 'Billing'
  if (!address.country.trim()) errors[`${prefix}Country`] = `${label} country is required.`
  if (!address.addressLine1.trim()) errors[`${prefix}AddressLine1`] = `${label} address line 1 is required.`
  if (!address.city.trim()) errors[`${prefix}City`] = `${label} city is required.`
  if (!address.postcode.trim()) errors[`${prefix}Postcode`] = `${label} postcode is required.`
}

export function validateCheckoutForm(form: CheckoutFormData): CheckoutErrors {
  const errors: CheckoutErrors = {}
  const email = form.customer.email.trim()

  if (!email) errors.email = 'Email address is required.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Enter a valid email address.'
  if (!form.customer.phone.trim()) errors.phone = 'Phone number is required.'
  if (!form.customer.firstName.trim()) errors.firstName = 'First name is required.'
  if (!form.customer.lastName.trim()) errors.lastName = 'Last name is required.'

  validateAddress(form.deliveryAddress, 'delivery', errors)
  if (!form.billingSameAsDelivery) validateAddress(form.billingAddress, 'billing', errors)

  return errors
}
