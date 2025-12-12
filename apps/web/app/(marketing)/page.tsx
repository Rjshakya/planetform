import { Hero } from "./_components/hero";
import { Nav } from "./_components/nav";
import { Features } from "./_components/features";
import { Testimonials } from "./_components/testimonials";
import { CTA } from "./_components/cta";
import { Footer } from "./_components/footer";

export default function Landing() {
  return (
    <>
      <main className="w-full px-3">
        <div className="max-w-4xl mx-auto grid pt-4 border-x relative">
          <Nav />
          <Hero />
          <Features />
          <Testimonials />
          <CTA />
        </div>
      </main>
      <Footer />
    </>
  );
}
