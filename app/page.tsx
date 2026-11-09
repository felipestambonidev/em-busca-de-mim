import SiteHeader from "@/components/SiteHeader";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Thread from "@/components/Thread";
import Journey from "@/components/Journey";
import Manifesto from "@/components/Manifesto";
import Waitlist from "@/components/Waitlist";
import SiteFooter from "@/components/SiteFooter";

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#lista">
        Pular para a inscrição
      </a>
      <SiteHeader />
      <main>
        <Hero />
        <About />
        <Thread />
        <Journey />
        <Manifesto />
        <Waitlist />
      </main>
      <SiteFooter />
    </>
  );
}
