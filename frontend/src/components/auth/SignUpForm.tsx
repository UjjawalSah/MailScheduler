import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export const SignUpForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [signUpLoading, setSignUpLoading] = useState(false);

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Updated regex to include '#' in the set of allowed special characters.
  const isValidPassword = (password: string) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/.test(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast({ title: "Error", description: "All fields are required." });
      return;
    }
    if (!emailVerified) {
      toast({ title: "Error", description: "Please verify your email first." });
      return;
    }
    if (!isValidPassword(password)) {
      toast({
        title: "Weak Password",
        description: "Password must be 8+ characters long, include uppercase, lowercase, number, and special character."
      });
      return;
    }

    try {
      setSignUpLoading(true);
      const response = await fetch("signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });
      const data = await response.json();
      if (data.success) {
        toast({ title: "Signup Successful", description: "Now please sign in." });
        onSuccess(); // This callback should handle navigation to SignInForm.tsx.
      } else {
        toast({ title: "Signup Error", description: data.error || "Signup failed." });
      }
    } catch (error) {
      toast({ title: "Error", description: "An error occurred during signup." });
    } finally {
      setSignUpLoading(false);
    }
  };

  const handleGetOtp = async () => {
    if (!name || !email || !isValidEmail(email)) {
      toast({ title: "OTP Error", description: "Enter a valid name and email." });
      return;
    }
    setOtpLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:5001/send_otp_email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email })
      });
      const data = await response.json();
      if (data.success) {
        toast({ title: "OTP Sent", description: "Check your email for the OTP." });
        setOtpSent(true);
      } else {
        toast({ title: "OTP Error", description: data.error || "Failed to send OTP." });
      }
    } catch {
      toast({ title: "Error", description: "OTP request failed." });
    }
    setOtpLoading(false);
  };

  const handleVerifyEmail = async () => {
    if (!email || !otp) {
      toast({ title: "Verification Error", description: "Email and OTP are required." });
      return;
    }
    try {
      const response = await fetch("http://127.0.0.1:5001/verify_otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp })
      });
      const data = await response.json();
      if (data.success) {
        toast({ title: "Email Verified", description: "You can now set your password." });
        setEmailVerified(true);
      } else {
        toast({ title: "Verification Error", description: data.error || "OTP verification failed." });
      }
    } catch {
      toast({ title: "Error", description: "OTP verification failed." });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input 
              id="name" 
              placeholder="Enter your name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">
              Email {emailVerified && <span className="text-green-600">(Verified)</span>}
            </Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="Enter your email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              disabled={emailVerified} 
            />
            <div className="flex items-center space-x-2 mt-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleGetOtp} 
                disabled={emailVerified || otpLoading || otpSent}
              >
                {otpLoading ? "Sending..." : (otpSent ? "OTP Sent" : "Get OTP")}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleVerifyEmail} 
                disabled={emailVerified}
              >
                {emailVerified ? "Verified" : "Verify OTP"}
              </Button>
            </div>
            {!emailVerified && (
              <Input 
                id="otp" 
                type="text" 
                placeholder="Enter OTP" 
                className="mt-2" 
                value={otp} 
                onChange={(e) => setOtp(e.target.value)} 
              />
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password" 
              placeholder="Create a password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              disabled={!emailVerified} 
            />
          </div>
        </div>
        <div className="space-y-4 mt-4">
          <Button 
            type="submit" 
            className={`w-full ${signUpLoading ? "animate-pulse" : ""}`} 
            disabled={signUpLoading}
          >
            {signUpLoading ? "Signing Up..." : "Sign Up"}
          </Button>
        </div>
      </form>
    </div>
  );
};
