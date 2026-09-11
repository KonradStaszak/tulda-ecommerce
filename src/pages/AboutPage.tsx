import { Link } from "react-router-dom"

const priorities = [
  {
    number: "01",
    title: "Material costs",
    copy: "Professional quality should deliver professional results, without unnecessary cost.",
  },
  {
    number: "02",
    title: "Productivity",
    copy: "Advanced technology and dependable application help keep every repair moving.",
  },
  {
    number: "03",
    title: "Consistency",
    copy: "Products developed to help professionals achieve outstanding results, time after time.",
  },
]

export default function AboutPage() {
  return (
    <main>
      <section className="border-b" style={{ borderColor: "var(--border)" }}>
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-10 px-6 py-14 md:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div className="max-w-xl">
            <h1 className="text-5xl font-black leading-[0.92] tracking-tight md:text-7xl">
              TULDA. <span style={{ color: "var(--primary)" }}>BUILT</span> FOR
              THE WAY AUTOMOTIVE REFINISHING WORKS TODAY.
            </h1>
            <p
              className="mt-7 text-base leading-relaxed md:text-lg"
              style={{ color: "var(--muted-foreground)" }}
            >
              TULDA is more than a range of automotive refinishing products. It
              is a brand built around a simple belief: professional quality
              should deliver professional results, without unnecessary cost.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/products" className="tulda-button px-6">
                EXPLORE PRODUCTS
              </Link>
              <Link to="/contact" className="tulda-button-secondary px-6">
                BOOK A DEMO
              </Link>
            </div>
          </div>
          <figure className="relative min-h-[320px] overflow-hidden bg-[#071519] md:min-h-[430px]">
            <img
              src="/assets/campaign/tulda-workshop-range-black-coupe.png"
              alt="Tulda professional refinishing products in a working bodyshop"
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
            <div
              className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,21,27,0.42),rgba(7,21,27,0.04)_65%)]"
              aria-hidden="true"
            />
            <figcaption className="absolute bottom-0 left-0 max-w-[320px] border-t border-r border-white/25 bg-[#071519]/90 px-5 py-4 text-sm leading-relaxed text-white">
              Professional products. Exceptional results. Outstanding value.
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="bg-[#eff7fa] py-16 md:py-24">
        <div className="mx-auto max-w-[1400px] px-6">
          <div className="grid gap-8 lg:grid-cols-[1.12fr_0.88fr] lg:items-end">
            <div>
              <h2 className="max-w-3xl text-4xl font-black leading-[0.9] tracking-tight md:text-6xl">
                ADVANCED TECHNOLOGY.
                <br />
                <span style={{ color: "var(--primary)" }}>
                  OUTSTANDING VALUE.
                </span>
              </h2>
            </div>
            <p
              className="max-w-xl border-l-4 border-[var(--primary)] pl-6 text-base leading-relaxed md:text-lg"
              style={{ color: "var(--muted-foreground)" }}
            >
              Created to meet the demands of today’s automotive refinishing
              market, TULDA brings together advanced technology, outstanding
              product performance and exceptional value across every stage of
              the repair process.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {priorities.map((priority) => (
              <article
                key={priority.title}
                className="group min-h-[230px] border bg-white p-7 transition-transform duration-200 hover:-translate-y-1"
                style={{ borderColor: "var(--border)" }}
              >
                <span
                  className="text-sm font-black"
                  style={{ color: "var(--primary)" }}
                >
                  {priority.number}
                </span>
                <h3 className="mt-12 text-2xl font-black leading-none">
                  {priority.title}
                </h3>
                <p
                  className="mt-4 max-w-sm text-sm leading-relaxed"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  {priority.copy}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-10 grid grid-cols-[3rem_1fr] gap-4 border-t border-[#b9d7e2] pt-8 md:grid-cols-[5rem_1fr] md:gap-7">
            <span
              aria-hidden="true"
              className="font-[var(--font-heading)] text-7xl font-black leading-[0.7] text-[var(--primary)] md:text-8xl"
            >
              “
            </span>
            <p className="max-w-5xl text-base leading-relaxed text-[var(--foreground)] md:text-xl">
              We know that modern bodyshops, paintshops, professional painters,
              smart repair specialists and distributors are under greater
              pressure than ever. Material costs matter. Productivity matters.
              Consistency matters. But above all, the quality of the finished
              repair matters. That is why every TULDA product is developed with
              one goal in mind: to help professionals achieve outstanding
              results, time after time.
            </p>
          </div>
        </div>
      </section>

      <section style={{ backgroundColor: "var(--surface-dark)" }}>
        <div className="mx-auto grid max-w-[1400px] lg:grid-cols-[0.82fr_1.18fr]">
          <div className="flex flex-col justify-center px-6 py-16 lg:py-24 lg:pr-16">
            <h2 className="text-4xl font-black leading-[0.92] text-white md:text-6xl">
              THE COMPLETE
              <br />
              <span style={{ color: "var(--primary)" }}>
                REFINISHING PROCESS.
              </span>
            </h2>
            <p
              className="mt-7 text-base leading-relaxed md:text-lg"
              style={{ color: "var(--surface-dark-muted)" }}
            >
              From high-performance 2K clearcoats, primers and fillers to
              professional abrasives, our growing range is designed to support
              the complete automotive refinishing process.
            </p>
            <div
              className="mt-9 space-y-5 border-t border-white/15 pt-7 text-sm leading-relaxed md:text-base"
              style={{ color: "var(--surface-dark-muted)" }}
            >
              <p>
                Whether you are carrying out a full vehicle refinish, a
                localised repair or smart repair, TULDA products are developed
                to deliver excellent application, reliable performance and the
                finish that professional refinishers demand.
              </p>
              <p>
                Expect excellent flow, high gloss and a clean,
                imperfection-free finish that looks as good as it performs.
                TULDA is about putting professional-grade performance within
                reach of businesses that demand quality while remaining
                conscious of the cost of every repair.
              </p>
            </div>
          </div>
          <figure
            className="relative min-h-[440px] bg-cover bg-center lg:min-h-[620px]"
            style={{
              backgroundImage:
                "url('/assets/campaign/tulda-ct60-application-black-coupe.png')",
            }}
            role="img"
            aria-label="Tulda clearcoat applied in a professional bodyshop"
          >
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"
              aria-hidden="true"
            />
            <figcaption className="absolute bottom-8 left-8 max-w-md pr-8 font-[var(--font-heading)] text-3xl font-black uppercase leading-[0.95] text-white md:bottom-10 md:left-10 md:text-4xl">
              And when the job is finished,
              <span className="block text-[var(--primary)]">
                the result speaks for itself.
              </span>
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-6 py-16 md:py-24">
        <div className="grid items-stretch gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <figure
            className="min-h-[360px] bg-cover max-lg:aspect-[3/2]"
            style={{
              backgroundImage:
                "url('/assets/campaign/tulda-abrasives-range-blue.png')",
              backgroundPosition: "center 46%",
            }}
            role="img"
            aria-label="Tulda professional abrasives"
          />
          <div className="flex flex-col justify-center py-2 lg:py-8">
            <h2 className="text-4xl font-black leading-[0.92] md:text-5xl">
              QUALITY WITHOUT COMPROMISE.
              <br />
              <span style={{ color: "var(--primary)" }}>
                VALUE WITHOUT COMPROMISE.
              </span>
            </h2>
            <div
              className="mt-7 space-y-5 text-sm leading-relaxed md:text-base"
              style={{ color: "var(--muted-foreground)" }}
            >
              <p>
                We believe choosing TULDA should never mean compromising on
                quality. It means making a smarter choice.
              </p>
              <p>
                Whether you are a distributor expanding your automotive
                refinishing range, a bodyshop looking to improve efficiency, a
                professional painter demanding consistent results, or a smart
                repair specialist looking for reliable products that deliver,
                TULDA is built to support you.
              </p>
              <p>
                Behind every TULDA product is a team that understands the
                refinishing industry and the challenges faced every day in the
                workshop. Our specialist technical support and outstanding
                customer service are there to help you select the right
                products, get the best from your system and achieve the results
                you expect.
              </p>
            </div>
            <div
              className="mt-9 border-t pt-7"
              style={{ borderColor: "var(--border)" }}
            >
              <p
                className="text-xl font-black"
                style={{ color: "var(--foreground)" }}
              >
                THIS IS TULDA.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link to="/products" className="tulda-button px-6">
                  VIEW PRODUCTS
                </Link>
                <Link to="/contact" className="tulda-button-secondary px-6">
                  CONTACT TULDA
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
