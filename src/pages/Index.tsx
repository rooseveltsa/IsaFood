
import { Hero } from "@/components/Hero";
import { Kits } from "@/components/Kits";
import { MenuDigital } from "@/components/MenuDigital";
import { Testimonials } from "@/components/Testimonials";
import { FAQ } from "@/components/FAQ";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BackToTop } from "@/components/BackToTop";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <Kits />
      <Testimonials />
      <section id="menu">
        <MenuDigital />
      </section>
      <FAQ />
      <Footer />
      <WhatsAppButton />
      <BackToTop />
    </div>
  );
};

export default Index;
