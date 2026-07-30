import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const SignIn = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex flex-col gap-6 mb-12 max-w-md mx-auto", className)}>
      <div className="flex flex-col items-center gap-5 px-2">
        <h1 className="text-3xl tracking-tight text-left w-full flex items-center gap-2">
          <p>Welcome</p>
          <span className="">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="size-8 fill-orange-500"
            >
              <g clipPath="url(#clip0_4418_8647)">
                <path
                  d="M16.19 2H7.81C4.17 2 2 4.17 2 7.81V16.18C2 19.83 4.17 22 7.81 22H16.18C19.82 22 21.99 19.83 21.99 16.19V7.81C22 4.17 19.83 2 16.19 2ZM6.47 7.72C6.76 7.43 7.24 7.43 7.53 7.72C8.24 8.43 9.4 8.43 10.11 7.72C10.4 7.43 10.88 7.43 11.17 7.72C11.46 8.01 11.46 8.49 11.17 8.78C10.52 9.43 9.67 9.75 8.82 9.75C7.97 9.75 7.12 9.43 6.47 8.78C6.18 8.48 6.18 8.01 6.47 7.72ZM12 18.78C9.31 18.78 7.12 16.59 7.12 13.9C7.12 13.2 7.69 12.62 8.39 12.62H15.59C16.29 12.62 16.86 13.19 16.86 13.9C16.88 16.59 14.69 18.78 12 18.78ZM17.53 8.78C16.88 9.43 16.03 9.75 15.18 9.75C14.33 9.75 13.48 9.43 12.83 8.78C12.54 8.49 12.54 8.01 12.83 7.72C13.12 7.43 13.6 7.43 13.89 7.72C14.6 8.43 15.76 8.43 16.47 7.72C16.76 7.43 17.24 7.43 17.53 7.72C17.82 8.01 17.82 8.48 17.53 8.78Z"
                  fill="white"
                  style={{ fill: "var(--fillg)" }}
                />
              </g>
              <defs>
                <clipPath id="clip0_4418_8647">
                  <rect width="24" height="24" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </span>
        </h1>
        <p className=" text-muted-foreground tracking-tight w-full mx-0 sm:pr-12 ">
          Create forms , that can reach directly to your inbox , slack , notion.
        </p>
      </div>
      <div className="grid gap-2 px-2 mt-2">
        <Button
          variant={"default"}
          size={"icon"}
          className=" w-full h-11 flex items-center gap-2"
          onClick={signIn}
        >
          <span>
            <svg
              role=""
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="100"
              height="100"
              viewBox="0 0 48 48"
            >
              <path
                fill="#FFC107"
                d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
              />
              <path
                fill="#FF3D00"
                d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
              />
              <path
                fill="#4CAF50"
                d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
              />
              <path
                fill="#1976D2"
                d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
              />
            </svg>
          </span>
          <p>Continue with Google</p>
        </Button>
      </div>
    </div>
  );
};

export default SignIn;
