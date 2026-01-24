import { Button } from "../ui/button";
import { AppWindow, MoveLeft, MoveUpRight } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Link, useParams, useSearchParams } from "react-router-dom";

const clientUrl = import.meta.env.VITE_CLIENT_URL
export const CommonMenu = () => {
  const { formId } = useParams()
  const [searchParams] = useSearchParams();
  const workspace = searchParams.get("workspace");
  const formName = searchParams.get("name");

  return (
    <div className="">
      <div className="mb-8">
        <Popover>
          <PopoverTrigger
            render={
              <Button variant={"secondary"} size={"icon-sm"}>
                <AppWindow />
              </Button>
            }
          />
          <PopoverContent align="start" className={"w-fit mt-2"}>
            <Link
              className="flex items-center gap-1 pr-3 text-muted-foreground hover:text-foreground "
              to={`/dashboard/${workspace}`}
            >
              <Button className={""} variant={"ghost"} size={"icon-xs"}>
                <MoveLeft />
              </Button>
              <p>workspace</p>
            </Link>

            <Link
              className="flex items-center gap-1 pr-3 text-muted-foreground hover:text-foreground"
              to={"/dashboard"}
            >
              <Button className={""} variant={"ghost"} size={"icon-xs"}>
                <MoveLeft />
              </Button>
              <p>dashboard</p>
            </Link>
          </PopoverContent>
        </Popover>
      </div>
      <Link target="_blank" to={`${clientUrl}/${formId}`} className=" select-none flex items-center gap-1.5 mb-4 text-muted-foreground hover:text-primary hover:scale-99 group transition-all duration-300 ease-in-out cursor-pointer">
        <h3 className=" capitalize">{formName || "form"}</h3>
        <span className="block text-muted-foreground group-hover:text-primary ">
          <MoveUpRight size={14} />
        </span>
      </Link>
    </div>
  );
};
