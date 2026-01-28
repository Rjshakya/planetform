import { Logo } from "@/components/common/Logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="w-full border-t bg-background">
      <div className="px-4 sm:px-6 lg:px-8 pt-12 max-w-4xl mx-auto">
        <div className="h-12 w-full" />

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8 ">
          <div className="md:col-span-2 space-y-4">
            <Logo className="  justify-start" />
            <p className="text-xs text-muted-foreground max-w-xs text-balance">
              Build beautiful, modern forms with an intuitive block-based
              editor. Simple to build, powerful to analyze.
            </p>
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Planetform. All rights reserved.
            </p>
          </div>

          <div>
            <div className="text-xs font-medium mb-4">Product</div>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link
                  to="#features"
                  className="hover:text-foreground transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  to="/pricing"
                  className="hover:text-foreground transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="hover:text-foreground transition-colors"
                >
                  Templates
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <div className="text-xs font-medium mb-4">Company</div>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link
                  to="/"
                  className="hover:text-foreground transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="hover:text-foreground transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/roadmap"
                  className="hover:text-foreground transition-colors"
                >
                  Roadmap
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <div className="text-xs font-medium mb-4">Legal</div>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link
                  to="/terms"
                  className="hover:text-foreground transition-colors"
                >
                  Terms of service
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="hover:text-foreground transition-colors"
                >
                  Privacy policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-row items-start sm:items-center justify-between gap-4 pb-4">
          <div className="flex items-center gap-4 ">
            <Link
              to="/"
              className="hover:text-foreground transition-colors text-xs"
            >
              Status
            </Link>
          </div>

          <Link
            className="hover:text-foreground transition-colors text-xs"
            to="/auth"
          >
            Get started
          </Link>
        </div>

        <div className="select-none mt-4 h-full w-full flex items-end justify-center px-6 md:px-0">
          <div className="flex gap-4 items-center">
            <div>
              <svg
                role="logo"
                className={cn(`sm:size-24 size-9 fill-foreground`)}
                viewBox="0 0 200 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_2002_2668)">
                  <path
                    d="M27 199.999C9.66626 172.698 3.8147e-06 137.062 0 99.9993C0 62.9366 9.66625 27.3006 27 0V199.999Z"
                    fill="white"
                    style={{ fill: "var(--fillg)" }}
                  />
                  <path
                    d="M200 200C173.478 200 148.043 189.464 129.289 170.711C110.536 151.957 100 126.522 100 100C100 73.4784 110.536 48.043 129.289 29.2893C148.043 10.5357 173.478 9.5351e-06 200 4.37114e-06L200 200Z"
                    fill="white"
                    style={{ fill: "var(--fillg)" }}
                  />
                  <path
                    d="M60.2893 175.485C70.5101 186.396 82.7156 194.701 96 200V0C82.7156 5.2988 70.5101 13.6039 60.2893 24.5148C41.5357 44.5347 31 71.6875 31 99.9998C31 128.312 41.5357 155.465 60.2893 175.485Z"
                    fill="white"
                    style={{ fill: "var(--fillg)" }}
                  />
                </g>
                <defs>
                  <clipPath id="clip0_2002_2668">
                    <rect width="200" height="200" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>
            <p className="text-5xl sm:text-[120px] text-center tracking-tighter font-bold">
              PLANETFORM
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
