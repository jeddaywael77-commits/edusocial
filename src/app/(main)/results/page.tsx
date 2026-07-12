"use client";

import React from "react";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Award, BookOpen, Clock, Target, CheckCircle2, XCircle } from "lucide-react";
import { Card } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Progress } from "@/shared/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { useAuthStore } from "@/stores/auth-store";

const mockResults = [
  { course: "Calculus III", score: 85, maxScore: 100, date: "2024-03-10", type: "Quiz" },
  { course: "Linear Algebra", score: 92, maxScore: 100, date: "2024-03-08", type: "Assignment" },
  { course: "Introduction to AI", score: 78, maxScore: 100, date: "2024-03-05", type: "Quiz" },
  { course: "Physics", score: 88, maxScore: 100, date: "2024-03-01", type: "Exam" },
  { course: "Data Structures", score: 95, maxScore: 100, date: "2024-02-28", type: "Assignment" },
];

export default function ResultsPage() {
  const { user } = useAuthStore();
  const avgScore = mockResults.reduce((acc, r) => acc + r.score, 0) / mockResults.length;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-card p-4">
        <h1 className="text-xl font-bold flex items-center gap-2 mb-4">
          <BarChart3 className="h-5 w-5 text-primary" />
          Results
        </h1>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <Card className="p-3 text-center">
            <Target className="h-5 w-5 text-primary mx-auto mb-1" />
            <p className="text-xl font-bold">{Math.round(avgScore)}%</p>
            <p className="text-xs text-muted-foreground">Average</p>
          </Card>
          <Card className="p-3 text-center">
            <CheckCircle2 className="h-5 w-5 text-success mx-auto mb-1" />
            <p className="text-xl font-bold">{mockResults.length}</p>
            <p className="text-xs text-muted-foreground">Completed</p>
          </Card>
          <Card className="p-3 text-center">
            <Award className="h-5 w-5 text-warning mx-auto mb-1" />
            <p className="text-xl font-bold">{mockResults.filter((r) => r.score >= 90).length}</p>
            <p className="text-xs text-muted-foreground">A Grades</p>
          </Card>
          <Card className="p-3 text-center">
            <TrendingUp className="h-5 w-5 text-secondary mx-auto mb-1" />
            <p className="text-xl font-bold">↑5%</p>
            <p className="text-xs text-muted-foreground">Improvement</p>
          </Card>
        </div>

        <div className="space-y-2">
          {mockResults.map((result, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3 p-3 rounded-xl bg-muted/30"
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                result.score >= 90 ? "bg-success/10 text-success" :
                result.score >= 70 ? "bg-primary/10 text-primary" :
                "bg-warning/10 text-warning"
              }`}>
                {result.score >= 90 ? <CheckCircle2 className="h-5 w-5" /> :
                 result.score >= 70 ? <TrendingUp className="h-5 w-5" /> :
                 <Target className="h-5 w-5" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{result.course}</p>
                  <p className="text-sm font-bold">{result.score}/{result.maxScore}</p>
                </div>
                <Progress value={result.score} className="h-1.5 mt-1" />
                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                  <span>{result.type}</span>
                  <span>•</span>
                  <span>{result.date}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
