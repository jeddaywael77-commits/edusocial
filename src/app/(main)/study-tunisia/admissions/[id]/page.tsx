"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Building2, CheckCircle } from "lucide-react";
import { Badge } from "@/shared/ui/badge";
import { useAdmission } from "@/features/study-tunisia";
import { formatDate } from "@/shared/lib/utils";

export default function AdmissionDetailPage() {
  const params = useParams();
  const { data: admission, isLoading } = useAdmission(params.id as string);

  if (isLoading) return <div className="max-w-3xl mx-auto"><div className="h-64 rounded-2xl bg-muted animate-pulse" /></div>;
  if (!admission) return <div className="max-w-3xl mx-auto text-center py-16"><p className="text-muted-foreground">Not found</p></div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link href="/study-tunisia/admissions" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Admissions
      </Link>
      <div className="rounded-2xl border border-border bg-card p-8">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant={admission.isOpen ? "default" : "secondary"}>{admission.isOpen ? "Open" : "Closed"}</Badge>
        </div>
        <h1 className="text-3xl font-bold mb-4">{admission.title}</h1>
        {admission.institution && (
          <Link href={`/study-tunisia/institutions/${admission.institutionId}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-4">
            <Building2 className="h-4 w-4" /> {admission.institution.name}
          </Link>
        )}
        <div className="p-4 rounded-xl bg-muted/50 mb-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1"><Calendar className="h-4 w-4" /> Deadline</div>
          <p className="font-medium">{formatDate(admission.deadline)}</p>
        </div>
        {admission.description && <div className="prose prose-invert max-w-none mb-6"><p className="whitespace-pre-wrap">{admission.description}</p></div>}
        {admission.requirements && (
          <div>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2"><CheckCircle className="h-5 w-5" /> Requirements</h2>
            <div className="prose prose-invert max-w-none"><p className="whitespace-pre-wrap">{admission.requirements}</p></div>
          </div>
        )}
      </div>
    </div>
  );
}
