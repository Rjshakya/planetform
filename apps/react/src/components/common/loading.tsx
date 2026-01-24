import { Loader } from "lucide-react";

export const LoadingComponent = ({
  isLoading,
  screenH,
}: { isLoading: boolean; screenH: boolean }) => {
  if (isLoading) {
    return (
      <div
        className={`w-full grid place-content-center ${screenH ? "h-dvh" : ""}`}
      >
        <Loader className="animate-spin" />
      </div>
    );
  }
};
