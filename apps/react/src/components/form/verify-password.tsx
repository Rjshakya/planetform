import { Loader, Lock } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFormPasswordAuth } from "@/hooks/use-form-password-auth";

export const VerifyPasswordPage = () => {
  const { formId } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const { verifyPassword, isVerifying } = useFormPasswordAuth(formId!);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password.trim()) {
      toast.error("Please enter a password");
      return;
    }

    const success = await verifyPassword(password);

    if (success) {
      toast.success("Access granted");
      navigate(`/${formId}`, { replace: true });
    } else {
      toast.error("Invalid password");
    }
  };

  return (
    <div className="min-h-dvh w-full flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-lg border shadow-sm">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Password Protected Form
          </h1>
          <p className="text-muted-foreground text-sm">
            This form is protected. Please enter the password to continue.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isVerifying}
            className="h-11"
          />

          <Button type="submit" className="w-full h-11" disabled={isVerifying}>
            {isVerifying ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Verifying...
              </>
            ) : (
              "Access Form"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};
