import { Link } from 'react-router-dom'
import tuldaLogo from '../assets/brand/tulda-logo.png'

const footerLinks = {
  Products: [
    'Clearcoats',
    'Primers',
    'Abrasives',
    'Fillers',
    'Thinners',
    'Kits',
  ],
  Support: [
    'Technical Data Sheets',
    'Safety Data Sheets',
    'Application Guides',
    'Book a Demo',
    'Contact Us',
  ],
  Company: [
    'About Tulda',
    'Distributor Enquiries',
    'Careers',
    'News',
  ],
  Account: [
    'Create Account',
    'Sign In',
    'My Orders',
    'Wishlist',
    'Trade Accounts',
  ],
}

const productSlugs: Record<string, string> = {
  Clearcoats: 'clearcoats',
  Primers: 'primers',
  Abrasives: 'abrasives',
  Fillers: 'fillers',
  Thinners: 'thinners',
  Kits: 'kits',
}

const socialLinks = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/tuldauk/',
    icon: <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" stroke="none" /></svg>,
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/tulda/',
    icon: <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M13.7 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5H17V3.9c-.3 0-1.3-.1-2.4-.1-2.4 0-4.1 1.5-4.1 4.2V10H7.8v3h2.7v8h3.2Z" /></svg>,
  },
]

export default function Footer() {
  return (
    <footer style={{ backgroundColor: 'var(--surface-dark)' }}>
      {/* Main footer */}
      <div className="max-w-[1400px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-2">
            {/* Logo */}
            <div className="flex items-center gap-2.5 mb-5">
              <img src={tuldaLogo} alt="Tulda" className="h-8 w-auto object-contain" />
            </div>

            <p
              className="text-sm leading-relaxed mb-6"
              style={{ color: 'var(--surface-dark-muted)', fontFamily: 'Inter, sans-serif', fontWeight: 300, maxWidth: '280px' }}
            >
              Professional automotive refinishing products. Formulated for the bodyshop. Built for efficient performance.
            </p>

            {/* Contact snippet */}
            <div className="space-y-2 mb-8">
              <p className="text-xs" style={{ color: 'var(--surface-dark-muted)', fontFamily: 'Inter, sans-serif' }}>
                +44 (0) 2088 193278
              </p>
              <p className="text-xs" style={{ color: 'var(--surface-dark-muted)', fontFamily: 'Inter, sans-serif' }}>
                contact@tulda.co.uk
              </p>
              <p className="text-xs" style={{ color: 'var(--surface-dark-muted)', fontFamily: 'Inter, sans-serif' }}>
                Unit 5B, Tomo Industrial Estate, Cowley, London UB8 2JP
              </p>
            </div>

            {/* Social icons */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-sm border text-[var(--surface-dark-muted)] transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)]"
                  style={{
                    borderColor: 'rgba(255,255,255,0.12)',
                  }}
                  aria-label={`Visit Tulda on ${social.label}`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-4"
                style={{
                  color: 'var(--surface-dark-foreground)',
                  fontFamily: 'Barlow Condensed, sans-serif',
                  letterSpacing: '0.14em',
                }}
              >
                {heading}
              </p>
              <ul className="space-y-2.5">
                {links.map(link => (
                  <li key={link}>
                    <Link
                      to={productSlugs[link] ? `/products/${productSlugs[link]}` : link === 'About Tulda' ? '/about' : link === 'Contact Us' || link === 'Book a Demo' ? '/contact' : link.includes('Data') || link.includes('Guides') ? '/technical-documents' : '/'}
                      className="text-xs text-[var(--surface-dark-muted)] transition-colors hover:text-[var(--primary)]"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Trust badge bar */}
      <div
        className="border-t border-b"
        style={{ borderColor: 'rgba(255,255,255,0.06)', backgroundColor: 'rgba(255,255,255,0.03)' }}
      >
        <div className="max-w-[1400px] mx-auto px-6 py-5">
          <div className="flex flex-wrap gap-6 items-center">
            <p
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: 'var(--surface-dark-muted)', fontFamily: 'Barlow Condensed, sans-serif', letterSpacing: '0.12em' }}
            >
              We accept:
            </p>
            {['Visa', 'Mastercard', 'Amex', 'PayPal', 'Bank Transfer'].map(method => (
              <span
                key={method}
                className="px-3 py-1 text-[10px] font-semibold border rounded-sm"
                style={{
                  borderColor: 'rgba(255,255,255,0.12)',
                  color: 'var(--surface-dark-muted)',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                {method}
              </span>
            ))}
            <span className="ml-auto text-[10px]" style={{ color: 'var(--surface-dark-muted)', fontFamily: 'Inter, sans-serif' }}>
              Free delivery on orders over £50 · UK mainland
            </span>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-[1400px] mx-auto px-6 py-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <p className="text-[11px]" style={{ color: 'var(--surface-dark-muted)', fontFamily: 'Inter, sans-serif' }}>
            © {new Date().getFullYear()} Tulda Professional Refinishing Products. All rights reserved.
            Registered in England. Unit 5B, Tomo Industrial Estate, Cowley, London UB8 2JP.
          </p>
          <div className="flex gap-5">
            {['Privacy Policy', 'Terms of Sale', 'Cookie Policy', 'Sitemap'].map(l => (
              <a
                key={l}
                href="#"
                className="text-[11px] text-[var(--surface-dark-muted)] transition-colors hover:text-[var(--primary)]"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
