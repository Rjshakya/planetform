/**
 * this is a common tabs menu
 * for each four tabs this common top menu bar.
 */
import { Button } from "../ui/button";
import { ArrowLeft, Ellipsis, MoveUpRight } from "lucide-react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { toast } from "sonner";

const clientUrl = import.meta.env.VITE_CLIENT_URL;
export const CommonMenu = () => {
  const { formId } = useParams();
  const [searchParams] = useSearchParams();
  const workspaceId = searchParams.get("workspace");
  const formName = searchParams.get("name");

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success("copied");
  }

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between">
        <Link
          target="_blank"
          to={`${clientUrl}/${formId}`}
          className=" select-none flex items-center gap-2 cursor-pointer"
        >
          <h3 className=" capitalize ">{formName || "form"}</h3>
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger render={
            <Button variant={"ghost"} size={"icon-sm"}>
              <Ellipsis />
            </Button>
          } />

          <DropdownMenuContent className={"p-1"}>
            <DropdownMenuItem className={""}>
              <Link
                className="flex items-center gap-2 w-full"
                to={`/${formId}/edit?name=${formName}&workspace=${workspaceId}`}
              >
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className=" size-5 fill-foreground"
                    viewBox="0 0 24 24"
                  >
                    <g clip-path="url(#clip0_4418_4832)">
                      <path
                        opacity="0.4"
                        d="M15.48 3H7.52C4.07 3 2 5.06 2 8.52V16.47C2 19.94 4.07 22 7.52 22H15.47C18.93 22 20.99 19.94 20.99 16.48V8.52C21 5.06 18.93 3 15.48 3Z"
                        fill="white"
                        style={{ fill: "var(--fillg)" }}
                      />
                      <path
                        d="M21.02 2.98028C19.23 1.18028 17.48 1.14028 15.64 2.98028L14.51 4.10028C14.41 4.20028 14.38 4.34028 14.42 4.47028C15.12 6.92028 17.08 8.88028 19.53 9.58028C19.56 9.59028 19.61 9.59028 19.64 9.59028C19.74 9.59028 19.84 9.55028 19.91 9.48028L21.02 8.36028C21.93 7.45028 22.38 6.58028 22.38 5.69028C22.38 4.79028 21.93 3.90028 21.02 2.98028Z"
                        fill="white"
                        style={{ fill: "var(--fillg)" }}
                      />
                      <path
                        d="M17.8601 10.4198C17.5901 10.2898 17.3301 10.1598 17.0901 10.0098C16.8901 9.88984 16.6901 9.75984 16.5001 9.61984C16.3401 9.51984 16.1601 9.36984 15.9801 9.21984C15.9601 9.20984 15.9001 9.15984 15.8201 9.07984C15.5101 8.82984 15.1801 8.48984 14.8701 8.11984C14.8501 8.09984 14.7901 8.03984 14.7401 7.94984C14.6401 7.83984 14.4901 7.64984 14.3601 7.43984C14.2501 7.29984 14.1201 7.09984 14.0001 6.88984C13.8501 6.63984 13.7201 6.38984 13.6001 6.12984C13.4701 5.84984 13.3701 5.58984 13.2801 5.33984L7.9001 10.7198C7.5501 11.0698 7.2101 11.7298 7.1401 12.2198L6.7101 15.1998C6.6201 15.8298 6.7901 16.4198 7.1801 16.8098C7.5101 17.1398 7.9601 17.3098 8.4601 17.3098C8.5701 17.3098 8.6801 17.2998 8.7901 17.2898L11.7601 16.8698C12.2501 16.7998 12.9101 16.4698 13.2601 16.1098L18.6401 10.7298C18.3901 10.6498 18.1401 10.5398 17.8601 10.4198Z"
                        fill="white"
                        style={{ fill: "var(--fillg)" }}
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_4418_4832">
                        <rect
                          width="24"
                          height="24"
                          fill="white"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                </span>
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                handleCopy(`${clientUrl}/${formId}`);
              }}
            >
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-5 fill-foreground"
                  viewBox="0 0 24 24"
                >
                  <g clip-path="url(#clip0_4418_4699)">
                    <path
                      d="M16 12.9V17.1C16 20.6 14.6 22 11.1 22H6.9C3.4 22 2 20.6 2 17.1V12.9C2 9.4 3.4 8 6.9 8H11.1C14.6 8 16 9.4 16 12.9Z"
                      fill="white"
                      style={{ fill: "var(--fillg)" }}
                    />
                    <path
                      opacity="0.4"
                      d="M17.0998 2H12.8998C9.44976 2 8.04977 3.37 8.00977 6.75H11.0998C15.2998 6.75 17.2498 8.7 17.2498 12.9V15.99C20.6298 15.95 21.9998 14.55 21.9998 11.1V6.9C21.9998 3.4 20.5998 2 17.0998 2Z"
                      fill="white"
                      style={{ fill: "var(--fillg)" }}
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_4418_4699">
                      <rect
                        width="24"
                        height="24"
                        fill="white"
                      />
                    </clipPath>
                  </defs>
                </svg>
              </span>
              <p>Copy</p>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
