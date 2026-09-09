import { supabase } from "../../lib/supabase"

export type ContactMessageForm = {
  name: string
  company: string
  email: string
  phone: string
  message: string
}

export async function createContactMessage(form: ContactMessageForm) {
  const { data, error } = await supabase.functions.invoke<{
    message_number: number
  }>("create-contact-message", {
    body: {
      idempotency_key: crypto.randomUUID(),
      full_name: form.name,
      company: form.company,
      email: form.email,
      phone: form.phone,
      message: form.message,
    },
  })
  if (error || !data) throw new Error("Unable to send your message.")
  return data
}
