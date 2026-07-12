"use client";

import React, { useEffect } from "react";
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
  GraduationCap,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNotificationStore } from "@/stores/notification-store";
import { mockNotifications } from "@/lib/mock-data";
import { formatDate, getInitials } from "@/lib/utils";

const notificationIcons: Record<string, React.ReactNode> = {
  friend_request: <UserPlus className="h-4 w-4 text-primary" />,
  message: <MessageSquare className="h-4 w-4 text-accent" />,
  homework: <FileText className="h-4 w-4 text-secondary" />,
  exam: <Calendar className="h-4 w-4 text-destructive" />,
  comment: <MessageCircle className="h-4 w-4 text-primary" />,
  like: <Heart className="h-4 w-4 text-destructive" />,
  ai_task: <Bot className="h-4 w-4 text-secondary" />,
  group: <Users className="h-4 w-4 text-success" />,
  course: <BookOpen className="h-4 w-4 text-warning" />,
};

const notificationColors: Record<string, string> = {
  friend_request: "bg-primary/10",
  message: "bg-accent/10",
  homework: "bg-secondary/10",
  exam: "bg-destructive/10",
  comment: "bg-primary/10",
  like: "bg-destructive/10",
  ai_task: "bg-secondary/10",
  group: "bg-success/10",
  course: "bg-warning/10",
};

export default function NotificationsPage() {
  const { notifications, setNotifications, markAsRead, markAllAsRead } = useNotificationStore();

  useEffect(() => {
    if (notifications.length === 0) {
      setNotifications(mockNotifications);
    }
  }, [notifications.length, setNotifications]);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Notifications
          </h1>
          <Button variant="ghost" size="sm" onClick={markAllAsRead}>
            <CheckCheck className="h-4 w-4 mr-1" />
            Mark all read
          </Button>
        </div>

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
                onClick={() => markAsRead(notification.id)}
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
      </div>
    </div>
  );
}
