import { Link } from 'react-router-dom'

type WorkshopStory = {
  title: string
  description: string
  image: string
  alt: string
  to: string
  className: string
}

const workshopStories: WorkshopStory[] = [
  {
    title: 'Clearcoat systems',
    description: 'Professional finishes, built for bodyshops.',
    image: '/assets/campaign/tulda-ct60-application.jpg',
    alt: 'Tulda CT60 HS clearcoat in a professional bodyshop',
    to: '/products/clearcoat',
    className: 'min-h-[300px] md:min-h-[464px]',
  },
  {
    title: 'Abrasives',
    description: 'Precision from preparation to finish.',
    image: '/assets/campaign/tulda-abrasives-range.jpg',
    alt: 'Tulda abrasives range in a professional workshop',
    to: '/products/abrasives',
    className: 'min-h-[224px] md:min-h-0',
  },
  {
    title: 'Made for the workshop',
    description: 'Reliable products for every stage of the repair.',
    image: '/assets/campaign/tulda-abrasives-in-use.jpg',
    alt: 'Tulda abrasives being prepared for use',
    to: '/products',
    className: 'min-h-[224px] md:min-h-0',
  },
]

function WorkshopCard({ story }: { story: WorkshopStory }) {
  return (
    <Link
      to={story.to}
      className={`group relative block overflow-hidden border border-[#dbe3e7] bg-[#edf3f5] ${story.className}`}
    >
      <img
        src={story.image}
        alt={story.alt}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.025]"
      />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-[#111315]/90 px-5 py-4 text-white backdrop-blur-sm">
        <div>
          <h3 className="font-['Barlow_Condensed'] text-[24px] font-bold uppercase leading-none tracking-[-0.01em]">
            {story.title}
          </h3>
          <p className="mt-1 text-xs leading-snug text-white/70">{story.description}</p>
        </div>
        <span
          aria-hidden="true"
          className="mb-0.5 shrink-0 text-xl leading-none text-[#18AEE5] transition-transform duration-200 group-hover:translate-x-1"
        >
          →
        </span>
      </div>
    </Link>
  )
}

export default function WorkshopGallery() {
  return (
    <section className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-5 md:mb-10 md:flex-row md:items-end md:justify-between">
          <div className="max-w-[620px]">
            <h2 className="font-['Barlow_Condensed'] text-[clamp(2.35rem,4vw,4.25rem)] font-bold uppercase leading-[0.88] tracking-[-0.03em] text-[#111315]">
              Built for the workshop.
            </h2>
            <p className="mt-4 max-w-[550px] text-[15px] leading-7 text-[#5f6870] md:text-base">
              From prep to final finish, Tulda products are made to perform in the real world — where consistency matters.
            </p>
          </div>
          <Link
            to="/products"
            className="group inline-flex w-fit items-center gap-2 border-b border-[#18AEE5] pb-1 text-sm font-semibold uppercase tracking-[0.08em] text-[#111315] transition-colors hover:text-[#18AEE5]"
          >
            Explore the range
            <span aria-hidden="true" className="text-lg leading-none transition-transform duration-200 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[1.35fr_1fr]">
          <WorkshopCard story={workshopStories[0]} />
          <div className="grid grid-cols-1 gap-4 md:grid-rows-2">
            <WorkshopCard story={workshopStories[1]} />
            <WorkshopCard story={workshopStories[2]} />
          </div>
        </div>
      </div>
    </section>
  )
}
