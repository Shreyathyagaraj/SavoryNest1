import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, User, Bot, Loader2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { GoogleGenAI } from "@google/genai";
import { cn } from "../lib/utils";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

interface Message {
  role: "user" | "bot";
  content: string;
}

export default function MealBuddy() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", content: "Greetings, citizen! I am MealBuddy, your high-fidelity culinary advisor. How may I assist your gastronomic journey today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      // Use keyword matching for fast responses or go to Gemini
      const keywords = {
        admin: "To reach Core Command (Admin), please use the escalation protocol in your profile or use the secret authorization code if you have one.",
        order: "You can track your active manifests in the 'Orders' section of your profile. Our sonic delivery fleet is always on the move.",
        menu: "Our curated portfolio of artisanal cuisines can be explored in the Menu section. We recommend the Truffle Infused selection.",
        delivery: "We pride ourselves on lightning-fast logistics. Standard extraction to delivery cycles are between 15-25 minutes.",
        payment: "We accept all major secure comm-links including Razorpay, Visa, and Mastercard for maximum security.",
        savorynest: "SavoryNest is the pinnacle of culinary logistics. We bridge the gap between elite kitchens and refined palates."
      };

      let botResponse = "";
      const lowerInput = userMessage.toLowerCase();
      
      for (const [key, val] of Object.entries(keywords)) {
        if (lowerInput.includes(key)) {
          botResponse = val;
          break;
        }
      }

      if (!botResponse) {
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: userMessage,
          config: {
            systemInstruction: "You are MealBuddy, a highly sophisticated AI assistant for 'SavoryNest', a premium food delivery platform. Use a polite, slightly futuristic, and premium tone. Refer to food as 'culinary masterpieces', 'artisanal dishes', or 'gastronomic delights'. Refer to delivery as 'logistics', 'dispatch', or 'extraction'. Keep responses concise and professional."
          }
        });
        botResponse = response.text || "My neural links are currently stabilizing. Please re-transmit.";
      }

      setMessages(prev => [...prev, { role: "bot", content: botResponse }]);
    } catch (error) {
       console.error("MealBuddy Error:", error);
       setMessages(prev => [...prev, { role: "bot", content: "Signal interference detected. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[1000]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="mb-6 w-[400px] h-[600px] bg-white rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.15)] border border-gray-100 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="premium-gradient p-8 text-white flex justify-between items-center shrink-0">
               <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                     <Bot size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black tracking-tighter uppercase">MealBuddy</h3>
                    <div className="flex items-center space-x-2">
                       <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                       <span className="text-[10px] font-bold uppercase tracking-widest text-white/70">Neural Link Active</span>
                    </div>
                  </div>
               </div>
               <button 
                onClick={() => setIsOpen(false)}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
               >
                 <X size={20} />
               </button>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar"
            >
              {messages.map((msg, idx) => (
                <motion.div
                  initial={{ opacity: 0, x: msg.role === "user" ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={idx}
                  className={cn(
                    "flex items-start gap-4",
                    msg.role === "user" ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-lg",
                    msg.role === "user" ? "bg-indigo-50 text-indigo-500" : "bg-orange-50 text-[#ff6b35]"
                  )}>
                    {msg.role === "user" ? <User size={20} /> : <Sparkles size={20} />}
                  </div>
                  <div className={cn(
                    "max-w-[75%] p-5 rounded-[1.5rem] text-sm font-medium leading-relaxed shadow-sm border",
                    msg.role === "user" 
                      ? "bg-[#111827] text-white border-transparent rounded-tr-none" 
                      : "bg-gray-50 text-gray-700 border-gray-100 rounded-tl-none"
                  )}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#ff6b35] flex items-center justify-center shrink-0">
                    <Loader2 size={20} className="animate-spin" />
                  </div>
                  <div className="bg-gray-50 p-4 rounded-[1.5rem] rounded-tl-none border border-gray-100 italic text-xs text-gray-400 font-bold uppercase tracking-widest">
                    Synthesizing response...
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-8 pt-0">
              <div className="relative group">
                <input 
                  placeholder="Transmit your message..."
                  className="w-full bg-gray-50 border border-gray-100 rounded-[2rem] pl-8 pr-16 py-5 text-sm font-black focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-[#ff6b35] transition-all"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                />
                <button 
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-[#ff6b35] transition-all disabled:opacity-50 active:scale-95 shadow-xl shadow-gray-200"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-20 h-20 premium-gradient rounded-[2rem] shadow-2xl flex items-center justify-center text-white relative group"
      >
        <div className="absolute inset-0 bg-white/20 rounded-[2rem] animate-ping group-hover:scale-150 transition-transform opacity-30" />
        <MessageSquare size={32} className="relative z-10" />
        {!isOpen && (
           <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full border-4 border-white flex items-center justify-center text-[10px] font-black">1</span>
        )}
      </motion.button>
    </div>
  );
}
