import { useState } from "react";
import axios from "axios";
import { Bot, X, Send, MessageSquare, Sparkles, WandSparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

type Message = {
  type: "user" | "bot";
  content: string;
};

export const AIBoat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { type: "bot", content: "Hello! How can I help you today?" }
  ]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = input.trim();

    // Add user message and a bot placeholder
    setMessages((prev) => [
      ...prev,
      { type: "user", content: userMessage },
      { type: "bot", content: "..." } // You can add blinking animation via CSS
    ]);
    setInput("");

    try {
      console.log("Sending message to backend:", userMessage);
      const response = await axios.post(
        "generate",
        { input_text: userMessage },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      console.log("Response from backend:", response);
      const data = response.data;
      const botResponse = data.response || "Sorry, I couldn't process your request.";

      // Replace the placeholder ("...") with the actual bot response.
      setMessages((prev) => {
        const newMessages = [...prev];
        newMessages.pop(); // Remove the placeholder
        newMessages.push({ type: "bot", content: botResponse });
        return newMessages;
      });
    } catch (error: any) {
      console.error("Error fetching bot response:", error);
      if (error.response) {
        // The request was made and the server responded with a status code outside 2xx
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("Error request:", error.request);
      }
      // Replace the placeholder with an error message
      setMessages((prev) => {
        const newMessages = [...prev];
        newMessages.pop();
        newMessages.push({
          type: "bot",
          content: "An error occurred. Please try again."
        });
        return newMessages;
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {isOpen ? (
        <div className="bg-gradient-to-br from-white via-blue-50 to-white rounded-lg shadow-xl w-80 max-h-[500px] flex flex-col animate-fade-in border border-blue-100">
          <div className="p-4 border-b flex justify-between items-center bg-gradient-to-r from-blue-600/10 via-purple-500/10 to-blue-600/10 rounded-t-lg">
            <div className="flex items-center gap-2">
              <WandSparkles className="w-5 h-5 text-blue-600 animate-pulse" />
              <span className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">AI Assistant</span>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 hover:bg-white/50"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-blue-50/50 via-white to-blue-50/50">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg shadow-sm ${
                    message.type === "user"
                      ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white"
                      : "bg-gradient-to-r from-gray-50 to-white border border-blue-100"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t bg-gradient-to-b from-white to-blue-50">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80 backdrop-blur-sm"
              />
              <Button 
                onClick={handleSend}
                size="icon"
                className="h-10 w-10 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <Button
          onClick={() => setIsOpen(true)}
          size="icon"
          className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-110 bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-500 hover:to-blue-300 group"
        >
          <MessageSquare className="w-6 h-6 text-white group-hover:rotate-12 transition-transform" />
          <Sparkles className="w-4 h-4 text-white/80 absolute -top-1 -right-1 animate-pulse" />
        </Button>
      )}
    </div>
  );
};
