"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  BookOpen,
  FileText,
  Video,
  MessageSquare,
  Bot,
  CheckCircle2,
  Clock,
  Users,
  Star,
  ChevronRight,
  Play,
  Download,
  Lock,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { PostCard } from "@/components/feed/post-card";
import { mockCourses, mockPosts } from "@/lib/mock-data";
import { formatNumber } from "@/lib/utils";

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params.id as string;
  const course = mockCourses.find((c) => c.id === courseId) || mockCourses[0];
  const [isEnrolled, setIsEnrolled] = useState(course.isEnrolled);

  const lessons = Array.from({ length: 8 }, (_, i) => ({
    id: `l-${i}`,
    title: [
      "Introduction to the Course",
      "Fundamental Concepts",
      "Core Principles",
      "Advanced Topics",
      "Practice & Exercises",
      "Problem Solving",
      "Real-world Applications",
      "Review & Summary",
    ][i],
    duration: `${15 + Math.floor(Math.random() * 30)} min`,
    isCompleted: i < (course.progress || 0) / 100 * 8,
    isLocked: !isEnrolled && i > 0,
    type: i % 3 === 0 ? "video" : i % 3 === 1 ? "pdf" : "lesson",
  }));

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="h-40 sm:h-48 bg-gradient-to-br from-primary via-secondary to-accent relative flex items-center justify-center">
          <div className="text-center text-white">
            <BookOpen className="h-12 w-12 mx-auto mb-2 opacity-80" />
            <h1 className="text-2xl font-bold">{course.title}</h1>
            <p className="text-sm opacity-80 mt-1">by {course.teacher.name}</p>
          </div>
        </div>

        <div className="p-4">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <Badge variant="accent">{course.category}</Badge>
            <Badge variant="outline" className="capitalize">{course.level}</Badge>
            <div className="flex items-center gap-1 text-sm">
              <Star className="h-4 w-4 text-warning fill-warning" />
              <span className="font-medium">{course.rating}</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              {formatNumber(course.studentsCount)} students
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              {course.lessonsCount} lessons
            </div>
          </div>

          {isEnrolled && course.progress !== undefined && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-muted-foreground">Your Progress</span>
                <span className="text-primary font-medium">{course.progress}%</span>
              </div>
              <Progress value={course.progress} className="h-2" />
            </div>
          )}

          {!isEnrolled && (
            <Button className="mt-3" onClick={() => setIsEnrolled(true)}>
              Enroll in Course
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="lessons">
        <TabsList>
          <TabsTrigger value="lessons">Lessons</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="discussions">Discussions</TabsTrigger>
          <TabsTrigger value="ai">AI Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="lessons" className="mt-4">
          <div className="space-y-2">
            {lessons.map((lesson, i) => (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                  lesson.isCompleted
                    ? "bg-success/5 border border-success/20"
                    : lesson.isLocked
                    ? "bg-muted/30 opacity-60"
                    : "bg-muted/30 hover:bg-muted/50 cursor-pointer"
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  lesson.isCompleted
                    ? "bg-success/20 text-success"
                    : lesson.isLocked
                    ? "bg-muted text-muted-foreground"
                    : "bg-primary/10 text-primary"
                }`}>
                  {lesson.isCompleted ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : lesson.isLocked ? (
                    <Lock className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{lesson.title}</p>
                  <p className="text-xs text-muted-foreground">{lesson.duration}</p>
                </div>
                <Badge variant="outline" className="text-[10px] capitalize">{lesson.type}</Badge>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="assignments" className="mt-4">
          <div className="space-y-3">
            {[
              { title: "Problem Set #1", dueDate: "2024-03-15", maxScore: 100, status: "submitted" },
              { title: "Problem Set #2", dueDate: "2024-03-22", maxScore: 100, status: "pending" },
              { title: "Midterm Project", dueDate: "2024-04-01", maxScore: 200, status: "not_started" },
            ].map((assignment, i) => (
              <div key={i} className="p-4 rounded-xl bg-muted/30 border border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium text-sm">{assignment.title}</p>
                      <p className="text-xs text-muted-foreground">Due: {assignment.dueDate} • {assignment.maxScore} pts</p>
                    </div>
                  </div>
                  <Badge variant={
                    assignment.status === "submitted" ? "success" :
                    assignment.status === "pending" ? "warning" : "outline"
                  }>
                    {assignment.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="discussions" className="mt-4 space-y-4">
          {mockPosts.slice(0, 2).map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </TabsContent>

        <TabsContent value="ai" className="mt-4">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Bot className="h-5 w-5 text-secondary" />
              <h3 className="font-semibold">AI Course Summary</h3>
            </div>
            <div className="space-y-4 text-sm text-muted-foreground">
              <div className="p-4 rounded-xl bg-secondary/5 border border-secondary/20">
                <h4 className="font-medium text-foreground mb-2">Key Topics Covered</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Fundamental mathematical concepts and their applications</li>
                  <li>Core theoretical frameworks and principles</li>
                  <li>Advanced problem-solving techniques</li>
                  <li>Real-world case studies and examples</li>
                </ul>
              </div>
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                <h4 className="font-medium text-foreground mb-2">Suggested Study Plan</h4>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Review chapters 1-3 for foundational concepts</li>
                  <li>Practice exercises from problem sets weekly</li>
                  <li>Watch supplementary video lectures</li>
                  <li>Form study groups for complex topics</li>
                </ol>
              </div>
              <Button variant="secondary" className="w-full">
                <Bot className="h-4 w-4 mr-2" />
                Ask AI Tutor About This Course
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
