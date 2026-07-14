import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/shared/lib/axios";
import { QUERY_KEYS } from "@/shared/lib/constants";
import type {
  Institution,
  StudyProgram,
  StudyGuide,
  AdmissionInfo,
  Scholarship,
  StudyQuestion,
} from "@/shared/types";

export const studyApi = {
  institutions: {
    getAll: (params?: { type?: string; city?: string; search?: string; cursor?: string; limit?: number }) =>
      apiClient.get<{ data: Institution[]; nextCursor: string | null }>("/study-tunisia/institutions", { params }),
    getById: (id: string) =>
      apiClient.get<Institution>(`/study-tunisia/institutions/${id}`),
    create: (data: Omit<Institution, "id" | "createdAt" | "updatedAt" | "isVerified" | "_count" | "programs" | "admissions" | "scholarships">) =>
      apiClient.post<Institution>("/study-tunisia/institutions", data),
    update: (id: string, data: Partial<Institution>) =>
      apiClient.put<Institution>(`/study-tunisia/institutions/${id}`, data),
    delete: (id: string) =>
      apiClient.delete(`/study-tunisia/institutions/${id}`),
  },
  programs: {
    getAll: (params?: { field?: string; level?: string; institutionId?: string; search?: string; cursor?: string; limit?: number }) =>
      apiClient.get<{ data: StudyProgram[]; nextCursor: string | null }>("/study-tunisia/programs", { params }),
    getById: (id: string) =>
      apiClient.get<StudyProgram>(`/study-tunisia/programs/${id}`),
    create: (data: { title: string; description?: string; field: string; level: string; duration?: string; language?: string; tuitionFees?: string; institutionId: string; isPublished?: boolean }) =>
      apiClient.post<StudyProgram>("/study-tunisia/programs", data),
    update: (id: string, data: Partial<StudyProgram>) =>
      apiClient.put<StudyProgram>(`/study-tunisia/programs/${id}`, data),
    delete: (id: string) =>
      apiClient.delete(`/study-tunisia/programs/${id}`),
  },
  guides: {
    getAll: (params?: { category?: string; search?: string; cursor?: string; limit?: number }) =>
      apiClient.get<{ data: StudyGuide[]; nextCursor: string | null }>("/study-tunisia/guides", { params }),
    getById: (id: string) =>
      apiClient.get<StudyGuide>(`/study-tunisia/guides/${id}`),
    create: (data: { title: string; content: string; summary?: string; coverImage?: string; category?: string; isPublished?: boolean }) =>
      apiClient.post<StudyGuide>("/study-tunisia/guides", data),
    update: (id: string, data: Partial<StudyGuide>) =>
      apiClient.put<StudyGuide>(`/study-tunisia/guides/${id}`, data),
    delete: (id: string) =>
      apiClient.delete(`/study-tunisia/guides/${id}`),
  },
  admissions: {
    getAll: (params?: { institutionId?: string; cursor?: string; limit?: number }) =>
      apiClient.get<{ data: AdmissionInfo[]; nextCursor: string | null }>("/study-tunisia/admissions", { params }),
    getById: (id: string) =>
      apiClient.get<AdmissionInfo>(`/study-tunisia/admissions/${id}`),
    create: (data: { title: string; description?: string; institutionId: string; deadline: string; requirements?: string; isOpen?: boolean }) =>
      apiClient.post<AdmissionInfo>("/study-tunisia/admissions", data),
    update: (id: string, data: Partial<AdmissionInfo>) =>
      apiClient.put<AdmissionInfo>(`/study-tunisia/admissions/${id}`, data),
    delete: (id: string) =>
      apiClient.delete(`/study-tunisia/admissions/${id}`),
  },
  scholarships: {
    getAll: (params?: { institutionId?: string; cursor?: string; limit?: number }) =>
      apiClient.get<{ data: Scholarship[]; nextCursor: string | null }>("/study-tunisia/scholarships", { params }),
    getById: (id: string) =>
      apiClient.get<Scholarship>(`/study-tunisia/scholarships/${id}`),
    create: (data: { title: string; description?: string; institutionId?: string; amount?: string; deadline: string; requirements?: string; isAvailable?: boolean }) =>
      apiClient.post<Scholarship>("/study-tunisia/scholarships", data),
    update: (id: string, data: Partial<Scholarship>) =>
      apiClient.put<Scholarship>(`/study-tunisia/scholarships/${id}`, data),
    delete: (id: string) =>
      apiClient.delete(`/study-tunisia/scholarships/${id}`),
  },
  questions: {
    getAll: (params?: { tag?: string; search?: string; cursor?: string; limit?: number }) =>
      apiClient.get<{ data: StudyQuestion[]; nextCursor: string | null }>("/study-tunisia/questions", { params }),
    getById: (id: string) =>
      apiClient.get<StudyQuestion>(`/study-tunisia/questions/${id}`),
    create: (data: { title: string; content: string; tags?: string[] }) =>
      apiClient.post<StudyQuestion>("/study-tunisia/questions", data),
    createAnswer: (questionId: string, content: string) =>
      apiClient.post(`/study-tunisia/questions/${questionId}/answers`, { content }),
    acceptAnswer: (answerId: string) =>
      apiClient.post(`/study-tunisia/answers/${answerId}/accept`),
  },
};

// ─── Institutions ──────────────────────────────────────────────────────────

export const useInstitutions = (params?: { type?: string; city?: string; search?: string }) =>
  useQuery({
    queryKey: [...QUERY_KEYS.studyTunisia.institutions, params],
    queryFn: () => studyApi.institutions.getAll(params).then((r) => r.data),
  });

export const useInstitution = (id: string) =>
  useQuery({
    queryKey: QUERY_KEYS.studyTunisia.institution(id),
    queryFn: () => studyApi.institutions.getById(id).then((r) => r.data),
    enabled: !!id,
  });

export const useCreateInstitution = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: studyApi.institutions.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEYS.studyTunisia.institutions }),
  });
};

// ─── Programs ──────────────────────────────────────────────────────────────

export const usePrograms = (params?: { field?: string; level?: string; institutionId?: string; search?: string }) =>
  useQuery({
    queryKey: [...QUERY_KEYS.studyTunisia.programs, params],
    queryFn: () => studyApi.programs.getAll(params).then((r) => r.data),
  });

export const useProgram = (id: string) =>
  useQuery({
    queryKey: QUERY_KEYS.studyTunisia.program(id),
    queryFn: () => studyApi.programs.getById(id).then((r) => r.data),
    enabled: !!id,
  });

export const useCreateProgram = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: studyApi.programs.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEYS.studyTunisia.programs }),
  });
};

// ─── Guides ────────────────────────────────────────────────────────────────

export const useGuides = (params?: { category?: string; search?: string }) =>
  useQuery({
    queryKey: [...QUERY_KEYS.studyTunisia.guides, params],
    queryFn: () => studyApi.guides.getAll(params).then((r) => r.data),
  });

export const useGuide = (id: string) =>
  useQuery({
    queryKey: QUERY_KEYS.studyTunisia.guide(id),
    queryFn: () => studyApi.guides.getById(id).then((r) => r.data),
    enabled: !!id,
  });

export const useCreateGuide = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: studyApi.guides.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEYS.studyTunisia.guides }),
  });
};

// ─── Admissions ────────────────────────────────────────────────────────────

export const useAdmissions = (params?: { institutionId?: string }) =>
  useQuery({
    queryKey: [...QUERY_KEYS.studyTunisia.admissions, params],
    queryFn: () => studyApi.admissions.getAll(params).then((r) => r.data),
  });

export const useAdmission = (id: string) =>
  useQuery({
    queryKey: QUERY_KEYS.studyTunisia.admission(id),
    queryFn: () => studyApi.admissions.getById(id).then((r) => r.data),
    enabled: !!id,
  });

// ─── Scholarships ──────────────────────────────────────────────────────────

export const useScholarships = (params?: { institutionId?: string }) =>
  useQuery({
    queryKey: [...QUERY_KEYS.studyTunisia.scholarships, params],
    queryFn: () => studyApi.scholarships.getAll(params).then((r) => r.data),
  });

export const useScholarship = (id: string) =>
  useQuery({
    queryKey: QUERY_KEYS.studyTunisia.scholarship(id),
    queryFn: () => studyApi.scholarships.getById(id).then((r) => r.data),
    enabled: !!id,
  });

// ─── Questions ─────────────────────────────────────────────────────────────

export const useQuestions = (params?: { tag?: string; search?: string }) =>
  useQuery({
    queryKey: [...QUERY_KEYS.studyTunisia.questions, params],
    queryFn: () => studyApi.questions.getAll(params).then((r) => r.data),
  });

export const useQuestion = (id: string) =>
  useQuery({
    queryKey: QUERY_KEYS.studyTunisia.question(id),
    queryFn: () => studyApi.questions.getById(id).then((r) => r.data),
    enabled: !!id,
  });

export const useCreateQuestion = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: studyApi.questions.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEYS.studyTunisia.questions }),
  });
};

export const useCreateAnswer = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ questionId, content }: { questionId: string; content: string }) =>
      studyApi.questions.createAnswer(questionId, content),
    onSuccess: (_, { questionId }) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.studyTunisia.question(questionId) });
    },
  });
};

export const useAcceptAnswer = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: studyApi.questions.acceptAnswer,
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEYS.studyTunisia.questions }),
  });
};
