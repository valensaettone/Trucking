import Image from "next/image";

import styles from "./sections.module.css";

/**
 * The seven services are laid out as a bento grid on a 12-column track. The
 * spans run 5-4-3 / 3-4-5 so the two rows mirror each other, and the seventh
 * — safety, the one that underwrites the other six — takes the full width as
 * a dark feature panel. `tags` are micro-labels distilled from `body`.
 */
type Service = {
  n: string;
  title: string;
  body: string;
  tags: string[];
  /** Column weight on the 12-column desktop grid. */
  span: 3 | 4 | 5 | 12;
};

const SERVICES: Service[] = [
  {
    n: "01",
    title: "Local Transportation",
    body: "Same-day and next-day moves across the Greater Toronto Area, with dispatch that knows the lanes, the docks and the traffic windows.",
    tags: ["Greater Toronto Area", "Same & next day"],
    span: 5,
  },
  {
    n: "02",
    title: "Regional Transportation",
    body: "Scheduled and on-demand freight within Ontario and the surrounding provinces and states, sized to your volume.",
    tags: ["Ontario & neighbours", "Scheduled or on demand"],
    span: 4,
  },
  {
    n: "03",
    title: "Long-Haul Transportation",
    body: "Coast-to-coast and cross-border hauling throughout North America, tracked from pickup to final delivery.",
    tags: ["North America", "Cross-border"],
    span: 3,
  },
  {
    n: "04",
    title: "Expedited Shipping",
    body: "Dedicated equipment and direct routing for time-sensitive freight that has to arrive fast, and on schedule.",
    tags: ["Dedicated equipment", "Direct routing"],
    span: 3,
  },
  {
    n: "05",
    title: "Supply Chain Management",
    body: "We analyse your logistics requirements end to end, then design the transportation programme that fits them.",
    tags: ["End to end", "Programme design"],
    span: 4,
  },
  {
    n: "06",
    title: "Transportation Solutions",
    body: "Custom-built plans for unusual lanes, seasonal peaks and shipment profiles that do not fit a standard rate card.",
    tags: ["Unusual lanes", "Seasonal peaks"],
    span: 5,
  },
  {
    n: "07",
    title: "Safety-Focused Hauling",
    body: "Compliance, maintenance and driver standards held above the bar, because your freight and the road both depend on it.",
    tags: ["Compliance", "Maintenance", "Driver standards"],
    span: 12,
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
  const cards = SERVICES.slice(0, -1);
  const feature = SERVICES[SERVICES.length - 1];

  return (
    <section className={styles.services} id="services">
      <div className={styles.glow} aria-hidden="true" />

      <div className="shell">
        <header className={styles.servicesHead}>
          <div className={styles.headMain} data-reveal="">
            <span className="eyebrow">What we move</span>
            <h2 className={styles.servicesTitle}>
              {/* The highlight behind "Seven ways" is painted by the reveal,
                  so the count is what the eye lands on first. */}
              <span className={styles.mark}>Seven ways</span> Reliance Express
              keeps your freight moving
            </h2>
          </div>

          <div className={styles.headAside} data-reveal="">
            <p className={styles.sectionLede}>
              From a single local drop to a managed cross-border programme,
              every service runs on the same fleet, the same dispatch desk and
              the same safety standard.
            </p>
            <p className={styles.count} aria-hidden="true">
              <span>01</span>
              <span className={styles.countRule} />
              <span>07</span>
            </p>
          </div>
        </header>

        <ul className={styles.grid}>
          {cards.map((service) => (
            <li
              key={service.n}
              className={styles.card}
              data-span={service.span}
              data-reveal=""
            >
              <span className={styles.rule} aria-hidden="true" />
              <span className={styles.cardNum}>{service.n}</span>
              <h3 className={styles.cardTitle}>{service.title}</h3>
              <p className={styles.cardBody}>{service.body}</p>
              <ul className={styles.tags}>
                {service.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
              <span className={styles.ghost} aria-hidden="true">
                {service.n}
              </span>
            </li>
          ))}

          <li className={styles.feature} data-reveal="">
            <div className={styles.featureBody}>
              <span className={styles.cardNum}>{feature.n}</span>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureText}>{feature.body}</p>
            </div>
            <ul className={styles.pills}>
              {feature.tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
            {/* Road centre-line: dashes that run the width of the panel. */}
            <span className={styles.lane} aria-hidden="true" />
          </li>
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

          {/* Preview build: both buttons are inert on purpose. They keep the
              real styling and focus behaviour, but no `mailto:` or `tel:`
              is wired up, so a client walkthrough cannot open a mail client
              or dial a placeholder number. */}
          <div className={styles.actions}>
            <button className={styles.primary} type="button">
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
            </button>
            <button className={styles.secondary} type="button">
              Call dispatch
            </button>
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
