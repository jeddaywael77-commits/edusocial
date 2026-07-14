"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Building2, DollarSign, CheckCircle } from "lucide-react";
import { Badge } from "@/shared/ui/badge";
import { useScholarship } from "@/features/study-tunisia";
import { formatDate } from "@/shared/lib/utils";

export default function ScholarshipDetailPage() {
  const params = useParams();
  const { data: scholarship, isLoading } = useScholarship(params.id as string);

  if (isLoading) return <div className="max-w-3xl mx-auto"><div className="h-64 rounded-2xl bg-muted animate-pulse" /></div>;
  if (!scholarship) return <div className="max-w-3xl mx-auto text-center py-16"><p className="text-muted-foreground">Not found</p></div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link href="/study-tunisia/scholarships" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Scholarships
      </Link>
      <div className="rounded-2xl border border-border bg-card p-8">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant={scholarship.isAvailable ? "default" : "secondary"}>{scholarship.isAvailable ? "Available" : "Closed"}</Badge>
        </div>
        <h1 className="text-3xl font-bold mb-4">{scholarship.title}</h1>
        {scholarship.institution && (
          <Link href={`/study-tunisia/institutions/${scholarship.institutionId}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-4">
            <Building2 className="h-4 w-4" /> {scholarship.institution.name}
          </Link>
        )}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {scholarship.amount && <div className="p-4 rounded-xl bg-muted/50"><div className="flex items-center gap-2 text-sm text-muted-foreground mb-1"><DollarSign className="h-4 w-4" /> Amount</div><p className="font-medium">{scholarship.amount}</p></div>}
          <div className="p-4 rounded-xl bg-muted/50"><div className="flex items-center gap-2 text-sm text-muted-foreground mb-1"><Calendar className="h-4 w-4" /> Deadline</div><p className="font-medium">{formatDate(scholarship.deadline)}</p></div>
        </div>
        {scholarship.description && <div className="prose prose-invert max-w-none mb-6"><p className="whitespace-pre-wrap">{scholarship.description}</p></div>}
        {scholarship.requirements && (
          <div>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2"><CheckCircle className="h-5 w-5" /> Requirements</h2>
            <div className="prose prose-invert max-w-none"><p className="whitespace-pre-wrap">{scholarship.requirements}</p></div>
          </div>
        )}
      </div>
    </div>
  );
}
