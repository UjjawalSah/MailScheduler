
import { Button } from "@/components/ui/button";
import { Calendar, Settings, Zap, BarChart } from "lucide-react";

const steps = [
  {
    icon: Settings,
    title: "Setup",
    description: "Configure your email settings and preferences in minutes.",
  },
  {
    icon: Calendar,
    title: "Schedule",
    description: "Plan and schedule your emails with our intuitive interface.",
  },
  {
    icon: Zap,
    title: "Automate",
    description: "Let our AI handle your email scheduling automatically.",
  },
  {
    icon: BarChart,
    title: "Track",
    description: "Monitor your email performance with detailed analytics.",
  },
];

export const HowItWorks = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-transparent via-blue-50/30 to-blue-100/50">
      <div className="container px-4 mx-auto">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight mb-4 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            How It Works
          </h2>
          <p className="text-muted-foreground">
            Follow these simple steps to streamline your email scheduling
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="group relative bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-colors p-6 rounded-lg border hover:border-primary/50 animate-fade-in"
              style={{
                animationDelay: `${index * 150}ms`,
              }}
            >
              <div className="mb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors">
                  <step.icon className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
