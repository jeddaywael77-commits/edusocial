"use client";

import React from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  BookOpen,
  FileText,
  Video,
  Bot,
  CheckCircle2,
  Clock,
  Users,
  Star,
  Play,
  Lock,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Progress } from "@/shared/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { Card } from "@/shared/ui/card";
import { useCourse } from "@/features/courses";
import { useCourseLessons } from "@/features/lessons";
import { useEnrollCourse } from "@/features/courses";
import { formatNumber } from "@/shared/lib/utils";

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params.id as string;
  const { data: course, isLoading } = useCourse(courseId);
  const { data: lessons = [] } = useCourseLessons(courseId);
  const enrollCourse = useEnrollCourse();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-border bg-card overflow-hidden animate-pulse">
          <div className="h-48 bg-muted" />
          <div className="p-4 space-y-3">
            <div className="h-6 w-48 bg-muted rounded" />
            <div className="h-4 w-32 bg-muted rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
        <p>Course not found</p>
      </div>
    );
  }

  const handleEnroll = () => {
    enrollCourse.mutate(courseId);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="h-40 sm:h-48 bg-gradient-to-br from-primary via-secondary to-accent relative flex items-center justify-center">
          <div className="text-center text-white">
            <BookOpen className="h-12 w-12 mx-auto mb-2 opacity-80" />
            <h1 className="text-2xl font-bold">{course.title}</h1>
            <p className="text-sm opacity-80 mt-1">by {course.teacher?.name}</p>
          </div>
        </div>

        <div className="p-4">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <Badge variant="accent">{course.category}</Badge>
            <Badge variant="outline" className="capitalize">{course.level}</Badge>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              {formatNumber(course._count?.enrollments ?? 0)} students
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              {course._count?.lessons ?? 0} lessons
            </div>
          </div>

          {course.description && (
            <p className="text-sm text-muted-foreground mt-2">{course.description}</p>
          )}

          <Button className="mt-3" onClick={handleEnroll} disabled={enrollCourse.isPending}>
            {enrollCourse.isPending ? "Enrolling..." : "Enroll in Course"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="lessons">
        <TabsList>
          <TabsTrigger value="lessons">Lessons ({lessons.length})</TabsTrigger>
          <TabsTrigger value="discussions">Discussions</TabsTrigger>
          <TabsTrigger value="ai">AI Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="lessons" className="mt-4">
          {lessons.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No lessons yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {lessons.map((lesson, i) => (
                <motion.div
                  key={lesson.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                    lesson.isPublished
                      ? "bg-muted/30 hover:bg-muted/50 cursor-pointer"
                      : "bg-muted/30 opacity-60"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    lesson.isPublished
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {lesson.isPublished ? (
                      <Play className="h-4 w-4" />
                    ) : (
                      <Lock className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{lesson.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {lesson.duration ? `${lesson.duration} min` : "Duration TBD"}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-[10px]">Lesson {i + 1}</Badge>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="discussions" className="mt-4">
          <div className="text-center py-12 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No discussions yet</p>
          </div>
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
