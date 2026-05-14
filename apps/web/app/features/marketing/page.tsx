import { Hero } from "./hero";
import { Nav } from "./nav";
import { Features } from "./features";
import { Testimonials } from "./testimonials";
import { CTA } from "./cta";
import { Footer } from "./footer";
import { EditorShowCase } from "./editor-showcase";

export default function MarketingPage() {
  return (
    <>
      <main className="w-full">
        <div className="relative z-10 bg-background">
          <div className="mx-0">
            <div className="mx-auto grid pt-4 relative bg-background">
              <Nav />
              <Hero />
              <EditorShowCase />
              <Features />
              <Testimonials />
              <CTA />
            </div>
          </div>
        </div>
        <Footer />
      </main>
    </>
  );
}
