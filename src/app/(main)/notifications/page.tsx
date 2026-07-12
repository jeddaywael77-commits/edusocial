"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Bell,
  UserPlus,
  MessageSquare,
  FileText,
  Heart,
  MessageCircle,
  Bot,
  Users,
  BookOpen,
  CheckCheck,
  Calendar,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { useNotifications, useMarkNotificationAsRead, useMarkAllAsRead } from "@/features/notifications";
import { formatDate, getInitials } from "@/shared/lib/utils";

const notificationIcons: Record<string, React.ReactNode> = {
  FRIEND_REQUEST: <UserPlus className="h-4 w-4 text-primary" />,
  MESSAGE: <MessageSquare className="h-4 w-4 text-accent" />,
  HOMEWORK: <FileText className="h-4 w-4 text-secondary" />,
  EXAM: <Calendar className="h-4 w-4 text-destructive" />,
  COMMENT: <MessageCircle className="h-4 w-4 text-primary" />,
  LIKE: <Heart className="h-4 w-4 text-destructive" />,
  AI_TASK: <Bot className="h-4 w-4 text-secondary" />,
  GROUP: <Users className="h-4 w-4 text-success" />,
  COURSE: <BookOpen className="h-4 w-4 text-warning" />,
};

const notificationColors: Record<string, string> = {
  FRIEND_REQUEST: "bg-primary/10",
  MESSAGE: "bg-accent/10",
  HOMEWORK: "bg-secondary/10",
  EXAM: "bg-destructive/10",
  COMMENT: "bg-primary/10",
  LIKE: "bg-destructive/10",
  AI_TASK: "bg-secondary/10",
  GROUP: "bg-success/10",
  COURSE: "bg-warning/10",
};

export default function NotificationsPage() {
  const { data: notifications = [], isLoading } = useNotifications();
  const markAsRead = useMarkNotificationAsRead();
  const markAllAsRead = useMarkAllAsRead();

  const handleMarkAsRead = (id: string) => {
    markAsRead.mutate(id);
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead.mutate();
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Notifications
          </h1>
          <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead} disabled={markAllAsRead.isPending}>
            <CheckCheck className="h-4 w-4 mr-1" />
            Mark all read
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-1">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl animate-pulse">
                <div className="w-10 h-10 rounded-full bg-muted shrink-0" />
                <div className="flex-1 space-y-1">
                  <div className="h-4 w-48 bg-muted rounded" />
                  <div className="h-3 w-64 bg-muted rounded" />
                  <div className="h-3 w-20 bg-muted rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Bell className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No notifications yet</p>
          </div>
        ) : (
          <div className="space-y-1">
            {notifications.map((notification, i) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  href={notification.link || "#"}
                  onClick={() => !notification.isRead && handleMarkAsRead(notification.id)}
                  className={`flex items-start gap-3 p-3 rounded-xl transition-colors ${
                    notification.isRead
                      ? "hover:bg-muted/30"
                      : "bg-primary/5 hover:bg-primary/10"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${notificationColors[notification.type] || "bg-muted"}`}>
                    {notificationIcons[notification.type] || <Bell className="h-4 w-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${notification.isRead ? "text-muted-foreground" : "font-medium"}`}>
                      {notification.title}
                    </p>
                    <p className="text-sm text-muted-foreground line-clamp-1">{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{formatDate(notification.createdAt)}</p>
                  </div>
                  {!notification.isRead && (
                    <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-2" />
                  )}
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
