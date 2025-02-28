import { Card } from "@/components-dashboard/ui/card";
import { Mail, User } from "lucide-react";
import { useState, useEffect } from "react";

const Profile = () => {
  const [profile, setProfile] = useState<{ fullName: string; email: string } | null>(null);

  useEffect(() => {
    // Retrieve user details from sessionStorage
    const name = sessionStorage.getItem("userName");
    const email = sessionStorage.getItem("userEmail");

    if (name && email) {
      setProfile({ fullName: name, email: email });
    }
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  if (!profile) {
    return <div>Loading...</div>; // Shows a loading state if profile is not available
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-bold text-primary">Profile</h1>
        <p className="text-secondary-foreground">Your account information</p>
      </header>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <User className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Full Name</p>
              <p className="font-medium">{profile?.fullName || "N/A"}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{profile?.email || "N/A"}</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Profile;
