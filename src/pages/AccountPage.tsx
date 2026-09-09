import { FormEvent, useEffect, useState } from "react"
import type { Session, User } from "@supabase/supabase-js"
import { useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"

type Mode = "login" | "register"

const customerDb = supabase as unknown as { from: (table: string) => any }

type CustomerProfile = {
  full_name: string
  phone: string
  company: string
  address_line_1: string
  address_line_2: string
  city: string
  region: string
  postcode: string
  country: string
}
type CustomerEnquiry = {
  id: string
  request_number: number
  created_at: string
  status: string
  quote_request_items: Array<{
    id: string
    product_name: string
    product_code: string | null
    variant_label: string
    quantity: number
  }>
}
const emptyProfile: CustomerProfile = {
  full_name: "",
  phone: "",
  company: "",
  address_line_1: "",
  address_line_2: "",
  city: "",
  region: "",
  postcode: "",
  country: "",
}

export default function AccountPage() {
  const navigate = useNavigate()
  const [mode, setMode] = useState<Mode>("login")
  const [session, setSession] = useState<Session | null>(null)
  const [name, setName] = useState("")

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [company, setCompany] = useState("")
  const [message, setMessage] = useState("")

  const [error, setError] = useState("")

  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        setSession(nextSession)
      },
    )

    return () => listener.subscription.unsubscribe()
  }, [])

  const switchMode = (nextMode: Mode) => {
    setMode(nextMode)
    setMessage("")
    setError("")
    setConfirmPassword("")
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setError("")

    setMessage("")

    if (mode === "register" && password.length < 8) {
      setError("Password must contain at least 8 characters.")
      return
    }

    if (mode === "register" && password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    setSubmitting(true)

    const result =
      mode === "login"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({
            email,

            password,

            options: {
              data: { full_name: name.trim(), company: company.trim() || null },
              emailRedirectTo: window.location.origin + "/account",
            },
          })

    setSubmitting(false)

    if (result.error) {
      setError(result.error.message)
      return
    }

    // Administrators open their panel after signing in, but the account icon
    // always remains a route to this page for profile management and sign-out.
    if (mode === "login" && result.data.user) {
      const { data: membership } = await customerDb
        .from("admin_users")
        .select("user_id")
        .eq("user_id", result.data.user.id)
        .maybeSingle()
      if (membership) {
        navigate("/admin", { replace: true })
        return
      }
    }

    if (mode === "register" && !result.data.session) {
      setMessage(
        "Check your inbox to confirm your email address, then return here to sign in.",
      )
      setPassword("")
      setConfirmPassword("")
    }
  }

  const handleSignOut = async () => {
    setError("")

    const { error: signOutError } = await supabase.auth.signOut()

    if (signOutError) setError(signOutError.message)
  }

  if (session) {
    return <CustomerDashboard user={session.user} onSignOut={handleSignOut} />
  }

  return (
    <main className="mx-auto grid max-w-[1400px] gap-10 px-6 py-16 md:py-24 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
      <section className="flex flex-col justify-between bg-[var(--surface-dark)] p-8 text-white md:p-12">
        <div>
          <p
            className="text-xs font-bold uppercase tracking-[0.14em]"
            style={{ color: "var(--primary)" }}
          >
            Tulda customer account
          </p>
          <h1 className="mt-5 text-5xl font-black leading-[0.92] md:text-6xl">
            PRODUCTS FOR
            <br />
            <span style={{ color: "var(--primary)" }}>PROFESSIONALS.</span>
          </h1>
        </div>
        <p
          className="mt-16 max-w-md text-base leading-relaxed"
          style={{ color: "var(--surface-dark-muted)" }}
        >
          Sign in to keep your customer details ready and track the product
          enquiries you have sent to Tulda.
        </p>
      </section>

      <section className="max-w-xl lg:pt-4">
        <div className="flex border-b" style={{ borderColor: "var(--border)" }}>
          <button
            type="button"
            onClick={() => switchMode("login")}
            className={
              "min-h-11 border-b-2 px-1 pr-6 text-sm font-bold transition-colors " +
              (mode === "login"
                ? "border-[var(--primary)] text-[var(--foreground)]"
                : "border-transparent text-[var(--muted-foreground)]")
            }
          >
            SIGN IN
          </button>
          <button
            type="button"
            onClick={() => switchMode("register")}
            className={
              "min-h-11 border-b-2 px-1 text-sm font-bold transition-colors " +
              (mode === "register"
                ? "border-[var(--primary)] text-[var(--foreground)]"
                : "border-transparent text-[var(--muted-foreground)]")
            }
          >
            CREATE ACCOUNT
          </button>
        </div>

        <h2 className="mt-10 text-4xl font-black leading-[0.92] md:text-5xl">
          {mode === "login"
            ? "SIGN IN TO YOUR ACCOUNT."
            : "CREATE YOUR ACCOUNT."}
        </h2>
        <p
          className="mt-4 text-sm leading-relaxed"
          style={{ color: "var(--muted-foreground)" }}
        >
          {mode === "login"
            ? "Use the email address and password linked to your Tulda account."
            : "Create an account to save time when ordering professional products."}
        </p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          {mode === "register" && (
            <label className="block text-sm font-semibold">
              Full name
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                autoComplete="name"
                className="tulda-field mt-2 w-full px-3"
              />
            </label>
          )}
          {mode === "register" && (
            <label className="block text-sm font-semibold">
              Company{" "}
              <span className="font-normal text-[var(--muted-foreground)]">
                (optional)
              </span>
              <input
                value={company}
                onChange={(event) => setCompany(event.target.value)}
                autoComplete="organization"
                className="tulda-field mt-2 w-full px-3"
              />
            </label>
          )}
          <label className="block text-sm font-semibold">
            Email address
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              type="email"
              autoComplete="email"
              className="tulda-field mt-2 w-full px-3"
            />
          </label>
          <label className="block text-sm font-semibold">
            Password
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              type="password"
              minLength={mode === "register" ? 8 : undefined}
              autoComplete={
                mode === "login" ? "current-password" : "new-password"
              }
              className="tulda-field mt-2 w-full px-3"
            />
          </label>
          {mode === "register" && (
            <label className="block text-sm font-semibold">
              Confirm password
              <input
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
                type="password"
                minLength={8}
                autoComplete="new-password"
                aria-invalid={
                  confirmPassword.length > 0 && password !== confirmPassword
                }
                className="tulda-field mt-2 w-full px-3"
              />
            </label>
          )}
          {mode === "register" && (
            <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
              Use at least 8 characters.
            </p>
          )}
          {error && (
            <p
              className="border p-3 text-sm"
              role="alert"
              style={{
                borderColor: "var(--color-danger)",
                backgroundColor: "var(--color-danger-soft)",
                color: "var(--color-danger)",
              }}
            >
              {error}
            </p>
          )}
          {message && (
            <p
              className="border p-3 text-sm"
              role="status"
              style={{
                borderColor: "var(--primary)",
                backgroundColor: "var(--color-brand-soft)",
              }}
            >
              {message}
            </p>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="tulda-button w-full disabled:opacity-60"
          >
            {submitting
              ? "PLEASE WAIT..."
              : mode === "login"
                ? "SIGN IN"
                : "CREATE ACCOUNT"}
          </button>
        </form>
      </section>
    </main>
  )
}

function CustomerDashboard({
  user,
  onSignOut,
}: {
  user: User
  onSignOut: () => Promise<void>
}) {
  const [profile, setProfile] = useState<CustomerProfile>(emptyProfile)

  const [enquiries, setEnquiries] = useState<CustomerEnquiry[]>([])
  const [status, setStatus] = useState("")
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)
  const [confirmingDeletion, setConfirmingDeletion] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const load = async () => {
      const [profileResult, enquiriesResult] = await Promise.all([
        customerDb
          .from("customer_profiles")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle(),
        customerDb
          .from("quote_requests")
          .select(
            "id,request_number,created_at,status,quote_request_items(id,product_name,product_code,variant_label,quantity)",
          )
          .eq("user_id", user.id)
          .order("created_at", { ascending: false }),
      ])
      if (profileResult.data)
        setProfile({ ...emptyProfile, ...profileResult.data })
      else
        setProfile({
          ...emptyProfile,
          full_name: String(user.user_metadata.full_name ?? ""),
          company: String(user.user_metadata.company ?? ""),
        })
      if (enquiriesResult.data) setEnquiries(enquiriesResult.data)
    }

    void load()
  }, [user.id])

  const saveProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSaving(true)
    setError("")
    setStatus("")

    const { error: saveError } = await customerDb
      .from("customer_profiles")
      .upsert({ user_id: user.id, ...profile })

    setSaving(false)

    if (saveError) setError("We could not save your details. Please try again.")
    else setStatus("Your account details and delivery address have been saved.")
  }

  const deleteAccount = async () => {
    setDeleting(true)
    setError("")
    const { error: deletionError } = await supabase.functions.invoke(
      "delete-customer-account",
    )
    setDeleting(false)
    if (deletionError) {
      setConfirmingDeletion(false)
      setError("We could not delete your account. Please try again.")
      return
    }
    await onSignOut()
  }

  const update = (field: keyof CustomerProfile, value: string) =>
    setProfile((current) => ({ ...current, [field]: value }))

  const customerName =
    profile.full_name ||
    String(user.user_metadata.full_name || user.email || "Customer")

  return (
    <main className="mx-auto max-w-[1400px] px-6 py-16 md:py-24">
      <div
        className="flex flex-wrap items-end justify-between gap-5 border-b pb-8"
        style={{ borderColor: "var(--border)" }}
      >
        <div>
          <p
            className="text-xs font-bold uppercase tracking-[0.14em]"
            style={{ color: "var(--primary)" }}
          >
            Customer dashboard
          </p>
          <h1 className="mt-3 text-5xl font-black leading-[0.92] md:text-6xl">
            WELCOME, {customerName.toUpperCase()}.
          </h1>
          <p
            className="mt-4 text-sm"
            style={{ color: "var(--muted-foreground)" }}
          >
            {user.email}
          </p>
        </div>
        <button
          type="button"
          onClick={onSignOut}
          className="tulda-button-secondary"
        >
          SIGN OUT
        </button>
      </div>
      <div className="mt-12 grid gap-12 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="space-y-12">
          <section>
            <h2 className="text-3xl font-black">YOUR PRODUCT ENQUIRIES</h2>
            <p
              className="mt-3 text-sm"
              style={{ color: "var(--muted-foreground)" }}
            >
              Track the product enquiries you have sent to the Tulda team.
            </p>
            {enquiries.length ? (
              <div
                className="mt-6 divide-y border"
                style={{ borderColor: "var(--border)" }}
              >
                {enquiries.map((enquiry) => {
                  const items = enquiry.quote_request_items ?? []
                  const unitCount = items.reduce(
                    (total, item) => total + item.quantity,
                    0,
                  )
                  return (
                    <article key={enquiry.id} className="p-5">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <p className="font-bold">
                            ENQUIRY #{enquiry.request_number}
                          </p>
                          <p
                            className="mt-1 text-sm"
                            style={{ color: "var(--muted-foreground)" }}
                          >
                            {new Date(enquiry.created_at).toLocaleDateString(
                              "en-GB",
                            )}
                            {" · "}
                            {unitCount} {unitCount === 1 ? "unit" : "units"}{" "}
                            requested
                          </p>
                        </div>
                        <span className="border border-[var(--primary)] bg-[var(--color-brand-soft)] px-3 py-1 text-xs font-bold uppercase tracking-[0.08em] text-[var(--primary)]">
                          {enquiry.status.replace(/_/g, " ")}
                        </span>
                      </div>
                      <ul
                        className="mt-4 space-y-2 border-t pt-4 text-sm"
                        style={{ borderColor: "var(--border)" }}
                      >
                        {items.map((item) => (
                          <li
                            key={item.id}
                            className="flex items-start justify-between gap-4"
                          >
                            <span>
                              <strong>{item.product_name}</strong>
                              {item.variant_label && (
                                <span
                                  className="block text-xs"
                                  style={{ color: "var(--muted-foreground)" }}
                                >
                                  {item.variant_label}
                                </span>
                              )}
                            </span>
                            <span className="whitespace-nowrap font-bold">
                              ×{item.quantity}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </article>
                  )
                })}
              </div>
            ) : (
              <p
                className="mt-5 border p-5 text-sm"
                style={{
                  borderColor: "var(--border)",
                  color: "var(--muted-foreground)",
                }}
              >
                You have not sent any product enquiries yet.
              </p>
            )}
          </section>
        </div>
        <div>
          <section
            className="border p-6 md:p-8"
            style={{
              borderColor: "var(--border)",
              backgroundColor: "var(--muted)",
            }}
          >
            <h2 className="text-3xl font-black">ACCOUNT & DELIVERY</h2>
            <p
              className="mt-3 text-sm"
              style={{ color: "var(--muted-foreground)" }}
            >
              Your saved address can be used at checkout.
            </p>
            <form
              className="mt-7 grid gap-4 sm:grid-cols-2"
              onSubmit={saveProfile}
            >
              {([
                ["full_name", "Full name"],
                ["phone", "Phone"],
                ["company", "Company"],
                ["address_line_1", "Address line 1"],
                ["address_line_2", "Address line 2"],
                ["city", "City"],
                ["region", "County / region"],
                ["postcode", "Postcode"],
                ["country", "Country"],
              ] as Array<[keyof CustomerProfile, string]>).map(
                ([field, label]) => (
                  <label
                    key={field}
                    className={
                      field === "address_line_1" || field === "address_line_2"
                        ? "sm:col-span-2 text-sm font-semibold"
                        : "text-sm font-semibold"
                    }
                  >
                    {label}
                    <input
                      value={profile[field]}
                      onChange={(event) => update(field, event.target.value)}
                      className="tulda-field mt-2 w-full px-3"
                    />
                  </label>
                ),
              )}
              <button
                type="submit"
                disabled={saving}
                className="tulda-button mt-2 sm:col-span-2"
              >
                {saving ? "SAVING..." : "SAVE DETAILS"}
              </button>
            </form>
            {status && (
              <p
                className="mt-4 text-sm"
                role="status"
                style={{ color: "var(--color-brand-hover)" }}
              >
                {status}
              </p>
            )}
            {error && (
              <p
                className="mt-4 text-sm"
                role="alert"
                style={{ color: "var(--color-danger)" }}
              >
                {error}
              </p>
            )}
          </section>
          <section
            className="mt-8 border p-6"
            style={{
              borderColor: "var(--color-danger)",
              backgroundColor: "var(--color-danger-soft)",
            }}
          >
            <h2 className="text-2xl font-black">DELETE ACCOUNT</h2>
            <p className="mt-3 text-sm leading-relaxed">
              This permanently removes your account, saved address and
              favourites. Existing order records are retained for operational
              and legal purposes.
            </p>
            <button
              type="button"
              onClick={() => setConfirmingDeletion(true)}
              className="mt-5 border px-5 py-3 text-sm font-bold"
              style={{
                borderColor: "var(--color-danger)",
                color: "var(--color-danger)",
              }}
            >
              DELETE MY ACCOUNT
            </button>
          </section>
        </div>
      </div>
      {confirmingDeletion && (
        <DeleteAccountModal
          busy={deleting}
          onCancel={() => setConfirmingDeletion(false)}
          onConfirm={deleteAccount}
        />
      )}
    </main>
  )
}

function DeleteAccountModal({
  busy,
  onCancel,
  onConfirm,
}: {
  busy: boolean
  onCancel: () => void
  onConfirm: () => void
}) {
  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-[#061117]/70 p-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-account-modal-title"
      onMouseDown={() => {
        if (!busy) onCancel()
      }}
    >
      <section
        className="w-full max-w-lg overflow-hidden border bg-white shadow-2xl"
        style={{ borderColor: "var(--border)" }}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header
          className="border-b bg-[var(--surface-dark)] px-6 py-5 text-white"
          style={{ borderColor: "rgba(255,255,255,0.14)" }}
        >
          <p
            className="text-xs font-bold uppercase tracking-[0.15em]"
            style={{ color: "#ff8f94" }}
          >
            Permanent action
          </p>
          <h2
            id="delete-account-modal-title"
            className="mt-2 text-3xl font-black"
          >
            DELETE YOUR ACCOUNT?
          </h2>
        </header>
        <div className="p-6">
          <p className="text-sm leading-relaxed">
            This permanently removes your Tulda account, saved delivery details
            and saved products. It cannot be undone.
          </p>
          <div
            className="mt-5 border-l-2 p-4 text-sm leading-relaxed"
            style={{
              borderColor: "var(--color-danger)",
              backgroundColor: "var(--color-danger-soft)",
            }}
          >
            <strong>What remains:</strong> existing order records are retained
            only where required for operational and legal purposes.
          </div>
          <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              disabled={busy}
              onClick={onCancel}
              className="tulda-button-secondary disabled:opacity-60"
            >
              KEEP MY ACCOUNT
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={onConfirm}
              className="min-h-11 border px-5 text-xs font-bold text-white transition-colors disabled:opacity-60"
              style={{
                borderColor: "var(--color-danger)",
                backgroundColor: "var(--color-danger)",
              }}
            >
              {busy ? "DELETING ACCOUNT..." : "DELETE ACCOUNT"}
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
