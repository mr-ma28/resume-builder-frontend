"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Download,
  Code,
  User,
  Mail,
  Phone,
  BookOpen,
  Briefcase,
  Cpu,
  FolderGit2,
  FileText,
  Calendar,
  Eye,
  EyeOff,
} from "lucide-react";
import axiosClient from "../../../lib/axiosClient";
import DownloadPDFButton from "./../../../component/downloadResumeButton";
import ResumePDF from "@/app/component/resumePDF";
import { PDFViewer } from "@react-pdf/renderer";

interface Education {
  school: string;
  degree: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Skill {
  name: string;
  description: string;
}

interface Project {
  title: string;
  description: string;
  techstack: string;
}

interface Resume {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  summary: string;
  education: Education[];
  experience: Experience[];
  skills: Skill[];
  projects: Project[];
}

export default function ResumeViewPage() {
  const { id } = useParams();
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showJSON, setShowJSON] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  useEffect(() => {
    if (!id) {
      setError("No resume ID provided");
      setLoading(false);
      return;
    }

    const fetchResume = async () => {
      try {
        const res = await axiosClient.get(`/resumes/${id}?populate=*`);
        const data = res.data?.data;

        if (!data) {
          setError("Resume not found");
          setResume(null);
          return;
        }

        const processedResume: Resume = {
          id: data.id,
          fullName: data.fullName || "No Name Provided",
          email: data.email || "No Email Provided",
          phone: data.phone || "No Phone Provided",
          summary: data.summary || "",
          education: data.education || [],
          experience: data.experience || [],
          skills: data.skills || [],
          projects: data.projects || [],
        };

        setResume(processedResume);
      } catch (err: any) {
        console.error("Error fetching resume:", err);
        setError(err.response?.data?.error?.message || "Failed to load resume");
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-[calc(100vh-84px)] bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Loading Resume
          </h2>
          <p className="text-gray-500">
            Please wait while we fetch your resume data...
          </p>
          <p className="text-sm text-gray-400 mt-2">ID: {id}</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-[calc(100vh-84px)] bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="bg-red-100 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <div className="text-red-500 text-2xl">⚠️</div>
          </div>
          <h2 className="text-2xl font-bold text-red-600 mb-2">
            Error Loading Resume
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <p className="text-sm text-gray-500 mb-4">Resume ID: {id}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl">
            Try Again
          </button>
        </div>
      </div>
    );

  if (!resume)
    return (
      <div className="min-h-[calc(100vh-84px)] bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="bg-gray-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <User className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            No Resume Found
          </h2>
          <p className="text-gray-500">
            The requested resume could not be loaded.
          </p>
          <p className="text-sm text-gray-400 mt-2">ID: {id}</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-[calc(100vh-84px)] bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-4 lg:p-6">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8 mb-6 border border-gray-100">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-2xl shadow-lg">
                <FileText className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
              {resume.fullName}
            </h1>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-gray-600 mb-6">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span className="text-sm lg:text-base">{resume.email}</span>
              </div>
              {resume.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm lg:text-base">{resume.phone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <DownloadPDFButton resume={resume} />
            <button
              onClick={() => setShowJSON(!showJSON)}
              className="flex items-center justify-center gap-2 bg-gray-200 text-gray-800 px-6 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
              <Code className="w-5 h-5" />
              {showJSON ? "Hide JSON" : "Show JSON"}
            </button>
          </div>
        </div>

        {/* JSON View */}
        {showJSON && (
          <div className="mb-6 bg-gray-900 rounded-2xl shadow-xl overflow-hidden">
            <div className="p-4 bg-gray-800 border-b border-gray-700">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <Code className="w-4 h-4" />
                Raw Data (JSON)
              </h3>
            </div>
            <pre className="p-4 text-green-400 overflow-x-auto text-sm max-h-96">
              {JSON.stringify(resume, null, 2)}
            </pre>
          </div>
        )}

        {/* Main Content - Full Width */}
        <div className="space-y-6">
          {/* Summary */}
          {resume.summary && (
            <section className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Professional Summary
                </h2>
              </div>
              <p className="text-gray-700 leading-relaxed text-lg">
                {resume.summary}
              </p>
            </section>
          )}

          {/* Education */}
          {resume.education && resume.education.length > 0 && (
            <section className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Education ({resume.education.length})
                </h2>
              </div>
              <div className="space-y-4">
                {resume.education.map((edu: Education, i: number) => (
                  <div key={i} className="border-l-4 border-blue-200 pl-4 py-2">
                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 text-lg">
                          {edu.degree}
                        </h3>
                        <p className="text-gray-600">{edu.school}</p>
                        {edu.description && (
                          <p className="text-gray-700 mt-2 text-sm">
                            {edu.description}
                          </p>
                        )}
                      </div>
                      {(edu.startDate || edu.endDate) && (
                        <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full whitespace-nowrap">
                          <Calendar className="w-3 h-3" />
                          <span>
                            {edu.startDate} - {edu.endDate || "Present"}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Experience */}
          {resume.experience && resume.experience.length > 0 && (
            <section className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Briefcase className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Experience ({resume.experience.length})
                </h2>
              </div>
              <div className="space-y-4">
                {resume.experience.map((exp: Experience, i: number) => (
                  <div
                    key={i}
                    className="border-l-4 border-green-200 pl-4 py-2">
                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 text-lg">
                          {exp.position}
                        </h3>
                        <p className="text-gray-600">{exp.company}</p>
                        {exp.description && (
                          <p className="text-gray-700 mt-2 text-sm">
                            {exp.description}
                          </p>
                        )}
                      </div>
                      {(exp.startDate || exp.endDate) && (
                        <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full whitespace-nowrap">
                          <Calendar className="w-3 h-3" />
                          <span>
                            {exp.startDate} - {exp.endDate || "Present"}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {resume.skills && resume.skills.length > 0 && (
            <section className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Cpu className="w-5 h-5 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Skills ({resume.skills.length})
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {resume.skills.map((skill: Skill, i: number) => (
                  <span
                    key={i}
                    className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium hover:bg-purple-200 transition-colors duration-200">
                    {skill.name}
                    {skill.description && ` - ${skill.description}`}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {resume.projects && resume.projects.length > 0 && (
            <section className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-pink-100 p-2 rounded-lg">
                  <FolderGit2 className="w-5 h-5 text-pink-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Projects ({resume.projects.length})
                </h2>
              </div>
              <div className="space-y-4">
                {resume.projects.map((proj: Project, i: number) => (
                  <div key={i} className="border-l-4 border-pink-200 pl-4 py-2">
                    <div className="space-y-2">
                      <h3 className="font-semibold text-gray-800 text-lg">
                        {proj.title}
                      </h3>
                      {proj.techstack && (
                        <div className="flex flex-wrap gap-1">
                          {proj.techstack
                            .split(",")
                            .map((tech: string, techIndex: number) => (
                              <span
                                key={techIndex}
                                className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                                {tech.trim()}
                              </span>
                            ))}
                        </div>
                      )}
                      {proj.description && (
                        <p className="text-gray-700 text-sm">
                          {proj.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Empty State for all sections */}
          {!resume.summary &&
            resume.education.length === 0 &&
            resume.experience.length === 0 &&
            resume.skills.length === 0 &&
            resume.projects.length === 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
                <div className="bg-gray-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Minimal Resume
                </h3>
                <p className="text-gray-500">
                  This resume contains only basic contact information.
                </p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
