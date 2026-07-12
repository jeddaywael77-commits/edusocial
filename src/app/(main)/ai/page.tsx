"use client";

import * as React from "react";
import { useAiConversations, useAiMessages, aiApi, useSuggestedQuestions } from "@/api/ai";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { ScrollArea } from "@/shared/ui/scroll-area";
import {
  Send,
  Plus,
  MessageSquare,
  Sparkles,
  Loader2,
  Trash2,
  Bot,
  User,
  BookOpen,
  Calculator,
  FileText,
  GraduationCap,
  Clock,
} from "lucide-react";

function MarkdownRenderer({ content }: { content: string }) {
  const html = content
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/`(.*?)`/g, '<code class="bg-muted px-1 rounded text-sm">$1</code>')
    .replace(/\n/g, "<br/>");
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

export default function AiPage() {
  const [activeConversation, setActiveConversation] = React.useState<string | null>(null);
  const [input, setInput] = React.useState("");
  const [isStreaming, setIsStreaming] = React.useState(false);
  const [streamingContent, setStreamingContent] = React.useState("");
  const [showSidebar, setShowSidebar] = React.useState(true);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const { data: conversations, refetch: refetchConversations } = useAiConversations();
  const { data: messages } = useAiMessages(activeConversation || "");
  const { data: suggested } = useSuggestedQuestions();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent]);

  const handleNewConversation = async () => {
    const result = await aiApi.createConversation();
    setActiveConversation(result.data.id);
    refetchConversations();
  };

  const handleSend = async (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text || !activeConversation || isStreaming) return;

    setInput("");
    setIsStreaming(true);
    setStreamingContent("");

    try {
      const stream = aiApi.streamMessage(activeConversation, {
        content: text,
      });

      let fullContent = "";
      for await (const chunk of stream) {
        if (chunk.content) {
          fullContent += chunk.content;
          setStreamingContent(fullContent);
        }
      }

      setStreamingContent("");
      refetchConversations();
    } catch (error) {
      console.error("Streaming error:", error);
    } finally {
      setIsStreaming(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const featureCards = [
    { icon: <BookOpen className="h-5 w-5" />, title: "AI Tutor", desc: "Ask any question", color: "text-blue-400 bg-blue-400/10" },
    { icon: <Calculator className="h-5 w-5" />, title: "Homework Help", desc: "Get step-by-step help", color: "text-purple-400 bg-purple-400/10" },
    { icon: <FileText className="h-5 w-5" />, title: "Quiz Generator", desc: "Test your knowledge", color: "text-green-400 bg-green-400/10" },
    { icon: <GraduationCap className="h-5 w-5" />, title: "Study Planner", desc: "Plan your studies", color: "text-orange-400 bg-orange-400/10" },
    { icon: <Sparkles className="h-5 w-5" />, title: "Flashcards", desc: "Create study cards", color: "text-pink-400 bg-pink-400/10" },
    { icon: <Clock className="h-5 w-5" />, title: "Summarizer", desc: "Summarize documents", color: "text-cyan-400 bg-cyan-400/10" },
  ];

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-background">
      {/* Sidebar */}
      {showSidebar && (
        <div className="w-72 border-r border-border bg-card flex flex-col">
          <div className="p-3 border-b border-border">
            <Button onClick={handleNewConversation} className="w-full" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Chat
            </Button>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {conversations?.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setActiveConversation(conv.id)}
                  className={`w-full p-2.5 rounded-lg text-left text-sm flex items-center gap-2 transition-colors ${
                    activeConversation === conv.id
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-muted text-foreground"
                  }`}
                >
                  <MessageSquare className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{conv.title}</span>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="h-12 border-b border-border flex items-center px-4 justify-between">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            <span className="font-semibold text-sm">AI Assistant</span>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setShowSidebar(!showSidebar)}
          >
            <MessageSquare className="h-4 w-4" />
          </Button>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          {!activeConversation || (messages?.length === 0 && !streamingContent) ? (
            <div className="max-w-2xl mx-auto py-8">
              <div className="text-center mb-8">
                <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  EduSocial AI Assistant
                </h2>
                <p className="text-muted-foreground">
                  Your personal AI tutor, homework helper, and study companion
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
                {featureCards.map((card) => (
                  <Card
                    key={card.title}
                    className="p-4 hover:border-primary/30 cursor-pointer transition-all"
                    onClick={() => {
                      handleNewConversation();
                      setTimeout(() => setInput(`Help me with ${card.title.toLowerCase()}: `), 500);
                    }}
                  >
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center mb-2 ${card.color}`}>
                      {card.icon}
                    </div>
                    <p className="font-medium text-sm">{card.title}</p>
                    <p className="text-xs text-muted-foreground">{card.desc}</p>
                  </Card>
                ))}
              </div>

              {suggested && (
                <div className="space-y-3">
                  {suggested.map((group) => (
                    <div key={group.category}>
                      <p className="text-xs font-medium text-muted-foreground uppercase mb-2">{group.category}</p>
                      <div className="flex flex-wrap gap-2">
                        {group.questions.map((q) => (
                          <button
                            key={q}
                            onClick={() => {
                              handleNewConversation();
                              setTimeout(() => setInput(q), 500);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-muted text-sm hover:bg-muted/80 transition-colors"
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-4">
              {messages?.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}
                >
                  {msg.role !== "user" && (
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] p-3 rounded-xl text-sm ${
                      msg.role === "user"
                        ? "bg-primary text-white"
                        : "bg-card border border-border"
                    }`}
                  >
                    <MarkdownRenderer content={msg.content} />
                  </div>
                  {msg.role === "user" && (
                    <div className="h-8 w-8 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4 text-secondary" />
                    </div>
                  )}
                </div>
              ))}

              {streamingContent && (
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                  <div className="max-w-[80%] p-3 rounded-xl text-sm bg-card border border-border">
                    <MarkdownRenderer content={streamingContent} />
                    <span className="inline-block w-2 h-4 bg-primary animate-pulse ml-1" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </ScrollArea>

        {/* Input */}
        <div className="p-4 border-t border-border">
          <div className="max-w-3xl mx-auto">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything..."
                disabled={isStreaming}
                className="flex-1"
              />
              <Button
                onClick={() => handleSend()}
                disabled={!input.trim() || isStreaming}
                size="icon"
              >
                {isStreaming ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              AI responses may not always be accurate. Always verify important information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
