import { AuthModal } from "@/components/auth/AuthModal";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Features } from "@/components/sections/Features";
import { AIBoat } from "@/components/AIBoat";
import { Mail } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const Index = () => {
  const formRef = useRef<HTMLFormElement>(null); // Create a ref for the form element

  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error" | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (responseMessage && messageType === "success") {
      const timer = setTimeout(() => {
        setResponseMessage(null);
        setMessageType(null);
      }, 5000); // Clear message after 5 seconds

      return () => clearTimeout(timer); // Cleanup the timer if the component unmounts or the message changes
    }
  }, [responseMessage, messageType]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setResponseMessage(null);

    const name = (document.getElementById("name") as HTMLInputElement)?.value;
    const email = (document.getElementById("email") as HTMLInputElement)?.value;
    const message = (document.getElementById("message") as HTMLTextAreaElement)?.value;

    try {
      const res = await fetch("/submit_contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      const text = await res.text();
      console.log("Response Text:", text); // Log the response text for debugging
      let data: any = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch (jsonError) {
        console.error("Error parsing JSON:", jsonError);
        setResponseMessage("Invalid response from server.");
        setMessageType("error");
        return;
      }

      if (!res.ok || data.error) {
        setResponseMessage(data.error || "Failed to send message. Please try again.");
        setMessageType("error");
      } else {
        setResponseMessage(data.message || "Message sent successfully!");
        setMessageType("success");
        formRef.current?.reset(); // Reset the form using the ref
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setResponseMessage("Failed to send message. Please try again.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:py-32 overflow-hidden" id="home">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 via-blue-100/30 to-transparent" />
        <div className="container px-4 mx-auto relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center px-4 py-2 mb-8 border rounded-full gap-2 animate-fade-in bg-white/50 backdrop-blur-sm">
              <span className="text-sm font-medium">Email automation made simple</span>
            </div>
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-8 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent animate-fade-in"
              style={{ animationDelay: "150ms" }}
            >
              Schedule and automate your emails with ease
            </h1>
            <p
              className="text-xl text-muted-foreground mb-12 animate-fade-in"
              style={{ animationDelay: "300ms" }}
            >
              Take control of your email scheduling with our powerful AI-driven platform
            </p>
            <div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in"
              style={{ animationDelay: "450ms" }}
            >
              <AuthModal />
              <Button variant="outline" className="rounded-full px-6">
                Learn More
              </Button>
            </div>
          </div>
        </div>
        {/* Abstract Background */}
        <div className="absolute inset-0 -z-10 h-full w-full bg-white">
          <div className="absolute h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
        </div>
      </section>

      {/* Features Section */}
      <Features />

      {/* How It Works Section */}
      <HowItWorks />

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-gradient-to-b from-blue-50/50 via-blue-100/30 to-transparent">
        <div className="container px-4 mx-auto">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              Get In Touch
            </h2>
            <p className="text-muted-foreground">
              Have questions? We'd love to hear from you. Send us a message and we'll get back to you shortly.
            </p>
          </div>
          <div className="max-w-lg mx-auto">
            <form ref={formRef} className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your name"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your email"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your message"
                />
              </div>
              <Button className="w-full" disabled={loading}>
                {loading ? "........" : "Send Message"}
              </Button>
            </form>
            {responseMessage && (
              <div
                className={`mt-4 p-3 rounded-lg text-center ${
                  messageType === "success"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {responseMessage}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* AI Boat */}
      <AIBoat />
    </div>
  );
};

export default Index;
