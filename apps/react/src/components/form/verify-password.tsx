import { Loader, Lock } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFormPasswordAuth } from "@/hooks/use-form-password-auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "../ui/card";

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
    <div className="min-h-dvh w-full flex items-center justify-center bg-background px-2 sm:px-0">
      <div className="bg-destructive dark:bg-red-700 p-1 rounded-md border ring-2 ring-destructive/20">
        <p className=" font-semibold mb-1 p-1 text-sm text-white">
          Password Protected Form
        </p>
        <Card className="bg-background ">
          <CardHeader className="text-center space-y-2">
            {/* <CardTitle className="text-left">Password Protected Form</CardTitle> */}
            <CardDescription className="text-left">
              This form is protected. Please enter the password to continue.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-1">
              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isVerifying}
                className=""
              />

              <Button type="submit" className="w-full" disabled={isVerifying}>
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
