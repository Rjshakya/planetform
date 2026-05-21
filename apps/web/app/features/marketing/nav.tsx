import { Logo } from "@/components/common/Logo";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

export const Nav = () => {
  return (
    <nav className="w-full bg-background px-4 border-b py-2 fixed top-0 inset-x-0 z-50">
      <div className="w-full flex items-center justify-between ">
        <Link to={"/"} className="logo">
          <Logo />
        </Link>
        <div className="flex items-center gap-2">
          <Link to={"/pricing"}>
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
