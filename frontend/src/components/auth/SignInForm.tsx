import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ArrowRight, Mail } from "lucide-react";

export const SignInForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  // State variables
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "signin",
        { email: formData.email, password: formData.password },
        { withCredentials: true }
      );
      
      if (response.data.user) {
        sessionStorage.setItem("userName", response.data.user.fullName);
        sessionStorage.setItem("userEmail", response.data.user.email);
        toast({ title: "Success", description: "Signed in successfully!" });
        onSuccess();
        navigate("/dashboard");
      } else {
        throw new Error("Invalid response structure");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Login failed",
        variant: "destructive",
      });
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.newPassword || formData.newPassword !== formData.confirmPassword) {
      toast({ title: "Invalid input", description: "Please fill all fields correctly.", variant: "destructive" });
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:5001/forgot-password", {
        email: formData.email,
        newPassword: formData.newPassword,
      });
      toast({ title: "Success", description: response.data.message });
      setIsForgotPassword(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Password reset failed",
        variant: "destructive",
      });
    }
  };

  if (isForgotPassword) {
    return (
      <div className="p-6 space-y-6">
        <h3 className="text-xl font-semibold mb-2">Reset Password</h3>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} />

        <Label htmlFor="newPassword">New Password</Label>
        <Input id="newPassword" type="password" placeholder="Enter new password" value={formData.newPassword} onChange={handleChange} />

        <Label htmlFor="confirmPassword">Confirm New Password</Label>
        <Input id="confirmPassword" type="password" placeholder="Confirm new password" value={formData.confirmPassword} onChange={handleChange} />

        <Button onClick={handleForgotPassword} className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
          Update Password <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
        <Button variant="link" className="w-full text-sm text-blue-600" onClick={() => setIsForgotPassword(false)}>
          Back to Sign In
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} />

      <Label htmlFor="password">Password</Label>
      <Input id="password" type="password" placeholder="Enter your password" value={formData.password} onChange={handleChange} />

      <Button variant="link" className="text-sm text-blue-600" onClick={() => setIsForgotPassword(true)}>
        Forgot password?
      </Button>

      <Button onClick={handleSubmit} className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
        Sign In <ArrowRight className="ml-2 w-4 h-4" />
      </Button>
    </div>
  );
};
