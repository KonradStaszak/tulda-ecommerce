import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <main className="max-w-[1400px] mx-auto px-6 py-24 text-center">
      <h1 className="text-4xl font-black" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>PAGE NOT FOUND</h1>
      <p className="mt-3 text-sm" style={{ color: 'var(--muted-foreground)', fontFamily: 'Inter, sans-serif' }}>The page you requested does not exist.</p>
      <Link to="/" className="tulda-button mt-7">RETURN HOME</Link>
    </main>
  )
}
