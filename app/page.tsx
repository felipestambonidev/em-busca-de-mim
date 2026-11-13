import SiteHeader from "@/components/SiteHeader";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Method from "@/components/Method";
import Format from "@/components/Format";
import Mentor from "@/components/Mentor";
import Closing from "@/components/Closing";
import SpotifyPlayer from "@/components/SpotifyPlayer";

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
        <Method />
        <Format />
        <Mentor />
        <Closing />
      </main>
      <SpotifyPlayer />
    </>
  );
}
