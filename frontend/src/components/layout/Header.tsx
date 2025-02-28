
import { Link } from "react-router-dom";
import { AuthModal } from "@/components/auth/AuthModal";
import { Button } from "@/components/ui/button";
import { Home, Lightbulb, Workflow, PhoneCall } from "lucide-react";

export const Header = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-500 to-blue-400 bg-clip-text text-transparent hover:scale-105 transition-transform">
            MailScheduler
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => scrollToSection("home")} 
              className="text-sm hover:text-primary transition-colors flex items-center gap-2 group"
            >
              <Home className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              <span>Home</span>
            </button>
            <button 
              onClick={() => scrollToSection("features")} 
              className="text-sm hover:text-primary transition-colors flex items-center gap-2 group"
            >
              <Lightbulb className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              <span>Features</span>
            </button>
            <button 
              onClick={() => scrollToSection("how-it-works")} 
              className="text-sm hover:text-primary transition-colors flex items-center gap-2 group"
            >
              <Workflow className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              <span>How It Works</span>
            </button>
            <button 
              onClick={() => scrollToSection("contact")} 
              className="text-sm hover:text-primary transition-colors flex items-center gap-2 group"
            >
              <PhoneCall className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              <span>Contact</span>
            </button>
          </nav>
          <AuthModal />
        </div>
      </div>
    </header>
  );
};
