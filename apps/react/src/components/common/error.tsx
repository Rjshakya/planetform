export const ErrorScreen = ({ message }: { message?: string }) => {
  return (
    <div className="w-full h-dvh flex items-center justify-center">
      <div className="size-full">
        <span className="text-destructive">{message || "Error , sorry"}</span>
      </div>
    </div>
  );
};
