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
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Badge } from "@/shared/ui/badge";
import { Progress } from "@/shared/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { useCourses } from "@/features/courses";
import { formatNumber } from "@/shared/lib/utils";

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: courses = [], isLoading } = useCourses();

  const enrolledCourses = courses;
  const availableCourses = courses;

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

        <Tabs defaultValue="explore">
          <TabsList>
            <TabsTrigger value="explore">All Courses ({courses.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="explore" className="mt-4">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="rounded-2xl border border-border bg-card overflow-hidden animate-pulse">
                    <div className="h-32 bg-muted" />
                    <div className="p-4 space-y-2">
                      <div className="h-5 w-48 bg-muted rounded" />
                      <div className="h-3 w-32 bg-muted rounded" />
                      <div className="h-3 w-40 bg-muted rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {courses
                  .filter((c) => c.title.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((course, i) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link href={`/courses/${course.id}`} className="block rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/30 transition-all group">
                      <div className="h-32 bg-gradient-to-br from-secondary/30 to-accent/30 relative flex items-center justify-center">
                        <BookOpen className="h-10 w-10 text-white/60" />
                        <Badge className="absolute top-2 right-2" variant="secondary">{course.level}</Badge>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold group-hover:text-primary transition-colors">{course.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1">by {course.teacher?.name}</p>
                        {course.description && (
                          <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{course.description}</p>
                        )}
                        <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {course._count?.lessons ?? 0} lessons
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {formatNumber(course._count?.enrollments ?? 0)}
                          </div>
                          <Badge variant="outline" className="text-[10px]">{course.category}</Badge>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
                {courses.filter((c) => c.title.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                  <div className="col-span-2 text-center py-12 text-muted-foreground">
                    <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No courses found</p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
