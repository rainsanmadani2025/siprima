"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Baby,
  BookOpen,
  Heart,
  Brain,
  MessageSquare,
  Users,
  Palette,
  ChevronDown,
  ChevronUp,
  Filter,
  BarChart3,
  TrendingUp,
  Calendar,
  Award,
  FileText,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ChildData {
  id: string;
  name: string;
  class: string;
  nisn?: string;
  photo?: string;
}

interface AssessmentData {
  id: string;
  aspect: string;
  score: string;
  notes?: string;
  observation?: string;
  date: string;
}

interface ChildAssessment {
  child: ChildData;
  assessments: Record<string, AssessmentData[]>;
}

interface ApiResponse {
  children: ChildAssessment[];
  availablePeriods: { semester: string; academicYear: string }[];
}

const ASPECT_CONFIG: Record<string, { label: string; icon: React.ElementType; color: string; bgColor: string; borderColor: string }> = {
  agama: {
    label: "Nilai Agama & Moral",
    icon: Heart,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
  },
  fisik: {
    label: "Perkembangan Fisik Motorik",
    icon: Baby,
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
  },
  kognitif: {
    label: "Perkembangan Kognitif",
    icon: Brain,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  bahasa: {
    label: "Perkembangan Bahasa",
    icon: MessageSquare,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
  },
  sosial_emosional: {
    label: "Perkembangan Sosial-Emosional",
    icon: Users,
    color: "text-pink-600",
    bgColor: "bg-pink-50",
    borderColor: "border-pink-200",
  },
  seni: {
    label: "Perkembangan Seni",
    icon: Palette,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-200",
  },
};

const SCORE_CONFIG: Record<string, { label: string; color: string; bgColor: string; description: string }> = {
  BB: {
    label: "Belum Berkembang",
    color: "text-red-600",
    bgColor: "bg-red-50",
    description: "Anak belum menunjukkan perkembangan pada aspek ini",
  },
  MB: {
    label: "Mulai Berkembang",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    description: "Anak mulai menunjukkan perkembangan tetapi belum konsisten",
  },
  BSH: {
    label: "Berkembang Sesuai Harapan",
    color: "text-green-600",
    bgColor: "bg-green-50",
    description: "Perkembangan anak sesuai dengan harapan untuk usianya",
  },
  BSB: {
    label: "Berkembang Sangat Baik",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    description: "Anak menunjukkan perkembangan melampaui harapan usianya",
  },
};

const SCORE_ORDER: Record<string, number> = { BB: 1, MB: 2, BSH: 3, BSB: 4 };

function getScoreBadge(score: string) {
  const config = SCORE_CONFIG[score] || SCORE_CONFIG["BB"];
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${config.color} ${config.bgColor}`}
    >
      <Award className="w-3 h-3" />
      {score}
    </span>
  );
}

function getLatestScore(assessments: AssessmentData[]) {
  if (!assessments || assessments.length === 0) return null;
  const sorted = [...assessments].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  return sorted[0];
}

export default function PenilaianPage() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<string>("all");
  const [selectedAcademicYear, setSelectedAcademicYear] =
    useState<string>("all");
  const [expandedAspects, setExpandedAspects] = useState<Set<string>>(
    new Set()
  );
  const [activeChildTab, setActiveChildTab] = useState<string>("");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

	if (typeof window === "undefined") return;

	const userId = localStorage.getItem("userId");

	if (!userId) {
  	setError("Sesi login tidak ditemukan. Silakan login kembali.");
  	return;
	}      

      const params = new URLSearchParams();
      if (selectedSemester && selectedSemester !== "all")
        params.set("semester", selectedSemester);
      if (selectedAcademicYear && selectedAcademicYear !== "all")
        params.set("academicYear", selectedAcademicYear);

      const query = params.toString() ? `?${params.toString()}` : "";
      const res = await fetch(`/api/parent/assessments${query}`, {
        cache: "no-store",
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Gagal memuat data penilaian");
      }

      const result: ApiResponse = await res.json();
      setData(result);

      if (result.children.length > 0 && !activeChildTab) {
        setActiveChildTab(result.children[0].child.id);
      }
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat memuat data");
    } finally {
      setLoading(false);
    }
  }, [selectedSemester, selectedAcademicYear, activeChildTab]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const toggleAspect = (aspectKey: string) => {
    setExpandedAspects((prev) => {
      const next = new Set(prev);
      if (next.has(aspectKey)) {
        next.delete(aspectKey);
      } else {
        next.add(aspectKey);
      }
      return next;
    });
  };

  const getOverallProgress = (
    assessments: Record<string, AssessmentData[]>
  ) => {
    const aspects = Object.keys(assessments);
    if (aspects.length === 0) return null;

    let totalScore = 0;
    let count = 0;

    aspects.forEach((aspect) => {
      const latest = getLatestScore(assessments[aspect]);
      if (latest) {
        totalScore += SCORE_ORDER[latest.score] || 0;
        count++;
      }
    });

    if (count === 0) return null;
    const avg = totalScore / count;

    if (avg >= 3.5) return { label: "Sangat Baik", color: "text-blue-600", bgColor: "bg-blue-50", icon: TrendingUp };
    if (avg >= 2.5) return { label: "Sesuai Harapan", color: "text-green-600", bgColor: "bg-green-50", icon: BarChart3 };
    if (avg >= 1.5) return { label: "Mulai Berkembang", color: "text-yellow-600", bgColor: "bg-yellow-50", icon: BarChart3 };
    return { label: "Perlu Perhatian", color: "text-red-600", bgColor: "bg-red-50", icon: AlertCircle };
  };

  const activeChildIndex = data?.children.findIndex(
    (c) => c.child.id === activeChildTab
  );
  const activeChildData =
    activeChildIndex !== undefined && activeChildIndex >= 0
      ? data?.children[activeChildIndex]
      : null;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-muted-foreground text-sm">Memuat data penilaian...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md mx-auto border-red-200">
          <CardContent className="flex flex-col items-center gap-4 pt-6">
            <AlertCircle className="w-12 h-12 text-red-500" />
            <p className="text-center text-muted-foreground">{error}</p>
            <Button variant="outline" onClick={fetchData}>
              Coba Lagi
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data || data.children.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md mx-auto">
          <CardContent className="flex flex-col items-center gap-4 pt-6">
            <FileText className="w-12 h-12 text-muted-foreground/50" />
            <div className="text-center">
              <p className="font-medium text-muted-foreground">
                Belum Ada Data Penilaian
              </p>
              <p className="text-sm text-muted-foreground/70 mt-1">
                Data penilaian perkembangan anak belum tersedia. Silakan hubungi guru untuk informasi lebih lanjut.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const overallProgress = activeChildData
    ? getOverallProgress(activeChildData.assessments)
    : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-primary" />
            Penilaian Perkembangan Anak
          </h1>
          <p className="text-muted-foreground mt-1">
            Pantau perkembangan dan penilaian anak Anda secara berkala
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Filter:</span>
        </div>
      </div>

      {/* Filter Bar */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center gap-2 flex-1">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium whitespace-nowrap">
                Semester:
              </span>
              <Select
                value={selectedSemester}
                onValueChange={setSelectedSemester}
              >
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Semua Semester" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Semester</SelectItem>
                  {data.availablePeriods
                    .filter(
                      (p, i, arr) =>
                        arr.findIndex((x) => x.semester === p.semester) === i
                    )
                    .map((p) => (
                      <SelectItem key={p.semester} value={p.semester}>
                        Semester {p.semester}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2 flex-1">
              <span className="text-sm font-medium whitespace-nowrap">
                Tahun Ajaran:
              </span>
              <Select
                value={selectedAcademicYear}
                onValueChange={setSelectedAcademicYear}
              >
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Semua Tahun Ajaran" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Tahun Ajaran</SelectItem>
                  {data.availablePeriods
                    .filter(
                      (p, i, arr) =>
                        arr.findIndex(
                          (x) => x.academicYear === p.academicYear
                        ) === i
                    )
                    .map((p) => (
                      <SelectItem
                        key={p.academicYear}
                        value={p.academicYear}
                      >
                        {p.academicYear}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Child Tabs */}
      {data.children.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {data.children.map((childAssessment) => (
            <Button
              key={childAssessment.child.id}
              variant={
                activeChildTab === childAssessment.child.id
                  ? "default"
                  : "outline"
              }
              size="sm"
              onClick={() =>
                setActiveChildTab(childAssessment.child.id)
              }
              className="whitespace-nowrap"
            >
              {childAssessment.child.name}
              {childAssessment.child.class && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  {childAssessment.child.class}
                </Badge>
              )}
            </Button>
          ))}
        </div>
      )}

      {/* Active Child Content */}
      {activeChildData && (
        <>
          {/* Child Info Card + Overall Progress */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="md:col-span-2">
              <CardContent className="flex items-center gap-4 py-4">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                  {activeChildData.child.name
                    .charAt(0)
                    .toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold text-lg truncate">
                    {activeChildData.child.name}
                  </h2>
                  <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-muted-foreground">
                    {activeChildData.child.class && (
                      <Badge variant="outline">
                        Kelas {activeChildData.child.class}
                      </Badge>
                    )}
                    {activeChildData.child.nisn && (
                      <span>NISN: {activeChildData.child.nisn}</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {overallProgress && (
              <Card
                className={`${overallProgress.bgColor} border-2 ${overallProgress.color}`}
              >
                <CardContent className="flex items-center gap-3 py-4">
                  <overallProgress.icon className="w-8 h-8" />
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      Perkembangan Keseluruhan
                    </p>
                    <p
                      className={`font-bold text-lg ${overallProgress.color}`}
                    >
                      {overallProgress.label}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Score Legend */}
          <Card>
            <CardContent className="py-3">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-medium text-muted-foreground">
                  Keterangan Nilai:
                </span>
                {Object.entries(SCORE_CONFIG).map(([key, config]) => (
                  <div key={key} className="flex items-center gap-1.5">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${config.color} ${config.bgColor}`}
                    >
                      {key}
                    </span>
                    <span className="text-xs text-muted-foreground hidden sm:inline">
                      {config.label}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Assessment Aspect Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {Object.entries(ASPECT_CONFIG).map(([key, config]) => {
              const assessments = activeChildData.assessments[key] || [];
              const latest = getLatestScore(assessments);
              const isExpanded = expandedAspects.has(key);

              return (
                <Card
                  key={key}
                  className={`border ${config.borderColor} overflow-hidden`}
                >
                  {/* Card Header */}
                  <CardHeader
                    className={`py-4 px-5 ${config.bgColor} cursor-pointer select-none`}
                    onClick={() => toggleAspect(key)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${config.bgColor} ${config.color}`}
                        >
                          <config.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <CardTitle className="text-sm font-semibold">
                            {config.label}
                          </CardTitle>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {assessments.length > 0
                              ? `${assessments.length} penilaian`
                              : "Belum ada penilaian"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {latest && getScoreBadge(latest.score)}
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <CardContent className="pt-4 px-5 pb-5 space-y-3">
                      {assessments.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          Belum ada penilaian untuk aspek ini
                        </p>
                      ) : (
                        <div className="space-y-3 max-h-72 overflow-y-auto">
                          {[...assessments]
                            .sort(
                              (a, b) =>
                                new Date(b.date).getTime() -
                                new Date(a.date).getTime()
                            )
                            .map((assessment) => {
                              const scoreConfig =
                                SCORE_CONFIG[assessment.score] ||
                                SCORE_CONFIG["BB"];
                              return (
                                <div
                                  key={assessment.id}
                                  className="border rounded-lg p-3 space-y-2"
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      {getScoreBadge(assessment.score)}
                                      <span className="text-xs text-muted-foreground">
                                        {new Date(assessment.date).toLocaleDateString(
                                          "id-ID",
                                          {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                          }
                                        )}
                                      </span>
                                    </div>
                                  </div>
                                  {scoreConfig && (
                                    <p
                                      className={`text-xs ${scoreConfig.color}`}
                                    >
                                      {scoreConfig.description}
                                    </p>
                                  )}
                                  {assessment.observation && (
                                    <div className="mt-2">
                                      <p className="text-xs font-medium text-muted-foreground mb-1">
                                        Observasi:
                                      </p>
                                      <p className="text-sm text-foreground/90">
                                        {assessment.observation}
                                      </p>
                                    </div>
                                  )}
                                  {assessment.notes && (
                                    <div className="mt-2">
                                      <p className="text-xs font-medium text-muted-foreground mb-1">
                                        Catatan Guru:
                                      </p>
                                      <p className="text-sm text-foreground/90">
                                        {assessment.notes}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                        </div>
                      )}
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}