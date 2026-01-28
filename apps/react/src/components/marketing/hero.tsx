"use client";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FormEditor } from "../tiptap/editor";
import { useForm } from "react-hook-form";
import { useFormStore } from "@/stores/useformStore";
import { useEffect } from "react";

export const Hero = () => {
  const hookForm = useForm();
  const { getHookForm } = useFormStore((s) => s);

  useEffect(() => {
    if (!getHookForm()) {
      useFormStore.setState({ form: hookForm });
    }
  }, [getHookForm, hookForm]);
  return (
    <section
      id="hero"
      className="w-full relative overflow-hidden pt-36 sm:pt-50 text-black min-h-dvh"
    >
      {/* Main text block */}
      <div className={`px-2 max-w-4xl mx-auto `}>
        <h1 className="landing-heading mb-4 text-balance  ">
          Make forms your users actually love to fill .
        </h1>

        {/* Subheading */}
        <p className="landing-sub-heading  mb-8 text-pretty font-medium">
          Create stunning, with our powerful notion-like editor. Collect
          submissions, insights, and integrate with your favorite tools—all in
          one place.
        </p>

        {/* CTA */}

        <Link to={"/auth"}>
          <Button variant={"secondary"} size={"lg"} className="b">
            Create your form for free
          </Button>
        </Link>

        <div className=" absolute w-full h-full inset-0 -z-10">
          <img
            className="size-full object-cover  object-bottom"
            src={"/Frame@2x.png"}
          />
        </div>
      </div>
    </section>
  );
};
