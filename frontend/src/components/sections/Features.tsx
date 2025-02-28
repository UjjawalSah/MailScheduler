
import { 
  Clock, Globe2, BarChart3, Shield, Users, Brain
} from "lucide-react";

const features = [
  {
    icon: Clock,
    title: "Smart Scheduling",
    description: "Schedule emails to be sent at the perfect time for maximum engagement."
  },
  {
    icon: Globe2,
    title: "Time Zone Intelligence",
    description: "Automatically adjust sending times across global time zones."
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Track open rates, click-through rates, and engagement metrics."
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-grade encryption and security for your email campaigns."
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Work together seamlessly with role-based permissions."
  },
  {
    icon: Brain,
    title: "AI-Powered",
    description: "Smart suggestions for optimal sending times and content."
  }
];

export const Features = () => {
  return (
    <section id="features" className="py-24 bg-gradient-to-b from-blue-50/50 via-blue-100/30 to-transparent">
      <div className="container px-4 mx-auto">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight mb-4 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            Powerful Features
          </h2>
          <p className="text-muted-foreground">
            Everything you need to supercharge your email outreach
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="relative group overflow-hidden rounded-lg border hover:border-primary/50 transition-colors p-6 bg-white/80 backdrop-blur-sm hover:bg-white/90 animate-fade-in"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <feature.icon className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold">{feature.title}</h3>
              </div>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
