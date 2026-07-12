"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  User,
  Shield,
  Bell,
  Palette,
  Globe,
  Moon,
  Sun,
  Monitor,
  Camera,
  Save,
  Eye,
  EyeOff,
  Mail,
  Lock,
  Smartphone,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { Switch } from "@/shared/ui/switch";
import { useAuthStore } from "@/stores/auth-store";
import { getInitials } from "@/lib/utils";

export default function SettingsPage() {
  const { user } = useAuthStore();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-card p-4">
        <h1 className="text-xl font-bold flex items-center gap-2 mb-4">
          <Settings className="h-5 w-5 text-primary" />
          Settings
        </h1>

        <Tabs defaultValue="profile">
          <TabsList className="flex-wrap">
            <TabsTrigger value="profile">
              <User className="h-4 w-4 mr-1" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="h-4 w-4 mr-1" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="appearance">
              <Palette className="h-4 w-4 mr-1" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="h-4 w-4 mr-1" />
              Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-4 space-y-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback className="text-xl bg-primary/20 text-primary font-bold">
                    {getInitials(user?.name || "U")}
                  </AvatarFallback>
                </Avatar>
                <Button size="icon-sm" className="absolute -bottom-1 -right-1 rounded-full">
                  <Camera className="h-3 w-3" />
                </Button>
              </div>
              <div>
                <h3 className="font-semibold">{user?.name}</h3>
                <p className="text-sm text-muted-foreground capitalize">{user?.role}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">School</label>
                <Input defaultValue={user?.school} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Department</label>
                <Input defaultValue={user?.department} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full min-h-[80px] rounded-xl border border-border bg-muted px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>

            <Button>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </TabsContent>

          <TabsContent value="notifications" className="mt-4 space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                <div>
                  <p className="text-sm font-medium">Push Notifications</p>
                  <p className="text-xs text-muted-foreground">Receive push notifications</p>
                </div>
                <Switch checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                <div>
                  <p className="text-sm font-medium">Email Notifications</p>
                  <p className="text-xs text-muted-foreground">Receive email updates</p>
                </div>
                <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                <div>
                  <p className="text-sm font-medium">Sound</p>
                  <p className="text-xs text-muted-foreground">Play sounds for notifications</p>
                </div>
                <Switch checked={soundEnabled} onCheckedChange={setSoundEnabled} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="appearance" className="mt-4 space-y-4">
            <p className="text-sm text-muted-foreground">Choose your preferred theme</p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Dark", icon: Moon, active: true },
                { label: "Light", icon: Sun, active: false },
                { label: "System", icon: Monitor, active: false },
              ].map((theme) => (
                <button
                  key={theme.label}
                  className={`p-4 rounded-xl border transition-all ${
                    theme.active
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <theme.icon className={`h-6 w-6 mx-auto mb-2 ${theme.active ? "text-primary" : "text-muted-foreground"}`} />
                  <p className={`text-sm text-center ${theme.active ? "text-primary font-medium" : "text-muted-foreground"}`}>
                    {theme.label}
                  </p>
                </button>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="security" className="mt-4 space-y-4">
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-muted/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Change Password</p>
                    <p className="text-xs text-muted-foreground">Last changed 30 days ago</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Change</Button>
              </div>
              <div className="p-3 rounded-xl bg-muted/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Smartphone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Two-Factor Authentication</p>
                    <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Enable</Button>
              </div>
              <div className="p-3 rounded-xl bg-muted/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Active Sessions</p>
                    <p className="text-xs text-muted-foreground">Manage your active sessions</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">View</Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
