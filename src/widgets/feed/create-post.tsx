"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Image, FileText, Video, PenLine, Sparkles, Mic, Calendar,
  BarChart3, Hash, AtSign, Smile, Globe, Users, Lock,
  ChevronDown, X, Plus,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import { Textarea } from "@/shared/ui/textarea";
import { Dialog, DialogContent } from "@/shared/ui/dialog";
import { useProfile } from "@/features/auth";
import { useCreatePost } from "@/features/posts";
import { getInitials } from "@/shared/lib/utils";

type Audience = "public" | "friends" | "private";

const audiences: { value: Audience; label: string; icon: typeof Globe }[] = [
  { value: "public", label: "Public", icon: Globe },
  { value: "friends", label: "Friends", icon: Users },
  { value: "private", label: "Private", icon: Lock },
];

const quickActions = [
  { label: "Photo", icon: Image, bg: "bg-emerald-500/15", text: "text-emerald-500" },
  { label: "Video", icon: Video, bg: "bg-purple-500/15", text: "text-purple-500" },
  { label: "PDF", icon: FileText, bg: "bg-cyan-500/15", text: "text-cyan-500" },
  { label: "Poll", icon: BarChart3, bg: "bg-amber-500/15", text: "text-amber-500" },
  { label: "Event", icon: Calendar, bg: "bg-blue-500/15", text: "text-blue-500" },
  { label: "AI", icon: Sparkles, bg: "bg-gradient-to-br from-purple-500 to-pink-500", text: "text-white" },
];

const toolbarActions = [
  { icon: Image, color: "text-emerald-500", label: "Photo" },
  { icon: Video, color: "text-purple-500", label: "Video" },
  { icon: FileText, color: "text-cyan-500", label: "File" },
  { icon: BarChart3, color: "text-amber-500", label: "Poll" },
  { icon: Calendar, color: "text-blue-500", label: "Event" },
  { icon: Mic, color: "text-rose-500", label: "Audio" },
  { icon: PenLine, color: "text-primary", label: "Draw" },
];

export function CreatePost() {
  const { data: user } = useProfile();
  const createPost = useCreatePost();
  const [isExpanded, setIsExpanded] = useState(false);
  const [content, setContent] = useState("");
  const [audience, setAudience] = useState<Audience>("public");
  const [hashtags, setHashtags] = useState("");
  const [showAudienceMenu, setShowAudienceMenu] = useState(false);

  const currentAudience = audiences.find((a) => a.value === audience)!;
  const AudienceIcon = currentAudience.icon;
  const charCount = content.length;

  const handlePost = () => {
    if (!content.trim()) return;
    const fullContent = hashtags.trim()
      ? `${content.trim()}\n\n${hashtags.trim()}`
      : content.trim();
    createPost.mutate(
      { content: fullContent },
      {
        onSuccess: () => {
          setContent("");
          setHashtags("");
          setAudience("public");
          setIsExpanded(false);
        },
      }
    );
  };

  return (
    <>
      <motion.div
        layout
        className="rounded-2xl border border-border bg-card p-4"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 shrink-0">
            <AvatarImage src={user?.avatar ?? undefined} />
            <AvatarFallback className="bg-primary/20 text-primary text-sm">
              {getInitials(user?.name || "U")}
            </AvatarFallback>
          </Avatar>
          <button
            onClick={() => setIsExpanded(true)}
            className="flex-1 text-left px-4 py-2.5 rounded-xl bg-muted text-muted-foreground text-sm hover:bg-muted/80 transition-colors cursor-pointer"
          >
            What&apos;s on your mind?
          </button>
        </div>

        <div className="grid grid-cols-6 gap-2 mt-3 pt-3 border-t border-border">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                onClick={() => setIsExpanded(true)}
                className="flex flex-col items-center gap-1.5 py-2 rounded-xl hover:bg-muted transition-colors cursor-pointer group"
              >
                <span className={`flex items-center justify-center w-9 h-9 rounded-full ${action.bg} group-hover:scale-110 transition-transform`}>
                  <Icon className={`h-4 w-4 ${action.text}`} />
                </span>
                <span className="text-[11px] text-muted-foreground font-medium">{action.label}</span>
              </button>
            );
          })}
        </div>
      </motion.div>

      <AnimatePresence>
        {isExpanded && (
          <Dialog open={isExpanded} onOpenChange={setIsExpanded}>
            <DialogContent className="sm:max-w-lg p-0 gap-0 overflow-hidden border-border bg-card">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center justify-between px-5 pt-5 pb-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-11 w-11">
                      <AvatarImage src={user?.avatar ?? undefined} />
                      <AvatarFallback className="bg-primary/20 text-primary text-sm">
                        {getInitials(user?.name || "U")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold text-primary">{user?.name}</p>
                      <span className="inline-flex items-center text-[11px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium capitalize">
                        {user?.role?.toLowerCase()}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsExpanded(false)}
                    className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-primary cursor-pointer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="relative mx-5">
                  <button
                    onClick={() => setShowAudienceMenu((v) => !v)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted text-xs font-medium text-muted-foreground hover:bg-muted/80 transition-colors cursor-pointer"
                  >
                    <AudienceIcon className="h-3.5 w-3.5" />
                    {currentAudience.label}
                    <ChevronDown className="h-3 w-3" />
                  </button>
                  <AnimatePresence>
                    {showAudienceMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="absolute top-full left-0 mt-1 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-50"
                      >
                        {audiences.map((a) => {
                          const AIcon = a.icon;
                          return (
                            <button
                              key={a.value}
                              onClick={() => { setAudience(a.value); setShowAudienceMenu(false); }}
                              className={`flex items-center gap-2 w-full px-4 py-2.5 text-sm hover:bg-muted transition-colors cursor-pointer ${audience === a.value ? "text-primary font-medium" : "text-muted-foreground"}`}
                            >
                              <AIcon className="h-4 w-4" />
                              {a.label}
                            </button>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="px-5 pt-3">
                  <Textarea
                    placeholder="What's on your mind?"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[140px] bg-transparent border-transparent focus:border-primary focus:ring-0 resize-none text-base placeholder:text-muted-foreground/50"
                    autoFocus
                  />
                </div>

                <div className="px-5 pb-2">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 border border-border">
                    <Hash className="h-4 w-4 text-muted-foreground shrink-0" />
                    <input
                      type="text"
                      placeholder="Add hashtags..."
                      value={hashtags}
                      onChange={(e) => setHashtags(e.target.value)}
                      className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/50 text-primary"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between px-5 py-3 border-t border-border">
                  <div className="flex items-center gap-1">
                    {toolbarActions.map((action) => {
                      const TIcon = action.icon;
                      return (
                        <button
                          key={action.label}
                          title={action.label}
                          className={`p-2 rounded-full hover:bg-muted transition-colors cursor-pointer ${action.color}`}
                        >
                          <TIcon className="h-4.5 w-4.5" />
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex items-center gap-3">
                    {charCount > 0 && (
                      <span className="text-xs text-muted-foreground tabular-nums">
                        {charCount.toLocaleString()}
                      </span>
                    )}
                    <Button
                      onClick={handlePost}
                      disabled={!content.trim() || createPost.isPending}
                      className="gradient-primary text-white font-semibold px-6 rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {createPost.isPending ? (
                        <span className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4 animate-spin" />
                          Posting...
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5">
                          <Sparkles className="h-4 w-4" />
                          Post
                        </span>
                      )}
                    </Button>
                  </div>
                </div>
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  );
}
