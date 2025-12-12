"use client";
import { FormEditor } from "@/app/dashboard/[workspaceId]/form/_components/FormEditor";
import { Button } from "@/components/ui/button";
import { useFormStore } from "@/stores/useformStore";
import { useLandingStore } from "@/stores/useLandingStore";
import Link from "next/link";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export const Hero = () => {
  const { landingEditorContent } = useLandingStore((s) => s);
  const form = useForm();
  useEffect(() => {
    // Initialize form store for demo
    useFormStore.setState({
      form,
      activeStep: 0,
      maxStep: 0,
      isLastStep: true,
      isSingleForm: true,
    });
  }, [form]);
  return (
    <section id="hero" className="w-full relative overflow-hidden py-36 px-4">
      <div className="grid gap-32">
        <div className=" space-y-8 py-2">
          {/* Main headline */}
          <h1 className="max-w-lg text-4xl sm:text-5xl font-bold tracking-tight text-left">
            Make
            <Button className="sm:mx-2 mx-1" variant={"ghost"} size={"icon"}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-6 sm:size-8 fill-emerald-400"
                viewBox="0 0 24 24"
                fill="#fff"
              >
                <g clipPath="url(#clip0_4418_8497)">
                  <path
                    d="M20.5 10.19H17.61C15.24 10.19 13.31 8.26 13.31 5.89V3C13.31 2.45 12.86 2 12.31 2H8.07C4.99 2 2.5 4 2.5 7.57V16.43C2.5 20 4.99 22 8.07 22H15.93C19.01 22 21.5 20 21.5 16.43V11.19C21.5 10.64 21.05 10.19 20.5 10.19Z"
                    fill="white"
                    style={{ fill: "var(--fillg)" }}
                  />
                  <path
                    d="M15.7999 2.21048C15.3899 1.80048 14.6799 2.08048 14.6799 2.65048V6.14048C14.6799 7.60048 15.9199 8.81048 17.4299 8.81048C18.3799 8.82048 19.6999 8.82048 20.8299 8.82048C21.3999 8.82048 21.6999 8.15048 21.2999 7.75048C19.8599 6.30048 17.2799 3.69048 15.7999 2.21048Z"
                    fill="white"
                    style={{ fill: "var(--fillg)" }}
                  />
                </g>
                <defs>
                  <clipPath id="clip0_4418_8497">
                    <rect width="24" height="24" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </Button>
            forms your{" "}
            <Button className="" variant={"ghost"} size={"icon"}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-6 sm:size-8 fill-primary"
                viewBox="0 0 24 24"
                fill="#fff"
              >
                <g clipPath="url(#clip0_3261_12972)">
                  <path
                    d="M9.25 1.27002C6.63 1.27002 4.5 3.40002 4.5 6.02002C4.5 8.64002 6.51 10.67 9.13 10.76C9.21 10.75 9.29 10.75 9.35 10.76H9.42C11.98 10.67 13.99 8.59002 14 6.02002C14 3.40002 11.87 1.27002 9.25 1.27002Z"
                    fill="white"
                    style={{ fill: "var(--fillg)" }}
                  />
                  <path
                    d="M20.24 6.61012C20.4 8.55012 19.02 10.2501 17.11 10.4801H17.06C17 10.4801 16.94 10.4801 16.89 10.5001C15.92 10.5501 15.03 10.2401 14.36 9.67012C15.39 8.75012 15.98 7.37012 15.86 5.87012C15.79 5.06012 15.51 4.32012 15.09 3.69012C15.47 3.50012 15.91 3.38012 16.36 3.34012C18.32 3.17012 20.07 4.63012 20.24 6.61012Z"
                    fill="white"
                    style={{ fill: "var(--fillg)" }}
                  />
                  <path
                    d="M22.24 15.8599C22.16 16.8299 21.54 17.6699 20.5 18.2399C19.5 18.7899 18.24 19.0499 16.99 19.0199C17.71 18.3699 18.13 17.5599 18.21 16.6999C18.31 15.4599 17.72 14.2699 16.54 13.3199C15.87 12.7899 15.09 12.3699 14.24 12.0599C16.45 11.4199 19.23 11.8499 20.94 13.2299C21.86 13.9699 22.33 14.8999 22.24 15.8599Z"
                    fill="white"
                    style={{ fill: "var(--fillg)" }}
                  />
                  <path
                    d="M14.33 13.4199C11.54 11.5599 6.99002 11.5599 4.18002 13.4199C2.91002 14.2699 2.21002 15.4199 2.21002 16.6499C2.21002 17.0399 2.29002 17.4099 2.42002 17.7799L2.68002 17.7099C3.19002 17.5599 3.56002 17.1899 3.70002 16.6899L3.96002 15.7399L4.02002 15.5699C4.21002 15.0699 4.69002 14.7399 5.24002 14.7399C5.80002 14.7399 6.25002 15.0799 6.44002 15.5799L6.75002 16.6999C6.88002 17.1999 7.27002 17.5799 7.76002 17.7199L8.92002 18.0499C9.42002 18.2599 9.72002 18.7299 9.72002 19.2799C9.72002 19.8625 9.3212 20.3564 8.77002 20.5299L7.78002 20.7999C7.59002 20.8499 7.42002 20.9499 7.27002 21.0599C7.92002 21.1799 8.58002 21.2699 9.25002 21.2699C11.09 21.2699 12.93 20.7999 14.33 19.8599C15.59 19.0099 16.29 17.8699 16.29 16.6299C16.28 15.3999 15.59 14.2599 14.33 13.4199Z"
                    fill="white"
                    style={{ fill: "var(--fillg)" }}
                  />
                  <path
                    d="M8.74 19.25C8.74 19.32 8.7 19.48 8.51 19.54L7.53 19.81C6.68 20.04 6.04 20.68 5.81 21.53L5.55 22.49C5.49 22.71 5.32 22.73 5.24 22.73C5.16 22.73 4.99 22.71 4.93 22.49L4.67 21.52C4.44 20.68 3.79 20.04 2.95 19.81L1.98 19.55C1.77 19.49 1.75 19.31 1.75 19.24C1.75 19.16 1.77 18.98 1.98 18.92L2.96 18.66C3.8 18.42 4.44 17.78 4.67 16.94L4.95 15.92C5.02 15.75 5.18 15.72 5.24 15.72C5.3 15.72 5.47 15.74 5.53 15.9L5.81 16.93C6.04 17.77 6.69 18.41 7.53 18.65L8.53 18.93C8.73 19.01 8.74 19.19 8.74 19.25Z"
                    fill="white"
                    style={{ fill: "var(--fillg)" }}
                  />
                </g>
                <defs>
                  <clipPath id="clip0_3261_12972">
                    <rect width="24" height="24" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </Button>{" "}
            users actually{" "}
            <Button variant={"ghost"} size={"icon"} className="">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className=" size-6 sm:size-8 fill-red-500 "
                viewBox="0 0 24 24"
                fill="#fff"
              >
                <g clipPath="url(#clip0_4418_8679)">
                  <path
                    d="M16.44 3.09961C14.63 3.09961 13.01 3.97961 12 5.32961C10.99 3.97961 9.37 3.09961 7.56 3.09961C4.49 3.09961 2 5.59961 2 8.68961C2 9.87961 2.19 10.9796 2.52 11.9996C4.1 16.9996 8.97 19.9896 11.38 20.8096C11.72 20.9296 12.28 20.9296 12.62 20.8096C15.03 19.9896 19.9 16.9996 21.48 11.9996C21.81 10.9796 22 9.87961 22 8.68961C22 5.59961 19.51 3.09961 16.44 3.09961Z"
                    fill="white"
                    style={{ fill: "var(--fillg)" }}
                  />
                </g>
                <defs>
                  <clipPath id="clip0_4418_8679">
                    <rect width="24" height="24" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </Button>{" "}
            love filling out.
          </h1>

          {/* Subheading */}
          <p className="max-w-lg text-left   text-muted-foreground text-balance">
            Create stunning, responsive forms with our powerful notion-like
            editor. Collect submissions, gain insights, and integrate with your
            favorite tools—all in one place.
          </p>

          {/* CTA Buttons */}
          <div className="flex items-center ">
            <Link href={"/auth"}>
              <Button size={"lg"} className="">
                Create your form for free
              </Button>
            </Link>
          </div>
        </div>
        {/* editor demo */}
        <div className="w-full">
          <span className="  p-2 text-sm  w-fit text-muted-foreground  flex items-center gap-2 mb-2 border ">
            play with editor
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className=" size-4 fill-foreground  "
                viewBox="0 0 24 24"
                fill="#fff"
              >
                <path
                  d="M12 21.2501C11.81 21.2501 11.62 21.1801 11.47 21.0301L5.4 14.9601C5.11 14.6701 5.11 14.1901 5.4 13.9001C5.69 13.6101 6.17 13.6101 6.46 13.9001L12 19.4401L17.54 13.9001C17.83 13.6101 18.31 13.6101 18.6 13.9001C18.89 14.1901 18.89 14.6701 18.6 14.9601L12.53 21.0301C12.38 21.1801 12.19 21.2501 12 21.2501Z"
                  fill="white"
                  style={{ fill: "var(--fillg)" }}
                />
                <path
                  d="M12 21.08C11.59 21.08 11.25 20.74 11.25 20.33V3.5C11.25 3.09 11.59 2.75 12 2.75C12.41 2.75 12.75 3.09 12.75 3.5V20.33C12.75 20.74 12.41 21.08 12 21.08Z"
                  fill="white"
                  style={{ fill: "var(--fillg)" }}
                />
              </svg>
            </span>
          </span>
          <div
            className="w-full h-[500px] relative border overflow-y-auto "
            style={{ scrollbarWidth: "none" }}
          >
            <FormEditor
              isEditable={true}
              content={landingEditorContent!}
              className=" "
            />
          </div>
        </div>
      </div>
    </section>
  );
};
