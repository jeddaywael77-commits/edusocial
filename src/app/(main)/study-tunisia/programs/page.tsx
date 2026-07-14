"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, Search, ArrowLeft, Building2, Clock, Languages } from "lucide-react";
import { Input } from "@/shared/ui/input";
import { Badge } from "@/shared/ui/badge";
import { usePrograms } from "@/features/study-tunisia";

export default function ProgramsPage() {
  const [search, setSearch] = useState("");
  const [field] = useState("");
  const { data, isLoading } = usePrograms({ search: search || undefined, field: field || undefined });
  const programs = data?.data || [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link href="/study-tunisia" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Study Tunisia
      </Link>
      <div className="flex items-center gap-3">
        <BookOpen className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Programs</h1>
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search programs..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
      </div>
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{[1, 2, 3, 4].map((i) => <div key={i} className="h-40 rounded-2xl bg-muted animate-pulse" />)}</div>
      ) : programs.length === 0 ? (
        <div className="text-center py-16"><BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" /><p className="text-muted-foreground">No programs found</p></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {programs.map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Link href={`/study-tunisia/programs/${p.id}`}>
                <div className="rounded-2xl border border-border bg-card p-5 hover:border-primary/30 transition-all cursor-pointer group h-full">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="text-[10px]">{p.level}</Badge>
                    <Badge variant="outline" className="text-[10px]">{p.field}</Badge>
                  </div>
                  <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">{p.title}</h3>
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    {p.institution && <span className="flex items-center gap-1"><Building2 className="h-3.5 w-3.5" /> {p.institution.name}</span>}
                    {p.duration && <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {p.duration}</span>}
                    {p.language && <span className="flex items-center gap-1"><Languages className="h-3.5 w-3.5" /> {p.language}</span>}
                  </div>
                  {p.tuitionFees && <p className="text-sm text-muted-foreground mt-2">Tuition: {p.tuitionFees}</p>}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
