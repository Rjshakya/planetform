import { Logo } from "@/components/common/Logo";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const Nav = () => {
  return (
    <nav className="w-full bg-background px-4 border-b py-2 fixed top-0 inset-x-0 z-50">
      <div className="w-full flex items-center justify-between max-w-4xl mx-auto">
        <div className="logo">
          <Logo />
        </div>
        <div className="flex items-center gap-2">
          <Link to={"/"}>
            <Button className=" " variant={"ghost"}>
              Pricing
            </Button>
          </Link>

          {/* sign-in  */}

          <Link to={"/auth"}>
            <Button variant={"secondary"}>Sign In</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};
