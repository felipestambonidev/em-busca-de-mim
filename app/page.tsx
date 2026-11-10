import SiteHeader from "@/components/SiteHeader";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Closing from "@/components/Closing";

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#lista">
        Pular para o formulário
      </a>
      <SiteHeader />
      <main>
        <Hero />
        <About />
        <Closing />
      </main>
    </>
  );
}
