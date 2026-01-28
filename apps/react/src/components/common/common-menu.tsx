/**
 * this is a common tabs menu
 * for each four tabs this common top menu bar.
 */
import { Button } from "../ui/button";
import { ArrowLeft, MoveUpRight } from "lucide-react";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const clientUrl = import.meta.env.VITE_CLIENT_URL;
export const CommonMenu = () => {
  const { formId } = useParams();
  const [searchParams] = useSearchParams();
  const workspace = searchParams.get("workspace");
  const formName = searchParams.get("name");
  const navigate = useNavigate();

  return (
    <div className="">
      <div className="mb-8">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant={"default"} size={"icon-sm"}>
                <ArrowLeft />
              </Button>
            }
          />
          <DropdownMenuContent align="start" className={"w-fit mt-2 p-1"}>
            <DropdownMenuItem className={'p-1'}
              onClick={() => navigate(`/dashboard/${workspace}`)}
            >
              <Button className={""} variant={"ghost"} size={"icon-xs"}>
                <ArrowLeft />
              </Button>
              <p>Workspace</p>
            </DropdownMenuItem>

            <DropdownMenuItem className={'p-1'} onClick={() => navigate(`/dashboard`)}>
              <Button className={""} variant={"ghost"} size={"icon-xs"}>
                <ArrowLeft />
              </Button>
              <p>Dashboard</p>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Link
        target="_blank"
        to={`${clientUrl}/${formId}`}
        className=" select-none flex items-center gap-1.5 mb-4 text-muted-foreground hover:text-primary hover:scale-99 group transition-all duration-300 ease-in-out cursor-pointer"
      >
        <h3 className=" capitalize">{formName || "form"}</h3>
        <span className="block text-muted-foreground group-hover:text-primary ">
          <MoveUpRight size={14} />
        </span>
      </Link>
    </div>
  );
};
