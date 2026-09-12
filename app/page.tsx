import Reveal from "./components/reveal";
import ScrollStage from "./components/scroll-stage";
import SiteHeader from "./components/site-header";
import { Contact, Services, SiteFooter, WhyUs } from "./components/sections";

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#services">
        Skip to content
      </a>

      <SiteHeader />

      <main id="main">
        <ScrollStage />
        <Services />
        <WhyUs />
        <Contact />
      </main>

      <SiteFooter />
      <Reveal />
    </>
  );
}
