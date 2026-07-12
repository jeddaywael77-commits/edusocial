"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  GraduationCap,
  ArrowRight,
  Users,
  BookOpen,
  Bot,
  MessageSquare,
  Trophy,
  Sparkles,
  Star,
  Zap,
  Shield,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  { icon: Users, title: "Social Learning", description: "Connect with classmates and teachers through a Facebook-like feed", color: "text-primary" },
  { icon: BookOpen, title: "Rich Courses", description: "Access lessons, assignments, PDFs, and videos in organized courses", color: "text-secondary" },
  { icon: Bot, title: "AI Tutor", description: "Get instant help with homework, explanations, and study materials", color: "text-accent" },
  { icon: MessageSquare, title: "Real-time Chat", description: "Private and group messaging with file sharing and voice notes", color: "text-success" },
  { icon: Trophy, title: "Gamification", description: "Earn XP, badges, and climb the leaderboard as you learn", color: "text-warning" },
  { icon: Shield, title: "Communities", description: "Join school groups, clubs, and classroom communities", color: "text-destructive" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-secondary/10 rounded-full blur-[128px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[200px]" />
      </div>

      <nav className="relative z-10 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <span className="text-2xl font-bold gradient-text">EduSocial</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost">Sign In</Button>
          </Link>
          <Link href="/register">
            <Button>
              Get Started
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
      </nav>

      <main className="relative z-10">
        <section className="max-w-7xl mx-auto px-6 pt-20 pb-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm text-primary font-medium">The Future of Education</span>
            </div>

            <h1 className="text-5xl sm:text-7xl font-bold mb-6 leading-tight">
              Where Learning
              <br />
              Meets{" "}
              <span className="gradient-text">Community</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              A social educational platform inspired by Facebook, Discord, and ChatGPT.
              Connect, learn, and grow together with AI-powered tools.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <Button size="xl" className="text-base">
                  Start Learning Free
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="xl" className="text-base">
                  Sign In
                </Button>
              </Link>
            </div>

            <div className="flex items-center justify-center gap-8 mt-12 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-muted border-2 border-card flex items-center justify-center text-[10px]">
                      {["AB", "SA", "YI", "FZ", "OT"][i - 1]}
                    </div>
                  ))}
                </div>
                <span>500+ Active Students</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-warning fill-warning" />
                <span>4.9 Rating</span>
              </div>
            </div>
          </motion.div>
        </section>

        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything you need to{" "}
              <span className="gradient-text">succeed</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              A complete platform combining social features, course management, and AI assistance
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="p-6 rounded-2xl border border-border bg-card hover:border-primary/30 transition-all group"
              >
                <div className={`w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${feature.color}`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 py-20 text-center">
          <div className="rounded-2xl border border-border bg-card p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5" />
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-4">Ready to transform your learning?</h2>
              <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                Join thousands of students and teachers already using EduSocial
              </p>
              <Link href="/register">
                <Button size="xl" className="text-base">
                  Get Started for Free
                  <Zap className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <footer className="max-w-7xl mx-auto px-6 py-8 border-t border-border">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <GraduationCap className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold gradient-text">EduSocial</span>
            </div>
            <p className="text-sm text-muted-foreground">
              2024 EduSocial. Built with passion for education.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
