"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Building2, Clock, Languages, DollarSign } from "lucide-react";
import { Badge } from "@/shared/ui/badge";
import { useProgram } from "@/features/study-tunisia";

export default function ProgramDetailPage() {
  const params = useParams();
  const { data: program, isLoading } = useProgram(params.id as string);

  if (isLoading) return <div className="max-w-3xl mx-auto"><div className="h-64 rounded-2xl bg-muted animate-pulse" /></div>;
  if (!program) return <div className="max-w-3xl mx-auto text-center py-16"><p className="text-muted-foreground">Not found</p></div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link href="/study-tunisia/programs" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Programs
      </Link>
      <div className="rounded-2xl border border-border bg-card p-8">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="secondary">{program.level}</Badge>
          <Badge variant="outline">{program.field}</Badge>
        </div>
        <h1 className="text-3xl font-bold mb-4">{program.title}</h1>
        {program.institution && (
          <Link href={`/study-tunisia/institutions/${program.institutionId}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-4">
            <Building2 className="h-4 w-4" /> {program.institution.name} · {program.institution.city}
          </Link>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          {program.duration && <div className="p-3 rounded-xl bg-muted/50"><div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1"><Clock className="h-3.5 w-3.5" /> Duration</div><p className="font-medium text-sm">{program.duration}</p></div>}
          {program.language && <div className="p-3 rounded-xl bg-muted/50"><div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1"><Languages className="h-3.5 w-3.5" /> Language</div><p className="font-medium text-sm">{program.language}</p></div>}
          {program.tuitionFees && <div className="p-3 rounded-xl bg-muted/50"><div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1"><DollarSign className="h-3.5 w-3.5" /> Tuition</div><p className="font-medium text-sm">{program.tuitionFees}</p></div>}
        </div>
        {program.description && <div className="prose prose-invert max-w-none"><p className="whitespace-pre-wrap">{program.description}</p></div>}
      </div>
    </div>
  );
}
