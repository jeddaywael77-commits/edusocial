"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Globe, Building2, BookOpen, FileText, GraduationCap, Award, HelpCircle } from "lucide-react";
import { useInstitutions, usePrograms, useGuides, useAdmissions, useScholarships, useQuestions } from "@/features/study-tunisia";
import { formatNumber } from "@/shared/lib/utils";

const sections = [
  { icon: Building2, title: "Institutions", description: "Universities, institutes, and schools in Tunisia", href: "/study-tunisia/institutions", color: "from-blue-500 to-cyan-500" },
  { icon: BookOpen, title: "Programs", description: "Study programs and fields of study", href: "/study-tunisia/programs", color: "from-purple-500 to-pink-500" },
  { icon: FileText, title: "Guides", description: "Guides for studying in Tunisia", href: "/study-tunisia/guides", color: "from-green-500 to-emerald-500" },
  { icon: GraduationCap, title: "Admissions", description: "Upcoming admission deadlines", href: "/study-tunisia/admissions", color: "from-orange-500 to-amber-500" },
  { icon: Award, title: "Scholarships", description: "Scholarships and financial aid", href: "/study-tunisia/scholarships", color: "from-red-500 to-rose-500" },
  { icon: HelpCircle, title: "Q&A", description: "Ask questions and get answers", href: "/study-tunisia/questions", color: "from-indigo-500 to-violet-500" },
];

export default function StudyTunisiaPage() {
  const { data: institutions } = useInstitutions();
  const { data: programs } = usePrograms();
  const { data: guides } = useGuides();
  const { data: admissions } = useAdmissions();
  const { data: scholarships } = useScholarships();
  const { data: questions } = useQuestions();

  const stats = [
    { label: "Institutions", value: institutions?.data?.length || 0 },
    { label: "Programs", value: programs?.data?.length || 0 },
    { label: "Guides", value: guides?.data?.length || 0 },
    { label: "Admissions", value: admissions?.data?.length || 0 },
    { label: "Scholarships", value: scholarships?.data?.length || 0 },
    { label: "Questions", value: questions?.data?.length || 0 },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
          <Globe className="h-4 w-4 text-primary" />
          <span className="text-sm text-primary font-medium">Study in Tunisia</span>
        </div>
        <h1 className="text-4xl font-bold">
          Everything you need to <span className="gradient-text">study in Tunisia</span>
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Explore universities, programs, scholarships, and guides to help you on your educational journey in Tunisia
        </p>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center p-3 rounded-xl bg-muted/50">
            <p className="text-xl font-bold">{formatNumber(stat.value)}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map((section, i) => (
          <motion.div
            key={section.href}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link href={section.href}>
              <div className="rounded-2xl border border-border bg-card p-6 hover:border-primary/30 transition-all cursor-pointer group h-full">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <section.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-1">{section.title}</h3>
                <p className="text-sm text-muted-foreground">{section.description}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
