"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
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
  ArrowLeft,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { useProfile } from "@/features/auth";
import { useConversations, useMessages, useSendMessage } from "@/features/chat";
import { formatDate, getInitials } from "@/shared/lib/utils";

export default function MessagesPage() {
  const { data: currentUser } = useProfile();
  const { data: conversations = [], isLoading } = useConversations();
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileChat, setShowMobileChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: messagesData } = useMessages(activeConversation || "");
  const messages = messagesData?.data || [];
  const sendMessage = useSendMessage(activeConversation || "");

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const activeConv = conversations.find((c) => c.id === activeConversation);

  const handleSend = () => {
    if (!messageText.trim() || !activeConversation) return;
    sendMessage.mutate({ content: messageText.trim() });
    setMessageText("");
  };

  const getOtherParticipant = (conv: typeof conversations[0]) => {
    return conv.participants?.find((p) => p.userId !== currentUser?.id);
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
            {isLoading ? (
              <div className="space-y-1 p-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 animate-pulse">
                    <div className="h-12 w-12 rounded-full bg-muted shrink-0" />
                    <div className="flex-1 space-y-1">
                      <div className="h-4 w-32 bg-muted rounded" />
                      <div className="h-3 w-48 bg-muted rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              conversations
                .filter((c) => {
                  if (!searchQuery) return true;
                  const other = getOtherParticipant(c);
                  const name = c.isGroup ? c.name : other?.user?.name;
                  return name?.toLowerCase().includes(searchQuery.toLowerCase());
                })
                .map((conversation) => {
                  const other = getOtherParticipant(conversation);
                  const isActive = activeConversation === conversation.id;
                  return (
                    <button
                      key={conversation.id}
                      onClick={() => {
                        setActiveConversation(conversation.id);
                        setShowMobileChat(true);
                      }}
                      className={`w-full flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors cursor-pointer ${
                        isActive ? "bg-primary/5 border-r-2 border-primary" : ""
                      }`}
                    >
                      <div className="relative shrink-0">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={other?.user?.avatar ?? undefined} />
                          <AvatarFallback className="bg-primary/20 text-primary">
                            {getInitials(conversation.isGroup ? conversation.name || "G" : other?.user?.name || "U")}
                          </AvatarFallback>
                        </Avatar>
                        {other?.user?.isOnline && (
                          <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-success border-2 border-card" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium truncate">
                            {conversation.isGroup ? conversation.name : other?.user?.name}
                          </p>
                          <span className="text-[10px] text-muted-foreground shrink-0">
                            {conversation.lastMessage ? formatDate(conversation.lastMessage.createdAt) : ""}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-muted-foreground truncate">
                            {conversation.lastMessage?.content || "No messages yet"}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })
            )}
            {!isLoading && conversations.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No conversations yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`flex-1 flex flex-col ${showMobileChat ? "flex" : "hidden sm:flex"}`}>
          {activeConversation && activeConv ? (
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
                  <AvatarImage src={getOtherParticipant(activeConv)?.user?.avatar ?? undefined} />
                  <AvatarFallback className="bg-primary/20 text-primary text-sm">
                    {getInitials(getOtherParticipant(activeConv)?.user?.name || "U")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {activeConv.isGroup
                      ? activeConv.name
                      : getOtherParticipant(activeConv)?.user?.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {getOtherParticipant(activeConv)?.user?.isOnline ? "Online" : `${activeConv.participants?.length} members`}
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
                  const isOwn = msg.senderId === currentUser?.id;
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
                    <Button size="icon-sm" onClick={handleSend} disabled={sendMessage.isPending}>
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
