import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <header className="fixed top-0 right-0 left-64 h-16 bg-background border-b border-border z-40">
      <div className="h-full px-6 flex items-center justify-between">
        <div className="flex-1" />
        <div className="flex items-center justify-center flex-1">
          <h1 className="text-2xl font-bold">Email Dashboard</h1>
        </div>
        <div className="flex items-center justify-end flex-1">
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
