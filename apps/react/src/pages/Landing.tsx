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
      <main className="w-full px-3">
        <div className=" mx-auto grid pt-4 border-x relative">
          <Nav />
          <Hero />
          <EditorShowCase/>
          <Features />
          <Testimonials />
          <CTA />
        </div>
      </main>
      <Footer />
    </>
  );
}
