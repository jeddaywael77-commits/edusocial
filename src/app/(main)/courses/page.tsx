"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookOpen,
  Search,
  Star,
  Users,
  Clock,
  ChevronRight,
  Filter,
  GraduationCap,
  Code,
  Atom,
  Calculator,
  Brain,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Badge } from "@/shared/ui/badge";
import { Progress } from "@/shared/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { mockCourses } from "@/lib/mock-data";
import { formatNumber } from "@/lib/utils";

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const enrolledCourses = mockCourses.filter((c) => c.isEnrolled);
  const allCourses = mockCourses.filter((c) => !c.isEnrolled);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Courses
          </h1>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Tabs defaultValue="enrolled">
          <TabsList>
            <TabsTrigger value="enrolled">My Courses ({enrolledCourses.length})</TabsTrigger>
            <TabsTrigger value="explore">Explore</TabsTrigger>
          </TabsList>

          <TabsContent value="enrolled" className="mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {enrolledCourses.map((course, i) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link href={`/courses/${course.id}`} className="block rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/30 transition-all group">
                    <div className="h-32 bg-gradient-to-br from-primary/30 via-secondary/30 to-accent/30 relative flex items-center justify-center">
                      <BookOpen className="h-10 w-10 text-white/60" />
                      <Badge className="absolute top-2 right-2" variant="accent">{course.category}</Badge>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold group-hover:text-primary transition-colors">{course.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1">by {course.teacher.name}</p>
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="text-primary font-medium">{course.progress || 0}%</span>
                        </div>
                        <Progress value={course.progress || 0} className="h-1.5" />
                      </div>
                      <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {course.lessonsCount} lessons
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {formatNumber(course.studentsCount)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-warning fill-warning" />
                          {course.rating}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="explore" className="mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {allCourses
                .filter((c) => c.title.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((course, i) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/30 transition-all"
                >
                  <div className="h-32 bg-gradient-to-br from-secondary/30 to-accent/30 relative flex items-center justify-center">
                    <BookOpen className="h-10 w-10 text-white/60" />
                    <Badge className="absolute top-2 right-2" variant="secondary">{course.level}</Badge>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold">{course.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">by {course.teacher.name}</p>
                    <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{course.description}</p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-warning fill-warning" />
                          {course.rating}
                        </div>
                        <span>{formatNumber(course.studentsCount)} students</span>
                      </div>
                      <Button size="sm" className="h-7 text-xs">
                        Enroll
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
