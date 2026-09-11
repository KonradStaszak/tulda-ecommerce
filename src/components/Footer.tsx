import { Link } from "react-router-dom"
import tuldaLogo from "../assets/brand/tulda-logo.png"

type FooterLink = {
  label: string
  to: string
}

const footerLinks: Array<{ heading: string links: FooterLink[] }> = [
  {
    heading: "Products",
    links: [
      { label: "Abrasives", to: "/products/abrasives" },
      { label: "Fillers", to: "/products/filler" },
      { label: "Primers", to: "/products/primer" },
      { label: "Thinners", to: "/products/thinner" },
      { label: "Clearcoats", to: "/products/clearcoat" },
      { label: "Kits", to: "/products/kits" },
    ],
  },
  {
    heading: "Support",
    links: [
      { label: "Technical Documents", to: "/technical-documents" },
      { label: "Book a Demo", to: "/contact" },
      { label: "Contact Us", to: "/contact" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About Tulda", to: "/about" },
      { label: "Distributor Enquiries", to: "/contact" },
    ],
  },
  {
    heading: "Account",
    links: [
      { label: "My Account", to: "/account" },
      { label: "Wishlist", to: "/wishlist" },
    ],
  },
]

const socialLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/tuldauk/",
    icon: (
      <svg
        aria-hidden="true"
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/tulda/",
    icon: (
      <svg
        aria-hidden="true"
        className="h-4 w-4"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M13.7 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5H17V3.9c-.3 0-1.3-.1-2.4-.1-2.4 0-4.1 1.5-4.1 4.2V10H7.8v3h2.7v8h3.2Z" />
      </svg>
    ),
  },
]

export default function Footer() {
  return (
    <footer style={{ backgroundColor: "var(--surface-dark)" }}>
      <div className="mx-auto max-w-[1400px] px-6 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <img
              src={tuldaLogo}
              alt="Tulda"
              className="h-8 w-auto object-contain"
            />
            <p className="mb-6 mt-5 max-w-[280px] text-sm font-light leading-relaxed text-[var(--surface-dark-muted)]">
              Professional automotive refinishing systems, built for bodyshops,
              paintshops and smart repair specialists.
            </p>
            <div className="mb-8 space-y-2 text-xs text-[var(--surface-dark-muted)]">
              <p>
                <a
                  href="tel:+442088193278"
                  className="transition-colors hover:text-[var(--primary)]"
                >
                  +44 (0) 2088 193278
                </a>
              </p>
              <p>
                <a
                  href="mailto:contact@tulda.co.uk"
                  className="transition-colors hover:text-[var(--primary)]"
                >
                  contact@tulda.co.uk
                </a>
              </p>
              <p>Unit 5B, Tomo Industrial Estate, Cowley, London UB8 2JP</p>
            </div>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-sm border text-[var(--surface-dark-muted)] transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)]"
                  style={{ borderColor: "rgba(255,255,255,0.12)" }}
                  aria-label={`Visit Tulda on ${social.label}`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
          {footerLinks.map(({ heading, links }) => (
            <div key={heading}>
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[var(--surface-dark-foreground)]">
                {heading}
              </p>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-xs text-[var(--surface-dark-muted)] transition-colors hover:text-[var(--primary)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  )
}
