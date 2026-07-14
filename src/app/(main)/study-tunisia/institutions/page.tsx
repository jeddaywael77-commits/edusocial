"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Building2, Search, MapPin, BookOpen, GraduationCap, Award, ArrowLeft } from "lucide-react";
import { Input } from "@/shared/ui/input";
import { Badge } from "@/shared/ui/badge";
import { useInstitutions } from "@/features/study-tunisia";

export default function InstitutionsPage() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");

  const { data, isLoading } = useInstitutions({
    search: search || undefined,
    type: type === "all" ? undefined : type,
  });

  const institutions = data?.data || [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link href="/study-tunisia" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Study Tunisia
      </Link>

      <div className="flex items-center gap-3">
        <Building2 className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Institutions</h1>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search institutions..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
        <div className="flex gap-2">
          {["all", "university", "institute", "school", "college"].map((t) => (
            <button key={t} onClick={() => setType(t)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${type === t ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-48 rounded-2xl bg-muted animate-pulse" />)}
        </div>
      ) : institutions.length === 0 ? (
        <div className="text-center py-16"><Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" /><p className="text-muted-foreground">No institutions found</p></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {institutions.map((inst, i) => (
            <motion.div key={inst.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Link href={`/study-tunisia/institutions/${inst.id}`}>
                <div className="rounded-2xl border border-border bg-card p-5 hover:border-primary/30 transition-all cursor-pointer group h-full">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="text-[10px]">{inst.type}</Badge>
                    {inst.isVerified && <Badge variant="default" className="text-[10px]">Verified</Badge>}
                  </div>
                  <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">{inst.name}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                    <MapPin className="h-3.5 w-3.5" /> {inst.city}
                  </div>
                  {inst.description && <p className="text-sm text-muted-foreground line-clamp-2 mt-2">{inst.description}</p>}
                  <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><BookOpen className="h-3.5 w-3.5" /> {inst._count?.programs || 0} Programs</span>
                    <span className="flex items-center gap-1"><GraduationCap className="h-3.5 w-3.5" /> {inst._count?.admissions || 0} Admissions</span>
                    <span className="flex items-center gap-1"><Award className="h-3.5 w-3.5" /> {inst._count?.scholarships || 0} Scholarships</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
