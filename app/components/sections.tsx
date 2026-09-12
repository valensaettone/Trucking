import Image from "next/image";

import styles from "./sections.module.css";

const SERVICES = [
  {
    n: "01",
    title: "Local Transportation",
    body: "Same-day and next-day moves across the Greater Toronto Area, with dispatch that knows the lanes, the docks and the traffic windows.",
  },
  {
    n: "02",
    title: "Regional Transportation",
    body: "Scheduled and on-demand freight within Ontario and the surrounding provinces and states, sized to your volume.",
  },
  {
    n: "03",
    title: "Long-Haul Transportation",
    body: "Coast-to-coast and cross-border hauling throughout North America, tracked from pickup to final delivery.",
  },
  {
    n: "04",
    title: "Expedited Shipping",
    body: "Dedicated equipment and direct routing for time-sensitive freight that has to arrive fast, and on schedule.",
  },
  {
    n: "05",
    title: "Supply Chain Management",
    body: "We analyse your logistics requirements end to end, then design the transportation programme that fits them.",
  },
  {
    n: "06",
    title: "Transportation Solutions",
    body: "Custom-built plans for unusual lanes, seasonal peaks and shipment profiles that do not fit a standard rate card.",
  },
  {
    n: "07",
    title: "Safety-Focused Hauling",
    body: "Compliance, maintenance and driver standards held above the bar, because your freight and the road both depend on it.",
  },
];

const PILLARS = [
  {
    title: "Based in Toronto",
    body: "A Greater Toronto Area home base puts our fleet inside Canada's busiest freight corridor and a short run from the US border.",
  },
  {
    title: "One point of contact",
    body: "A single team handles quoting, dispatch and updates, so you are never chasing a shipment across three departments.",
  },
  {
    title: "Safety before speed",
    body: "Expedited never means improvised. Every urgent load still moves under the same safety and compliance standards.",
  },
  {
    title: "Built around your lanes",
    body: "We start from your supply chain rather than from our schedule, and shape the solution to the freight you actually move.",
  },
];

export function Services() {
  return (
    <section className={styles.services} id="services">
      <div className="shell">
        <header className={styles.sectionHead} data-reveal="">
          <span className="eyebrow">What we move</span>
          <h2 className={styles.sectionTitle}>
            Seven ways Reliance Express keeps your freight moving
          </h2>
          <p className={styles.sectionLede}>
            From a single local drop to a managed cross-border programme, every
            service runs on the same fleet, the same dispatch desk and the same
            safety standard.
          </p>
        </header>

        <ul className={styles.grid}>
          {SERVICES.map((service) => (
            <li key={service.n} className={styles.card} data-reveal="">
              <span className={styles.cardNum}>{service.n}</span>
              <h3 className={styles.cardTitle}>{service.title}</h3>
              <p className={styles.cardBody}>{service.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function WhyUs() {
  return (
    <section className={styles.why} id="why">
      <div className="shell">
        <div className={styles.whyGrid}>
          <header className={styles.whyHead} data-reveal="">
            <span className="eyebrow">Why Reliance</span>
            <h2 className={styles.sectionTitle}>
              A carrier that behaves like part of your team
            </h2>
            <p className={styles.sectionLede}>
              Reliance Express Ltd. is a Toronto-based transportation and
              logistics company serving shippers across Canada and the United
              States.
            </p>
          </header>

          <ul className={styles.pillars}>
            {PILLARS.map((pillar) => (
              <li key={pillar.title} className={styles.pillar} data-reveal="">
                <h3>{pillar.title}</h3>
                <p>{pillar.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function Contact() {
  return (
    <section className={styles.contact} id="contact">
      <div className="shell">
        <div className={styles.contactInner} data-reveal="">
          <span className="eyebrow">Get started</span>
          <h2 className={styles.contactTitle}>
            Optimize your logistics today.
          </h2>
          <p className={styles.contactLede}>
            Tell us the lane, the freight and the deadline. We will come back
            with a transportation plan and a rate.
          </p>

          <div className={styles.actions}>
            <a className={styles.primary} href="mailto:info@relianceexpress.ca">
              Get a Quote
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M5 12h13M12 5l7 7-7 7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
            <a className={styles.secondary} href="tel:+10000000000">
              Call dispatch
            </a>
          </div>

          <dl className={styles.details}>
            <div>
              <dt>Head office</dt>
              <dd>Toronto, Ontario, Canada</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>info@relianceexpress.ca</dd>
            </div>
            <div>
              <dt>Coverage</dt>
              <dd>Canada &amp; the United States</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className="shell">
        <div className={styles.footerInner}>
          <Image
            className={styles.footerLogo}
            src="/brand/logo-light.png"
            alt="Reliance Express Ltd."
            width={700}
            height={307}
          />
          <nav aria-label="Footer">
            <ul className={styles.footerNav}>
              <li>
                <a href="#services">Services</a>
              </li>
              <li>
                <a href="#why">Why Reliance</a>
              </li>
              <li>
                <a href="#contact">Contact</a>
              </li>
            </ul>
          </nav>
          <p className={styles.copyright}>
            &copy; {new Date().getFullYear()} Reliance Express Ltd. Toronto,
            Ontario.
          </p>
        </div>
      </div>
    </footer>
  );
}
