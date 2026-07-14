"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { GraduationCap, ArrowLeft, Calendar, Building2 } from "lucide-react";
import { Badge } from "@/shared/ui/badge";
import { useAdmissions } from "@/features/study-tunisia";
import { formatDate } from "@/shared/lib/utils";

export default function AdmissionsPage() {
  const { data, isLoading } = useAdmissions();
  const admissions = data?.data || [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link href="/study-tunisia" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Study Tunisia
      </Link>
      <div className="flex items-center gap-3">
        <GraduationCap className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Admissions</h1>
      </div>
      {isLoading ? (
        <div className="space-y-4">{[1, 2, 3].map((i) => <div key={i} className="h-28 rounded-2xl bg-muted animate-pulse" />)}</div>
      ) : admissions.length === 0 ? (
        <div className="text-center py-16"><GraduationCap className="h-12 w-12 mx-auto text-muted-foreground mb-4" /><p className="text-muted-foreground">No open admissions</p></div>
      ) : (
        <div className="space-y-4">
          {admissions.map((a, i) => (
            <motion.div key={a.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Link href={`/study-tunisia/admissions/${a.id}`}>
                <div className="rounded-2xl border border-border bg-card p-5 hover:border-primary/30 transition-all cursor-pointer group">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={a.isOpen ? "default" : "secondary"} className="text-[10px]">{a.isOpen ? "Open" : "Closed"}</Badge>
                  </div>
                  <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">{a.title}</h3>
                  {a.institution && <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1"><Building2 className="h-3.5 w-3.5" /> {a.institution.name}</p>}
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-2">
                    <Calendar className="h-3.5 w-3.5" /> Deadline: {formatDate(a.deadline)}
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
