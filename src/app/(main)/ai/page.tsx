"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  Send,
  Sparkles,
  BookOpen,
  FileText,
  Calculator,
  Lightbulb,
  Code,
  Image,
  Mic,
  RotateCcw,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Brain,
  GraduationCap,
  PenTool,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { useAuthStore } from "@/stores/auth-store";
import { getInitials } from "@/lib/utils";

const suggestions = [
  { icon: BookOpen, label: "Explain Calculus III concepts", color: "text-primary" },
  { icon: FileText, label: "Summarize my PDF notes", color: "text-accent" },
  { icon: Calculator, label: "Generate practice problems", color: "text-secondary" },
  { icon: Code, label: "Help with Python code", color: "text-success" },
  { icon: PenTool, label: "Check my homework", color: "text-warning" },
  { icon: Brain, label: "Create flashcards for me", color: "text-destructive" },
];

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const mockAIResponses: Record<string, string> = {
  default: "I'd be happy to help you with that! Could you provide more details so I can give you a more specific answer?",
  calculus: "Calculus III covers multivariable calculus. Key topics include:\n\n1. **Partial Derivatives** - Rates of change with respect to multiple variables\n2. **Multiple Integrals** - Computing volumes and areas in higher dimensions\n3. **Vector Calculus** - Gradient, divergence, curl, and line integrals\n4. **Green's/Stokes'/Divergence Theorems** - Connecting different types of integrals\n\nWould you like me to explain any of these in more detail?",
  python: "Here's a basic Python example:\n\n```python\ndef fibonacci(n):\n    if n <= 1:\n        return n\n    return fibonacci(n-1) + fibonacci(n-2)\n\n# Generate first 10 numbers\nfor i in range(10):\n    print(fibonacci(i))\n```\n\nWhat specific Python concept would you like help with?",
  flashcards: "Here are some flashcards for your review:\n\n**Card 1:** What is the derivative of sin(x)?\n→ cos(x)\n\n**Card 2:** What is the integral of 1/x?\n→ ln|x| + C\n\n**Card 3:** What is the chain rule?\n→ d/dx[f(g(x))] = f'(g(x)) · g'(x)\n\nWould you like me to generate more flashcards on a specific topic?",
};

export default function AIPage() {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (text?: string) => {
    const content = text || inputValue.trim();
    if (!content) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    setTimeout(() => {
      const lowerContent = content.toLowerCase();
      let response = mockAIResponses.default;
      if (lowerContent.includes("calculus")) response = mockAIResponses.calculus;
      else if (lowerContent.includes("python") || lowerContent.includes("code")) response = mockAIResponses.python;
      else if (lowerContent.includes("flashcard")) response = mockAIResponses.flashcards;

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden h-[calc(100vh-5rem)] flex flex-col">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary to-primary flex items-center justify-center">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold">AI Tutor</h2>
            <p className="text-xs text-muted-foreground">Always here to help you learn</p>
          </div>
        </div>
        {messages.length > 0 && (
          <Button variant="ghost" size="sm" onClick={() => setMessages([])}>
            <RotateCcw className="h-4 w-4 mr-1" />
            New Chat
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full max-w-lg mx-auto text-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-secondary/20 to-primary/20 flex items-center justify-center mb-4">
              <Sparkles className="h-10 w-10 text-secondary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">
              Hello, <span className="gradient-text">{user?.name?.split(" ")[0]}</span>!
            </h2>
            <p className="text-muted-foreground mb-8">
              I can help you with homework, explain concepts, create flashcards, and more.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 w-full">
              {suggestions.map((suggestion, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => handleSend(suggestion.label)}
                  className="p-3 rounded-xl border border-border bg-muted/30 hover:bg-muted/50 transition-all text-left group cursor-pointer"
                >
                  <suggestion.icon className={`h-4 w-4 mb-2 ${suggestion.color}`} />
                  <p className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">{suggestion.label}</p>
                </motion.button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4 max-w-3xl mx-auto">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${message.role === "user" ? "justify-end" : ""}`}
              >
                {message.role === "assistant" && (
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-secondary to-primary flex items-center justify-center shrink-0">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                    message.role === "user"
                      ? "bg-primary text-white rounded-br-md"
                      : "bg-muted rounded-bl-md"
                  }`}
                >
                  <div className="whitespace-pre-wrap">{message.content}</div>
                </div>
                {message.role === "user" && (
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback className="bg-primary/20 text-primary text-xs">
                      {getInitials(user?.name || "U")}
                    </AvatarFallback>
                  </Avatar>
                )}
              </motion.div>
            ))}

            {isTyping && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-secondary to-primary flex items-center justify-center shrink-0">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex gap-1">
                    <div className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-2 max-w-3xl mx-auto">
          <Button variant="ghost" size="icon-sm">
            <Mic className="h-4 w-4" />
          </Button>
          <Input
            placeholder="Ask me anything about your studies..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1"
          />
          <Button size="icon-sm" onClick={() => handleSend()} disabled={!inputValue.trim() || isTyping}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
