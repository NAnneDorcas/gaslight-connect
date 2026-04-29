import { SiteHeader } from "@/components/SiteHeader";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Offer } from "@/components/Offer";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { SeoHead } from "@/components/SeoHead";

const Index = () => (
  <>
    <SeoHead />
    <SiteHeader />
    <main>
      <Hero />
      <About />
      <Offer />
      <Contact />
    </main>
    <Footer />
  </>
);

export default Index;
