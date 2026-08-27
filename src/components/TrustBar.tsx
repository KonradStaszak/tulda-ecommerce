const trustItems = [
  {
    title: `Free delivery over \u00A350`,
    subtitle: 'UK mainland delivery',
    icon: <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /><circle cx="12" cy="12" r="10" /></svg>,
  },
  {
    title: 'Professional grade',
    subtitle: 'Tested in real bodyshops',
    icon: <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
  },
  {
    title: 'Technical support',
    subtitle: 'Mon\u2013Fri, on-site demos',
    icon: <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 018 0 4 4 0 018 0z" /></svg>,
  },
  {
    title: 'Easy returns',
    subtitle: 'Hassle-free within 30 days',
    icon: <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
  },
]

export default function TrustBar() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1400px] px-6 py-4 sm:py-5">
        <div className="grid grid-cols-2 gap-x-6 gap-y-5 lg:grid-cols-4 lg:gap-x-10">
          {trustItems.map((item) => (
            <div key={item.title} className="flex min-w-0 items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#eaf8fd] text-[#18aee5]">{item.icon}</div>
              <div className="min-w-0">
                <p className="truncate text-[13px] font-semibold leading-tight text-[var(--foreground)]" style={{ fontFamily: 'Inter, sans-serif' }}>{item.title}</p>
                <p className="mt-0.5 truncate text-xs text-[var(--muted-foreground)]" style={{ fontFamily: 'Inter, sans-serif' }}>{item.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
