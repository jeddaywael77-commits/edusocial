"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Award, ArrowLeft, Calendar, Building2, DollarSign } from "lucide-react";
import { Badge } from "@/shared/ui/badge";
import { useScholarships } from "@/features/study-tunisia";
import { formatDate } from "@/shared/lib/utils";

export default function ScholarshipsPage() {
  const { data, isLoading } = useScholarships();
  const scholarships = data?.data || [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link href="/study-tunisia" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Study Tunisia
      </Link>
      <div className="flex items-center gap-3">
        <Award className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Scholarships</h1>
      </div>
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{[1, 2, 3, 4].map((i) => <div key={i} className="h-40 rounded-2xl bg-muted animate-pulse" />)}</div>
      ) : scholarships.length === 0 ? (
        <div className="text-center py-16"><Award className="h-12 w-12 mx-auto text-muted-foreground mb-4" /><p className="text-muted-foreground">No scholarships available</p></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {scholarships.map((s, i) => (
            <motion.div key={s.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Link href={`/study-tunisia/scholarships/${s.id}`}>
                <div className="rounded-2xl border border-border bg-card p-5 hover:border-primary/30 transition-all cursor-pointer group h-full">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={s.isAvailable ? "default" : "secondary"} className="text-[10px]">{s.isAvailable ? "Available" : "Closed"}</Badge>
                  </div>
                  <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">{s.title}</h3>
                  {s.institution && <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1"><Building2 className="h-3.5 w-3.5" /> {s.institution.name}</p>}
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    {s.amount && <span className="flex items-center gap-1"><DollarSign className="h-3.5 w-3.5" /> {s.amount}</span>}
                    <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {formatDate(s.deadline)}</span>
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
