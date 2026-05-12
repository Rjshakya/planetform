import { Hero } from "../components/marketing/hero";
import { Nav } from "../components/marketing/nav";
import { Features } from "../components/marketing/features";
import { Testimonials } from "../components/marketing/testimonials";
import { CTA } from "../components/marketing/cta";
import { Footer } from "../components/marketing/footer";
import { EditorShowCase } from "@/components/marketing/editor-showcase";

export default function Landing() {
  return (
    <>
      <main className="w-full">
        {/* Content wrapper - sticky above footer */}
        <div className="relative z-10 bg-background">
          <div className="mx-0">
            <div className="mx-auto grid pt-4  relative bg-background">
              <Nav />
              <Hero />
              <EditorShowCase />
              <Features />
              <Testimonials />
              <CTA />
            </div>
          </div>
        </div>
        {/* Footer - reveals as content scrolls past */}
        <Footer />
      </main>
    </>
  );
}
