"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Smile,
  Paperclip,
  Mic,
  Search,
  Phone,
  Video,
  MoreVertical,
  Check,
  CheckCheck,
  Image,
  FileText,
  ArrowLeft,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { useAuthStore } from "@/stores/auth-store";
import { mockConversations, mockUsers } from "@/lib/mock-data";
import { formatDate, getInitials } from "@/lib/utils";

export default function MessagesPage() {
  const { user } = useAuthStore();
  const [activeConversation, setActiveConversation] = useState(mockConversations[0]);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileChat, setShowMobileChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const messages = [
    { id: "1", senderId: activeConversation.participants[0].id, content: "Hey! How are you?", isRead: true, createdAt: new Date(Date.now() - 3600000).toISOString() },
    { id: "2", senderId: user?.id || "1", content: "I'm good! Just studying for the exam.", isRead: true, createdAt: new Date(Date.now() - 1800000).toISOString() },
    { id: "3", senderId: activeConversation.participants[0].id, content: "Do you want to study together? I've got the notes from today's lecture.", isRead: true, createdAt: new Date(Date.now() - 900000).toISOString() },
    { id: "4", senderId: user?.id || "1", content: "That would be great! Let me know when you're free.", isRead: true, createdAt: new Date(Date.now() - 600000).toISOString() },
    { id: "5", senderId: activeConversation.participants[0].id, content: activeConversation.lastMessage?.content || "See you in class tomorrow!", isRead: false, createdAt: new Date(Date.now() - 300000).toISOString() },
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!messageText.trim()) return;
    setMessageText("");
  };

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden h-[calc(100vh-5rem)]">
      <div className="flex h-full">
        {/* Conversation List */}
        <div className={`w-full sm:w-80 border-r border-border flex flex-col ${showMobileChat ? "hidden sm:flex" : "flex"}`}>
          <div className="p-3 border-b border-border">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold">Messages</h2>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-9"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {mockConversations
              .filter((c) => {
                if (!searchQuery) return true;
                const name = c.type === "group" ? c.name : c.participants[0]?.name;
                return name?.toLowerCase().includes(searchQuery.toLowerCase());
              })
              .map((conversation) => {
                const otherUser = conversation.participants[0];
                const isActive = activeConversation?.id === conversation.id;
                return (
                  <button
                    key={conversation.id}
                    onClick={() => {
                      setActiveConversation(conversation);
                      setShowMobileChat(true);
                    }}
                    className={`w-full flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors cursor-pointer ${
                      isActive ? "bg-primary/5 border-r-2 border-primary" : ""
                    }`}
                  >
                    <div className="relative shrink-0">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={otherUser?.avatar} />
                        <AvatarFallback className="bg-primary/20 text-primary">
                          {getInitials(conversation.type === "group" ? conversation.name || "G" : otherUser?.name || "U")}
                        </AvatarFallback>
                      </Avatar>
                      {conversation.type === "private" && otherUser?.isOnline && (
                        <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-success border-2 border-card" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-center justify-between">
                        <p className={`text-sm font-medium truncate ${conversation.unreadCount > 0 ? "text-foreground" : "text-muted-foreground"}`}>
                          {conversation.type === "group" ? conversation.name : otherUser?.name}
                        </p>
                        <span className="text-[10px] text-muted-foreground shrink-0">
                          {conversation.lastMessage ? formatDate(conversation.lastMessage.createdAt) : ""}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground truncate">
                          {conversation.lastMessage?.content || "No messages yet"}
                        </p>
                        {conversation.unreadCount > 0 && (
                          <span className="h-5 min-w-5 rounded-full bg-primary text-[10px] font-medium text-white flex items-center justify-center px-1 shrink-0 ml-2">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`flex-1 flex flex-col ${showMobileChat ? "flex" : "hidden sm:flex"}`}>
          {activeConversation ? (
            <>
              <div className="p-3 border-b border-border flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="sm:hidden"
                  onClick={() => setShowMobileChat(false)}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <Avatar className="h-10 w-10">
                  <AvatarImage src={activeConversation.participants[0]?.avatar} />
                  <AvatarFallback className="bg-primary/20 text-primary text-sm">
                    {getInitials(activeConversation.participants[0]?.name || "U")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {activeConversation.type === "group"
                      ? activeConversation.name
                      : activeConversation.participants[0]?.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {activeConversation.type === "private" && activeConversation.participants[0]?.isOnline
                      ? "Online"
                      : `${activeConversation.participants.length} members`}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon-sm"><Phone className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon-sm"><Video className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon-sm"><MoreVertical className="h-4 w-4" /></Button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg) => {
                  const isOwn = msg.senderId === user?.id;
                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`max-w-[75%] ${isOwn ? "order-1" : ""}`}>
                        <div
                          className={`px-3 py-2 rounded-2xl text-sm ${
                            isOwn
                              ? "bg-primary text-white rounded-br-md"
                              : "bg-muted rounded-bl-md"
                          }`}
                        >
                          {msg.content}
                        </div>
                        <div className={`flex items-center gap-1 mt-0.5 ${isOwn ? "justify-end" : ""}`}>
                          <span className="text-[10px] text-muted-foreground">
                            {formatDate(msg.createdAt)}
                          </span>
                          {isOwn && (
                            msg.isRead
                              ? <CheckCheck className="h-3 w-3 text-primary" />
                              : <Check className="h-3 w-3 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-3 border-t border-border">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon-sm">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Input
                    placeholder="Type a message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    className="flex-1"
                  />
                  <Button variant="ghost" size="icon-sm">
                    <Smile className="h-4 w-4" />
                  </Button>
                  {messageText.trim() ? (
                    <Button size="icon-sm" onClick={handleSend}>
                      <Send className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button variant="ghost" size="icon-sm">
                      <Mic className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Select a conversation to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
