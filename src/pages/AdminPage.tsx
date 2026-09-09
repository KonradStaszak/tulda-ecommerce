import { FormEvent, useEffect, useMemo, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { supabase } from "../lib/supabase"
import { getLocalProductImagePath } from "../lib/productImages"
import { richTextToPlainText, sanitizeRichText } from "../lib/richText"

type Section = "requests" | "contacts" | "products" | "users"
type Variant = { id: string label: string }
type ProductImage = {
  id: string
  storage_path: string
  alt_text: string | null
  sort_order: number
  is_primary: boolean
}
type Product = {
  id: string
  name: string
  slug: string
  code: string | null
  short_description: string | null
  description: string | null
  product_variants: Variant[]
  product_images: ProductImage[]
  product_categories: Array<{ category_id: string }>
}
type Category = { id: string name: string }
type QuoteRequest = {
  id: string
  request_number: number
  first_name: string
  last_name: string
  company: string | null
  email: string
  phone: string
  notes: string | null
  status: "new" | "contacted" | "quoted" | "closed" | "cancelled"
  admin_notes: string | null
  created_at: string
  quote_request_items: Array<{
    id: string
    product_name: string
    product_code: string | null
    variant_label: string
    quantity: number
  }>
}
type ContactMessage = {
  id: string
  message_number: number
  full_name: string
  company: string | null
  email: string
  phone: string | null
  message: string
  status: "new" | "contacted" | "resolved" | "closed"
  admin_notes: string | null
  created_at: string
}
type AdminUser = {
  id: string
  email: string | null
  created_at: string
  last_sign_in_at: string | null
  full_name: string | null
  is_admin: boolean
}
type ProductForm = {
  name: string
  slug: string
  code: string
  variantLabel: string
  shortDescription: string
  description: string
  categoryId: string
}

const emptyProductForm: ProductForm = {
  name: "",
  slug: "",
  code: "",
  variantLabel: "Standard",
  shortDescription: "",
  description: "",
  categoryId: "",
}
const adminDb = supabase as unknown as { from: (table: string) => any }

export default function AdminPage() {
  const [allowed, setAllowed] = useState<boolean | null>(null)
  const [section, setSection] = useState<Section>("requests")
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [requests, setRequests] = useState<QuoteRequest[]>([])
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([])
  const [users, setUsers] = useState<AdminUser[]>([])
  const [expandedRequest, setExpandedRequest] = useState<string | null>(null)
  const [expandedContactMessage, setExpandedContactMessage] =
    useState<string | null>(null)
  const [form, setForm] = useState<ProductForm>(emptyProductForm)
  const [status, setStatus] = useState("")
  const [error, setError] = useState("")

  const load = async () => {
    const { data: auth } = await supabase.auth.getUser()
    if (!auth.user) {
      setAllowed(false)
      return
    }
    const { data: membership } = await adminDb
      .from("admin_users")
      .select("user_id")
      .eq("user_id", auth.user.id)
      .maybeSingle()
    if (!membership) {
      setAllowed(false)
      return
    }

    const { data: sessionData } = await supabase.auth.getSession()
    const [
      productsResult,
      categoriesResult,
      requestsResult,
      contactMessagesResult,
      usersResult,
    ] = await Promise.all([
      adminDb
        .from("products")
        .select(
          "id,name,slug,code,short_description,description,product_variants(id,label),product_images(id,storage_path,alt_text,sort_order,is_primary),product_categories(category_id)",
        )
        .order("name"),
      adminDb
        .from("categories")
        .select("id,name")
        .eq("is_active", true)
        .order("name"),
      adminDb
        .from("quote_requests")
        .select(
          "id,request_number,first_name,last_name,company,email,phone,notes,status,admin_notes,created_at,quote_request_items(id,product_name,product_code,variant_label,quantity)",
        )
        .order("created_at", { ascending: false }),
      adminDb
        .from("contact_messages")
        .select(
          "id,message_number,full_name,company,email,phone,message,status,admin_notes,created_at",
        )
        .order("created_at", { ascending: false }),
      supabase.functions.invoke<AdminUser[]>("admin-list-users", {
        headers: sessionData.session
          ? { Authorization: "Bearer " + sessionData.session.access_token }
          : undefined,
      }),
    ])
    setProducts(productsResult.data ?? [])
    setCategories(categoriesResult.data ?? [])
    setRequests(requestsResult.data ?? [])
    setContactMessages(contactMessagesResult.data ?? [])
    setUsers(usersResult.data ?? [])
    // A user-directory integration failure must not surface as an alert across
    // the entire admin workspace. The other admin areas remain available.
    if (!usersResult.error) setError("")
    setAllowed(true)
  }

  useEffect(() => {
    void load()
  }, [])

  const updateRequest = async (
    request: QuoteRequest,
    changes: Partial<Pick<QuoteRequest, "status" | "admin_notes">>,
  ) => {
    const { error: updateError } = await adminDb
      .from("quote_requests")
      .update(changes)
      .eq("id", request.id)
    if (updateError) {
      setError("The enquiry could not be updated.")
      return
    }
    setRequests((current) =>
      current.map((item) =>
        item.id === request.id ? { ...item, ...changes } : item,
      ),
    )
  }

  const updateContactMessage = async (
    message: ContactMessage,
    changes: Partial<Pick<ContactMessage, "status" | "admin_notes">>,
  ) => {
    const { error: updateError } = await adminDb
      .from("contact_messages")
      .update(changes)
      .eq("id", message.id)
    if (updateError) {
      setError("The contact message could not be updated.")
      return
    }
    setContactMessages((current) =>
      current.map((item) =>
        item.id === message.id ? { ...item, ...changes } : item,
      ),
    )
  }

  const addProduct = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")
    setStatus("")
    if (!form.name.trim() || !form.slug.trim() || !form.categoryId) {
      setError("Complete the product name, URL slug and category.")
      return
    }

    const { data: product, error: productError } = await adminDb
      .from("products")
      .insert({
        name: form.name.trim(),
        slug: form.slug.trim(),
        code: form.code.trim() || null,
        short_description: form.shortDescription.trim() || null,
        description: form.description.trim() || null,
      })
      .select("id")
      .single()
    if (productError || !product) {
      setError(productError?.message ?? "The product could not be created.")
      return
    }

    // This satisfies the legacy database constraint only. Prices are never shown or edited.
    const [variant, category] = await Promise.all([
      adminDb
        .from("product_variants")
        .insert({
          product_id: product.id,
          label: form.variantLabel.trim() || "Standard",
          price_minor: 0,
          currency: "GBP",
          is_in_stock: true,
        }),
      adminDb
        .from("product_categories")
        .insert({ product_id: product.id, category_id: form.categoryId }),
    ])
    if (variant.error || category.error) {
      setError(
        "Product created, but its variant or category could not be saved.",
      )
      return
    }
    setForm(emptyProductForm)
    setStatus("Product added to the catalogue.")
    void load()
  }

  if (allowed === null)
    return (
      <main className="mx-auto max-w-[1400px] px-6 py-20">
        <p>Checking administrator access...</p>
      </main>
    )
  if (!allowed)
    return (
      <main className="mx-auto max-w-[1400px] px-6 py-20">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--primary)]">
          Restricted area
        </p>
        <h1 className="mt-3 text-5xl font-black">ADMIN ACCESS REQUIRED.</h1>
        <Link to="/account" className="tulda-button mt-7">
          SIGN IN
        </Link>
      </main>
    )

  return (
    <div className="mx-auto w-full max-w-[1400px] px-6 py-10 md:py-14">
      <div className="flex w-full flex-col gap-8 lg:flex-row">
        <AdminSidebar
          active={section}
          onChange={setSection}
          newRequests={requests.filter((item) => item.status === "new").length}
          newContactMessages={
            contactMessages.filter((item) => item.status === "new").length
          }
        />
        <main className="min-w-0 flex-1">
          <header
            className="flex flex-wrap items-end justify-between gap-5 border-b pb-7"
            style={{ borderColor: "var(--border)" }}
          >
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--primary)]">
                Administrator panel
              </p>
              <h1 className="mt-3 text-5xl font-black leading-[0.92]">
                {section === "requests"
                  ? "CUSTOMER ENQUIRIES."
                  : section === "contacts"
                    ? "CONTACT MESSAGES."
                    : section === "products"
                      ? "MANAGE PRODUCTS."
                      : "USER ACCOUNTS."}
              </h1>
            </div>
            <span className="text-sm text-[var(--muted-foreground)]">
              {products.length} products · {users.length} users
            </span>
          </header>
          {status && (
            <p
              className="mt-6 border border-[var(--primary)] bg-[var(--color-brand-soft)] p-4 text-sm"
              role="status"
            >
              {status}
            </p>
          )}
          {error && (
            <p
              className="mt-6 border border-[var(--color-danger)] bg-[var(--color-danger-soft)] p-4 text-sm text-[var(--color-danger)]"
              role="alert"
            >
              {error}
            </p>
          )}
          {section === "requests" && (
            <RequestsTable
              requests={requests}
              expanded={expandedRequest}
              onToggle={setExpandedRequest}
              onSave={updateRequest}
            />
          )}
          {section === "contacts" && (
            <ContactMessagesTable
              messages={contactMessages}
              expanded={expandedContactMessage}
              onToggle={setExpandedContactMessage}
              onSave={updateContactMessage}
            />
          )}
          {section === "products" && (
            <ProductsSection
              products={products}
              categories={categories}
              form={form}
              setForm={setForm}
              onSubmit={addProduct}
              onRefresh={load}
            />
          )}
          {section === "users" && <UsersTable users={users} />}
        </main>
      </div>
    </div>
  )
}

function AdminSidebar({
  active,
  onChange,
  newRequests,
  newContactMessages,
}: {
  active: Section
  onChange: (section: Section) => void
  newRequests: number
  newContactMessages: number
}) {
  const item = (id: Section, label: string, badge?: number) => (
    <button
      type="button"
      onClick={() => onChange(id)}
      className={
        "flex w-full items-center justify-between border-l-2 px-4 py-3 text-left text-sm font-bold transition-colors " +
        (active === id
          ? "border-[var(--primary)] bg-[var(--color-brand-soft)] text-[var(--primary)]"
          : "border-transparent hover:bg-[var(--muted)]")
      }
    >
      <span>{label}</span>
      {badge ? (
        <span className="rounded-full bg-[var(--primary)] px-2 py-0.5 text-xs text-white">
          {badge}
        </span>
      ) : null}
    </button>
  )
  return (
    <aside
      className="h-fit w-full border bg-white p-3 lg:sticky lg:top-28 lg:w-[230px] lg:shrink-0"
      style={{ borderColor: "var(--border)" }}
    >
      <p className="px-4 py-3 text-xs font-bold uppercase tracking-[0.15em] text-[var(--muted-foreground)]">
        Management
      </p>
      {item("requests", "Enquiries", newRequests)}
      {item("contacts", "Contact messages", newContactMessages)}
      {item("products", "Products")}
      {item("users", "Users")}
    </aside>
  )
}

function RequestsTable({
  requests,
  expanded,
  onToggle,
  onSave,
}: {
  requests: QuoteRequest[]
  expanded: string | null
  onToggle: (id: string | null) => void
  onSave: (
    request: QuoteRequest,
    changes: Partial<Pick<QuoteRequest, "status" | "admin_notes">>,
  ) => void
}) {
  if (!requests.length)
    return (
      <p className="mt-8 border p-6 text-sm text-[var(--muted-foreground)]">
        No customer enquiries yet.
      </p>
    )
  return (
    <section className="mt-8 w-full overflow-x-auto border">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="bg-[var(--muted)] text-xs uppercase tracking-wider text-[var(--muted-foreground)]">
          <tr>
            <th className="p-4">No.</th>
            <th className="p-4">Customer</th>
            <th className="p-4">Received</th>
            <th className="p-4">Status</th>
            <th className="p-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <RequestRow
              key={request.id}
              request={request}
              expanded={expanded === request.id}
              onToggle={() =>
                onToggle(expanded === request.id ? null : request.id)
              }
              onSave={onSave}
            />
          ))}
        </tbody>
      </table>
    </section>
  )
}

function RequestRow({
  request,
  expanded,
  onToggle,
  onSave,
}: {
  request: QuoteRequest
  expanded: boolean
  onToggle: () => void
  onSave: (
    request: QuoteRequest,
    changes: Partial<Pick<QuoteRequest, "status" | "admin_notes">>,
  ) => void
}) {
  const [notes, setNotes] = useState(request.admin_notes ?? "")
  return (
    <>
      <tr className="border-t">
        <td className="p-4 font-bold">#{request.request_number}</td>
        <td className="p-4">
          <strong>
            {request.first_name} {request.last_name}
          </strong>
          <span className="mt-1 block text-xs text-[var(--muted-foreground)]">
            {request.email}
          </span>
        </td>
        <td className="p-4">
          {new Date(request.created_at).toLocaleDateString("en-GB")}
        </td>
        <td className="p-4">
          <select
            value={request.status}
            onChange={(event) =>
              onSave(request, {
                status: event.target.value as QuoteRequest["status"],
              })
            }
            className="border bg-white px-2 py-1"
          >
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="quoted">Quoted</option>
            <option value="closed">Closed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </td>
        <td className="p-4 text-right">
          <button
            type="button"
            onClick={onToggle}
            className="font-bold text-[var(--primary)] underline"
          >
            {expanded ? "Hide details" : "View details"}
          </button>
        </td>
      </tr>
      {expanded && (
        <tr className="border-t bg-[var(--muted)]">
          <td colSpan={5} className="p-5">
            <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
              <div>
                <p className="font-bold">Requested products</p>
                <div className="mt-3 overflow-hidden border bg-white">
                  {request.quote_request_items.map((item) => (
                    <article
                      key={item.id}
                      className="flex items-start gap-4 border-b p-4 last:border-b-0"
                    >
                      <span className="flex h-9 min-w-9 items-center justify-center rounded-full bg-[var(--color-brand-soft)] text-sm font-black text-[var(--primary)]">
                        {item.quantity}×
                      </span>
                      <div className="min-w-0">
                        <h3 className="font-bold leading-snug">
                          {decodeText(item.product_name)}
                        </h3>
                        <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                          {item.product_code
                            ? decodeText(item.product_code) + " · "
                            : ""}
                          {decodeText(item.variant_label)}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
                {request.notes && (
                  <div className="mt-5 border-l-2 border-[var(--primary)] bg-white p-4 text-sm">
                    <strong>Customer note</strong>
                    <p className="mt-1">{request.notes}</p>
                  </div>
                )}
                <p className="mt-4 text-sm">
                  <a
                    className="font-bold underline"
                    href={"tel:" + request.phone}
                  >
                    {request.phone}
                  </a>
                  {request.company ? " · " + request.company : ""}
                </p>
              </div>
              <div>
                <label className="block text-sm font-bold">
                  Internal notes
                  <textarea
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    rows={6}
                    className="tulda-field mt-2 w-full p-3"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => onSave(request, { admin_notes: notes })}
                  className="tulda-button mt-3"
                >
                  SAVE NOTES
                </button>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  )
}

function ContactMessagesTable({
  messages,
  expanded,
  onToggle,
  onSave,
}: {
  messages: ContactMessage[]
  expanded: string | null
  onToggle: (id: string | null) => void
  onSave: (
    message: ContactMessage,
    changes: Partial<Pick<ContactMessage, "status" | "admin_notes">>,
  ) => void
}) {
  if (!messages.length)
    return (
      <p className="mt-8 border p-6 text-sm text-[var(--muted-foreground)]">
        No contact messages yet.
      </p>
    )
  return (
    <section className="mt-8 w-full overflow-x-auto border">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="bg-[var(--muted)] text-xs uppercase tracking-wider text-[var(--muted-foreground)]">
          <tr>
            <th className="p-4">No.</th>
            <th className="p-4">Sender</th>
            <th className="p-4">Received</th>
            <th className="p-4">Status</th>
            <th className="p-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {messages.map((message) => (
            <ContactMessageRow
              key={message.id}
              message={message}
              expanded={expanded === message.id}
              onToggle={() =>
                onToggle(expanded === message.id ? null : message.id)
              }
              onSave={onSave}
            />
          ))}
        </tbody>
      </table>
    </section>
  )
}

function ContactMessageRow({
  message,
  expanded,
  onToggle,
  onSave,
}: {
  message: ContactMessage
  expanded: boolean
  onToggle: () => void
  onSave: (
    message: ContactMessage,
    changes: Partial<Pick<ContactMessage, "status" | "admin_notes">>,
  ) => void
}) {
  const [notes, setNotes] = useState(message.admin_notes ?? "")
  return (
    <>
      <tr className="border-t">
        <td className="p-4 font-bold">#{message.message_number}</td>
        <td className="p-4">
          <strong>{message.full_name}</strong>
          <span className="mt-1 block text-xs text-[var(--muted-foreground)]">
            {message.email}
          </span>
        </td>
        <td className="p-4">
          {new Date(message.created_at).toLocaleDateString("en-GB")}
        </td>
        <td className="p-4">
          <select
            value={message.status}
            onChange={(event) =>
              onSave(message, {
                status: event.target.value as ContactMessage["status"],
              })
            }
            className="border bg-white px-2 py-1"
          >
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </td>
        <td className="p-4 text-right">
          <button
            type="button"
            onClick={onToggle}
            className="font-bold text-[var(--primary)] underline"
          >
            {expanded ? "Hide details" : "View details"}
          </button>
        </td>
      </tr>
      {expanded && (
        <tr className="border-t bg-[var(--muted)]">
          <td colSpan={5} className="p-5">
            <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
              <div>
                <p className="font-bold">Message</p>
                <div className="mt-3 border-l-2 border-[var(--primary)] bg-white p-4 text-sm leading-relaxed whitespace-pre-wrap">
                  {message.message}
                </div>
                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                  <a
                    className="font-bold underline"
                    href={"mailto:" + message.email}
                  >
                    {message.email}
                  </a>
                  {message.phone && (
                    <a
                      className="font-bold underline"
                      href={"tel:" + message.phone}
                    >
                      {message.phone}
                    </a>
                  )}
                  {message.company && <span>{message.company}</span>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold">
                  Internal notes
                  <textarea
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    rows={6}
                    className="tulda-field mt-2 w-full p-3"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => onSave(message, { admin_notes: notes })}
                  className="tulda-button mt-3"
                >
                  SAVE NOTES
                </button>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  )
}

function ProductsSection({
  products,
  categories,
  form,
  setForm,
  onSubmit,
  onRefresh,
}: {
  products: Product[]
  categories: Category[]
  form: ProductForm
  setForm: (value: ProductForm) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onRefresh: () => Promise<void>
}) {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const change = (key: keyof ProductForm, value: string) =>
    setForm({ ...form, [key]: value })
  return (
    <>
      <section className="mt-8 w-full overflow-hidden border">
        <div className="bg-[var(--surface-dark)] px-6 py-5 text-white">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--primary)]">
            New catalogue item
          </p>
          <h2 className="mt-2 text-3xl font-black">ADD A PRODUCT</h2>
        </div>
        <form
          onSubmit={onSubmit}
          className="grid gap-5 bg-[var(--muted)] p-6 md:grid-cols-2"
        >
          <Field
            label="Product name"
            value={form.name}
            onChange={(value) => change("name", value)}
          />
          <Field
            label="URL slug"
            value={form.slug}
            onChange={(value) => change("slug", value)}
          />
          <Field
            label="Product code (optional)"
            value={form.code}
            onChange={(value) => change("code", value)}
            optional
          />
          <Field
            label="First variant / size"
            value={form.variantLabel}
            onChange={(value) => change("variantLabel", value)}
          />
          <TextArea
            label="Short description (optional)"
            value={form.shortDescription}
            onChange={(value) => change("shortDescription", value)}
            rows={3}
          />
          <TextArea
            label="Product description (optional)"
            value={form.description}
            onChange={(value) => change("description", value)}
            rows={3}
          />
          <label className="text-sm font-bold md:col-span-2">
            Category
            <select
              required
              value={form.categoryId}
              onChange={(event) => change("categoryId", event.target.value)}
              className="tulda-field mt-2 w-full px-3"
            >
              <option value="">Choose a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <button className="tulda-button md:col-span-2">
            ADD PRODUCT TO CATALOGUE
          </button>
        </form>
      </section>
      <section className="mt-12 w-full">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--primary)]">
              Catalogue
            </p>
            <h2 className="mt-2 text-3xl font-black">CURRENT PRODUCTS</h2>
          </div>
          <span className="text-sm text-[var(--muted-foreground)]">
            {products.length} products
          </span>
        </div>
        <div className="mt-6 grid w-full gap-4 md:grid-cols-2">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={() => setEditingProduct(product)}
            />
          ))}
        </div>
      </section>
      {editingProduct && (
        <ProductEditorModal
          product={editingProduct}
          categories={categories}
          onClose={() => setEditingProduct(null)}
          onSaved={() => {
            setEditingProduct(null)
            void onRefresh()
          }}
        />
      )}
    </>
  )
}

function ProductCard({
  product,
  onEdit,
}: {
  product: Product
  onEdit: () => void
}) {
  const image = useMemo(
    () =>
      orderedImages(product.product_images)[0]?.storage_path ??
      getLocalProductImagePath(product.slug),
    [product.product_images, product.slug],
  )
  return (
    <article className="flex min-w-0 gap-4 border bg-white p-4 sm:p-5">
      <div
        className="flex h-24 w-24 shrink-0 items-center justify-center border bg-[var(--muted)] p-2"
        style={{ borderColor: "var(--border)" }}
      >
        {image ? (
          <img
            src={image}
            alt=""
            className="h-full w-full object-contain"
            loading="lazy"
          />
        ) : (
          <span className="text-center text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
            No image
          </span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--primary)]">
              {product.code || "Product"}
            </p>
            <h3 className="mt-2 text-lg font-black leading-tight">
              {decodeText(product.name)}
            </h3>
            <p className="mt-1 truncate text-xs text-[var(--muted-foreground)]">
              /{product.slug}
            </p>
          </div>
          <button
            type="button"
            onClick={onEdit}
            className="shrink-0 border px-3 py-2 text-xs font-bold hover:bg-[var(--muted)]"
          >
            EDIT
          </button>
        </div>
        <p className="mt-4 line-clamp-2 text-xs leading-relaxed text-[var(--muted-foreground)]">
          {richTextToPlainText(
            product.short_description || product.description,
          ) || "No product description yet."}
        </p>
        <div
          className="mt-4 border-t pt-3"
          style={{ borderColor: "var(--border)" }}
        >
          <p className="text-xs font-semibold text-[var(--muted-foreground)]">
            {product.product_variants
              .map((variant) => decodeText(variant.label))
              .join(" · ") || "No variants"}
          </p>
        </div>
      </div>
    </article>
  )
}

function ProductEditorModal({
  product,
  categories,
  onClose,
  onSaved,
}: {
  product: Product
  categories: Category[]
  onClose: () => void
  onSaved: () => void
}) {
  const [name, setName] = useState(product.name)
  const [slug, setSlug] = useState(product.slug)
  const [code, setCode] = useState(product.code ?? "")
  const [shortDescription, setShortDescription] = useState(
    product.short_description ?? "",
  )
  const [description, setDescription] = useState(product.description ?? "")
  const [categoryId, setCategoryId] = useState(
    product.product_categories[0]?.category_id ?? "",
  )
  const [variants, setVariants] = useState(() =>
    product.product_variants.map((variant) => ({
      id: variant.id,
      label: variant.label,
    })),
  )
  const [images, setImages] = useState(() =>
    orderedImages(product.product_images),
  )
  const [busy, setBusy] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")

  const uploadImage = async (file: File | undefined) => {
    if (!file) return
    setError("")
    setUploading(true)
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase()
    const storagePath = `${product.id}/${crypto.randomUUID()}-${safeName}`
    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(storagePath, file, { cacheControl: "3600", upsert: false })
    if (uploadError) {
      setUploading(false)
      setError(uploadError.message)
      return
    }
    const { data: publicUrl } = supabase.storage
      .from("product-images")
      .getPublicUrl(storagePath)
    const image = {
      product_id: product.id,
      storage_path: publicUrl.publicUrl,
      alt_text: name.trim() || product.name,
      sort_order: images.length,
      is_primary: images.length === 0,
    }
    const { data, error: imageError } = await adminDb
      .from("product_images")
      .insert(image)
      .select("id,storage_path,alt_text,sort_order,is_primary")
      .single()
    setUploading(false)
    if (imageError || !data) {
      setError(imageError?.message ?? "The image could not be saved.")
      return
    }
    setImages((current) => [...current, data])
  }

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")
    const cleanVariants = variants
      .map((variant) => ({ ...variant, label: variant.label.trim() }))
      .filter((variant) => variant.label)
    if (!name.trim() || !slug.trim() || cleanVariants.length === 0) {
      setError("Add a product name, URL slug and at least one variant.")
      return
    }
    setBusy(true)
    const productUpdate = adminDb
      .from("products")
      .update({
        name: name.trim(),
        slug: slug.trim(),
        code: code.trim() || null,
        short_description: shortDescription.trim() || null,
        description: description.trim() || null,
      })
      .eq("id", product.id)
    const currentIds = new Set(
      product.product_variants.map((variant) => variant.id),
    )
    const keptIds = new Set(
      cleanVariants.flatMap((variant) => (variant.id ? [variant.id] : [])),
    )
    const variantUpdates = cleanVariants
      .filter((variant) => variant.id)
      .map((variant) =>
        adminDb
          .from("product_variants")
          .update({ label: variant.label })
          .eq("id", variant.id),
      )
    const newVariants = cleanVariants
      .filter((variant) => !variant.id)
      .map((variant) =>
        adminDb
          .from("product_variants")
          .insert({
            product_id: product.id,
            label: variant.label,
            price_minor: 0,
            currency: "GBP",
            is_in_stock: true,
          }),
      )
    const removedIds = [...currentIds].filter((id) => !keptIds.has(id))
    const categoryUpdate = categoryId
      ? adminDb
          .from("product_categories")
          .upsert({ product_id: product.id, category_id: categoryId })
      : Promise.resolve({ error: null })
    const results = await Promise.all([
      productUpdate,
      categoryUpdate,
      ...variantUpdates,
      ...newVariants,
      ...removedIds.map((id) =>
        adminDb.from("product_variants").delete().eq("id", id),
      ),
    ])
    setBusy(false)
    const failed = results.find((result) => result.error)
    if (failed?.error) {
      setError(failed.error.message)
      return
    }
    onSaved()
  }

  return (
    <div
      className="fixed inset-0 z-[70] overflow-y-auto bg-[#061117]/75 p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-editor-title"
      onMouseDown={onClose}
    >
      <section
        className="mx-auto my-6 w-full max-w-3xl border bg-white shadow-2xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="flex items-start justify-between bg-[var(--surface-dark)] p-6 text-white">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--primary)]">
              Catalogue product
            </p>
            <h2 id="product-editor-title" className="mt-2 text-3xl font-black">
              EDIT PRODUCT
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-2xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </header>
        <form onSubmit={save} className="space-y-7 p-5 sm:p-6">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Product name" value={name} onChange={setName} />
            <Field label="URL slug" value={slug} onChange={setSlug} />
            <Field
              label="Product code (optional)"
              value={code}
              onChange={setCode}
              optional
            />
            <label className="text-sm font-bold">
              Category
              <select
                value={categoryId}
                onChange={(event) => setCategoryId(event.target.value)}
                className="tulda-field mt-2 w-full px-3"
              >
                <option value="">No category selected</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
            <TextArea
              label="Short description"
              value={shortDescription}
              onChange={setShortDescription}
              rows={4}
            />
            <TextArea
              label="Full product description"
              value={description}
              onChange={setDescription}
              rows={4}
            />
          </div>
          <section className="border p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="font-bold">Variants / sizes</h3>
                <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                  Add, rename or remove the available product variants.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setVariants((current) => [...current, { id: "", label: "" }])
                }
                className="border px-3 py-2 text-xs font-bold hover:bg-[var(--muted)]"
              >
                ADD VARIANT
              </button>
            </div>
            <div className="mt-4 space-y-3">
              {variants.map((variant, index) => (
                <div key={variant.id || "new-" + index} className="flex gap-3">
                  <input
                    value={variant.label}
                    onChange={(event) =>
                      setVariants((current) =>
                        current.map((item, itemIndex) =>
                          itemIndex === index
                            ? { ...item, label: event.target.value }
                            : item,
                        ),
                      )
                    }
                    className="tulda-field min-w-0 flex-1 px-3"
                    placeholder="e.g. 1.5 Litre Kit"
                  />
                  <button
                    type="button"
                    disabled={variants.length === 1}
                    onClick={() =>
                      setVariants((current) =>
                        current.filter((_, itemIndex) => itemIndex !== index),
                      )
                    }
                    className="border border-[var(--color-danger)] px-3 text-xs font-bold text-[var(--color-danger)] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    REMOVE
                  </button>
                </div>
              ))}
            </div>
          </section>
          <section className="border p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-bold">Product images</h3>
                <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                  Upload a main image or additional gallery images.
                </p>
              </div>
              <label className="border px-3 py-2 text-xs font-bold hover:bg-[var(--muted)]">
                {uploading ? "UPLOADING..." : "UPLOAD IMAGE"}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="sr-only"
                  disabled={uploading}
                  onChange={(event) => {
                    void uploadImage(event.target.files?.[0])
                    event.currentTarget.value = ""
                  }}
                />
              </label>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              {images.length ? (
                images.map((image) => (
                  <div
                    key={image.id}
                    className="relative h-20 w-20 border bg-[var(--muted)] p-1"
                  >
                    <img
                      src={image.storage_path}
                      alt={image.alt_text ?? ""}
                      className="h-full w-full object-contain"
                    />
                    {image.is_primary && (
                      <span className="absolute -bottom-5 left-0 text-[10px] font-bold text-[var(--primary)]">
                        PRIMARY
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-sm text-[var(--muted-foreground)]">
                  No uploaded images yet. Existing catalogue images stay
                  unchanged.
                </p>
              )}
            </div>
          </section>
          {error && (
            <p
              className="border border-[var(--color-danger)] bg-[var(--color-danger-soft)] p-3 text-sm text-[var(--color-danger)]"
              role="alert"
            >
              {error}
            </p>
          )}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="tulda-button-secondary"
            >
              CANCEL
            </button>
            <button disabled={busy || uploading} className="tulda-button">
              {busy ? "SAVING..." : "SAVE PRODUCT"}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

function orderedImages(images: ProductImage[]) {
  return [...images].sort(
    (a, b) =>
      Number(b.is_primary) - Number(a.is_primary) ||
      a.sort_order - b.sort_order,
  )
}

function UsersTable({ users }: { users: AdminUser[] }) {
  return (
    <section className="mt-8 w-full overflow-x-auto border">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead className="bg-[var(--muted)] text-xs uppercase tracking-wider text-[var(--muted-foreground)]">
          <tr>
            <th className="p-4">User</th>
            <th className="p-4">Role</th>
            <th className="p-4">Created</th>
            <th className="p-4">Last sign-in</th>
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-t">
              <td className="p-4">
                <strong>{user.full_name || "Unnamed user"}</strong>
                <span className="mt-1 block text-xs text-[var(--muted-foreground)]">
                  {user.email || user.id}
                </span>
              </td>
              <td className="p-4">
                <span
                  className={
                    user.is_admin
                      ? "bg-[var(--color-brand-soft)] px-2 py-1 text-xs font-bold text-[var(--primary)]"
                      : "text-[var(--muted-foreground)]"
                  }
                >
                  {user.is_admin ? "Administrator" : "Customer"}
                </span>
              </td>
              <td className="p-4">
                {new Date(user.created_at).toLocaleDateString("en-GB")}
              </td>
              <td className="p-4">
                {user.last_sign_in_at
                  ? new Date(user.last_sign_in_at).toLocaleDateString("en-GB")
                  : "Never"}
              </td>
              <td className="p-4 text-right">
                <UserActions user={user} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

function UserActions({ user }: { user: AdminUser }) {
  const copy = (value: string) => void navigator.clipboard?.writeText(value)
  return (
    <div className="flex justify-end gap-2">
      <button
        type="button"
        onClick={() => copy(user.email || user.id)}
        className="border px-3 py-2 text-xs font-bold hover:bg-[var(--muted)]"
      >
        COPY EMAIL
      </button>
      <button
        type="button"
        onClick={() => copy(user.id)}
        className="border px-3 py-2 text-xs font-bold hover:bg-[var(--muted)]"
      >
        COPY ID
      </button>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  optional = false,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  optional?: boolean
}) {
  return (
    <label className="text-sm font-bold">
      {label}
      <input
        required={!optional}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="tulda-field mt-2 w-full px-3"
      />
    </label>
  )
}

function TextArea({
  label,
  value,
  onChange,
  rows,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  rows: number
}) {
  const editorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value)
      editorRef.current.innerHTML = value
  }, [value])

  const applyFormat = (
    command: "bold" | "italic" | "insertUnorderedList" | "insertOrderedList" | "createLink",
  ) => {
    editorRef.current?.focus()
    const href = command === "createLink" ? window.prompt("Link URL") : null
    if (command !== "createLink" || href)
      document.execCommand(command, false, href ?? undefined)
    if (editorRef.current)
      onChange(sanitizeRichText(editorRef.current.innerHTML))
  }

  return (
    <div
      className="rounded-sm border bg-white p-3"
      style={{ borderColor: "var(--border)" }}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="text-sm font-bold">{label}</span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => applyFormat("bold")}
            className="admin-editor-tool"
            aria-label="Bold text"
          >
            <strong>B</strong>
          </button>
          <button
            type="button"
            onClick={() => applyFormat("italic")}
            className="admin-editor-tool"
            aria-label="Italic text"
          >
            <em>I</em>
          </button>
          <button
            type="button"
            onClick={() => applyFormat("insertUnorderedList")}
            className="admin-editor-tool"
            aria-label="Bulleted list"
          >
            •
          </button>
          <button
            type="button"
            onClick={() => applyFormat("insertOrderedList")}
            className="admin-editor-tool"
            aria-label="Numbered list"
          >
            1.
          </button>
          <button
            type="button"
            onClick={() => applyFormat("createLink")}
            className="admin-editor-tool"
            aria-label="Add link"
          >
            ↗
          </button>
        </div>
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-label={label}
        onInput={(event) =>
          onChange(sanitizeRichText(event.currentTarget.innerHTML))
        }
        className="admin-rich-text min-h-28"
        style={{ minHeight: `${Math.max(rows, 4) * 1.65}rem` }}
      />
    </div>
  )
}

function decodeText(value: string) {
  const element = document.createElement("textarea")
  element.innerHTML = value
  element.innerHTML = element.value
  return element.value
}
