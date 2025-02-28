
import { useState, createContext, useContext } from "react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Heart, Sparkles, Star } from "lucide-react";

export const LanguageContext = createContext({ language: "en", setLanguage: (lang: string) => {} });

const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "hi", name: "हिंदी", flag: "🇮🇳" }
];

export const Footer = () => {
  const [currentLang, setCurrentLang] = useState(languages[0]);

  return (
    <footer className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-600 to-purple-700 opacity-95" />
      
      <div className="container px-4 mx-auto py-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-white">
          <div>
            <h3 className="text-2xl font-bold flex items-center gap-2 mb-6">
              <Star className="w-6 h-6 text-yellow-300 animate-pulse" />
              MailScheduler
            </h3>
            <p className="text-white/80 mb-6">
              Revolutionizing email scheduling with AI-powered intelligence. Coming soon to transform your email workflow!
            </p>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10 text-white">
                <Facebook className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10 text-white">
                <Twitter className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10 text-white">
                <Instagram className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10 text-white">
                <Linkedin className="w-5 h-5" />
              </Button>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-300" />
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li>
                <button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} 
                  className="text-white/80 hover:text-white transition-colors hover:translate-x-1 transform inline-flex items-center gap-2">
                  Features
                </button>
              </li>
              <li>
                <button onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-white/80 hover:text-white transition-colors hover:translate-x-1 transform inline-flex items-center gap-2">
                  How It Works
                </button>
              </li>
              <li>
                <button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-white/80 hover:text-white transition-colors hover:translate-x-1 transform inline-flex items-center gap-2">
                  Contact
                </button>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink-400" />
              Contact Info
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-white/80 hover:text-white transition-colors group">
                <Mail className="w-5 h-5 group-hover:text-blue-300 transition-colors" />
                <span>help.mailscheduler@gmail.com</span>
              </li>
              <li className="flex items-center gap-3 text-white/80 hover:text-white transition-colors group">
                <Phone className="w-5 h-5 group-hover:text-blue-300 transition-colors" />
                <span>+91 6200542180</span>
              </li>
              <li className="flex items-center gap-3 text-white/80 hover:text-white transition-colors group">
                <MapPin className="w-5 h-5 group-hover:text-blue-300 transition-colors" />
                <span>Chennai, Tamil Nadu</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-green-300" />
              Language
            </h4>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <span>{currentLang.flag}</span>
                  <span>{currentLang.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => setCurrentLang(lang)}
                    className="cursor-pointer"
                  >
                    <span className="mr-2">{lang.flag}</span>
                    {lang.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-12 pt-8">
          <p className="text-center text-white/60">
            © {new Date().getFullYear()} MailScheduler. Made with 
            <Heart className="w-4 h-4 inline-block mx-1 text-red-400" /> 
            for better email management.
          </p>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-400/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-purple-400/20 to-transparent rounded-full blur-3xl" />
      </div>
    </footer>
  );
};
