"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Globe, Mail, Phone, BookOpen, GraduationCap, Award } from "lucide-react";
import { Badge } from "@/shared/ui/badge";
import { useInstitution } from "@/features/study-tunisia";

export default function InstitutionDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: institution, isLoading } = useInstitution(id);

  if (isLoading) return <div className="max-w-4xl mx-auto"><div className="h-64 rounded-2xl bg-muted animate-pulse" /></div>;
  if (!institution) return <div className="max-w-4xl mx-auto text-center py-16"><p className="text-muted-foreground">Not found</p></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link href="/study-tunisia/institutions" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Institutions
      </Link>

      {institution.coverImage && <div className="rounded-2xl overflow-hidden h-48"><img src={institution.coverImage} alt="" className="w-full h-full object-cover" /></div>}

      <div className="rounded-2xl border border-border bg-card p-8">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="secondary">{institution.type}</Badge>
          {institution.isVerified && <Badge>Verified</Badge>}
        </div>
        <h1 className="text-3xl font-bold mb-2">{institution.name}</h1>
        <div className="flex items-center gap-1.5 text-muted-foreground mb-4">
          <MapPin className="h-4 w-4" /> {institution.city}
          {institution.address && <>, {institution.address}</>}
        </div>
        {institution.description && <p className="text-muted-foreground whitespace-pre-wrap">{institution.description}</p>}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          {institution.website && <a href={institution.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-3 rounded-xl bg-muted/50 hover:bg-muted text-sm"><Globe className="h-4 w-4" /> Website</a>}
          {institution.email && <a href={`mailto:${institution.email}`} className="flex items-center gap-2 p-3 rounded-xl bg-muted/50 hover:bg-muted text-sm"><Mail className="h-4 w-4" /> Email</a>}
          {institution.phone && <a href={`tel:${institution.phone}`} className="flex items-center gap-2 p-3 rounded-xl bg-muted/50 hover:bg-muted text-sm"><Phone className="h-4 w-4" /> Phone</a>}
        </div>
      </div>

      {institution.programs && institution.programs.length > 0 && (
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><BookOpen className="h-5 w-5" /> Programs ({institution.programs.length})</h2>
          <div className="space-y-3">
            {institution.programs.map((p) => (
              <Link key={p.id} href={`/study-tunisia/programs/${p.id}`} className="flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                <div>
                  <p className="font-medium text-sm">{p.title}</p>
                  <p className="text-xs text-muted-foreground">{p.field} · {p.level}</p>
                </div>
                <Badge variant="outline" className="text-[10px]">{p.duration || "N/A"}</Badge>
              </Link>
            ))}
          </div>
        </div>
      )}

      {institution.admissions && institution.admissions.length > 0 && (
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><GraduationCap className="h-5 w-5" /> Open Admissions</h2>
          <div className="space-y-3">
            {institution.admissions.map((a) => (
              <Link key={a.id} href={`/study-tunisia/admissions/${a.id}`} className="block p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                <p className="font-medium text-sm">{a.title}</p>
                <p className="text-xs text-muted-foreground">Deadline: {new Date(a.deadline).toLocaleDateString()}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {institution.scholarships && institution.scholarships.length > 0 && (
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Award className="h-5 w-5" /> Scholarships</h2>
          <div className="space-y-3">
            {institution.scholarships.map((s) => (
              <Link key={s.id} href={`/study-tunisia/scholarships/${s.id}`} className="block p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                <p className="font-medium text-sm">{s.title}</p>
                <p className="text-xs text-muted-foreground">{s.amount || "Amount TBD"} · Deadline: {new Date(s.deadline).toLocaleDateString()}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
