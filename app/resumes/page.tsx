"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  Edit3,
  Trash2,
  Plus,
  FileText,
  User,
  Mail,
  Phone,
  Calendar,
} from "lucide-react";
import axiosClient from "../lib/axiosClient";

interface Resume {
  id: number;
  documentId: string; // Add documentId field
  fullName: string;
  email: string;
  phone?: string;
  summary?: string;
  createdAt: string;
}

export default function ResumesPage() {
  const router = useRouter();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      router.push("/login");
      return;
    }

    async function fetchResumes() {
      try {
        const res = await axiosClient.get("/resumes");
        const apiData = res.data.data || res.data;

        const data = apiData.map((item: any) => ({
          id: item.id, // Use the actual id from Strapi
          documentId: item.attributes?.documentId || item.documentId, // Store documentId separately
          fullName: item.attributes?.fullName || item.fullName,
          email: item.attributes?.email || item.email,
          phone: item.attributes?.phone || item.phone,
          summary: item.attributes?.summary || item.summary,
          createdAt: item.attributes?.createdAt || item.createdAt,
        }));

        setResumes(data);
      } catch (err: any) {
        console.error("❌ Error fetching resumes:", err);
        if (err.response?.status === 403 || err.response?.status === 401) {
          setError("Session expired. Please log in again.");
          setTimeout(() => router.push("/login"), 1500);
        } else {
          setError("Failed to fetch resumes. Try again later.");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchResumes();
  }, [router]);

  const handleDelete = async (documentId: any) => {
    if (!confirm("Are you sure you want to delete this resume?")) return;
    try {
      await axiosClient.delete(`/resumes/${documentId}`);
      setResumes((prev) => prev.filter((r) => r.documentId !== documentId));
    } catch (err) {
      console.error(err);
      alert("Failed to delete resume");
    }
  };

  // Resumes page mein sirf yeh change karein:
  const handleEditClick = (resume: Resume) => {
    router.push(`/edit/${resume.documentId}`);
  };

  const handleViewClick = (resume: Resume) => {
    console.log("View clicked for resume:", {
      id: resume.id,
      documentId: resume.documentId,
      fullName: resume.fullName,
    });
    router.push(`/resumes/${resume.documentId}`);
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-84px)] bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Loading Resumes
          </h2>
          <p className="text-gray-500">Fetching your professional resumes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-84px)] bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="bg-red-100 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <div className="text-red-500 text-2xl">⚠️</div>
          </div>
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-84px)] bg-gradient-to-br from-gray-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-2xl shadow-lg">
                <FileText className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
              My Resumes
            </h1>
            <p className="text-gray-600 text-lg">
              Manage and view all your professional resumes in one place
            </p>

            {/* Debug Info - Remove in production
            <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-sm text-yellow-700">
                <strong>Debug:</strong> Found {resumes.length} resumes. IDs:{" "}
                {resumes.map((r) => r.id).join(", ")}
              </p>
            </div> */}
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-gray-500">
            {resumes.length} {resumes.length === 1 ? "resume" : "resumes"} found
          </div>
          <button
            onClick={() => router.push("/create-resume")}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
            <Plus className="w-5 h-5" />
            Create New Resume
          </button>
        </div>

        {/* Resumes Grid/Table */}
        {resumes.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
            <div className="bg-gray-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Resumes Yet
            </h3>
            <p className="text-gray-500 mb-6">
              Create your first professional resume to get started
            </p>
            <button
              onClick={() => router.push("/create-resume")}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300">
              Create Your First Resume
            </button>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {resumes.map((resume, index) => (
              <div
                key={resume.id}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                {/* Resume Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-start justify-between mb-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      #{index + 1}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2 truncate">
                    {resume.fullName}
                  </h3>
                  <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{resume.email}</span>
                  </div>
                  {resume.phone && (
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <Phone className="w-4 h-4" />
                      <span>{resume.phone}</span>
                    </div>
                  )}
                </div>

                {/* Resume Details */}
                <div className="p-6">
                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Created {new Date(resume.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {resume.summary && (
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                      {resume.summary}
                    </p>
                  )}
                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewClick(resume)}
                      className="flex-1 flex items-center justify-center gap-2 bg-green-100 text-green-700 px-3 py-2 rounded-lg font-medium hover:bg-green-200 transition-colors duration-200 text-sm">
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                    <button
                      onClick={() => handleEditClick(resume)}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-100 text-blue-700 px-3 py-2 rounded-lg font-medium hover:bg-blue-200 transition-colors duration-200 text-sm">
                      <Edit3 className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(resume.documentId)}
                      className="flex-1 flex items-center justify-center gap-2 bg-red-100 text-red-700 px-3 py-2 rounded-lg font-medium hover:bg-red-200 transition-colors duration-200 text-sm">
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                  {/* Debug Info - Remove in production
                  <div className="mt-3 p-2 bg-gray-100 rounded text-xs">
                    <p>ID: {resume.id}</p>
                    <p>Doc ID: {resume.documentId}</p>
                  </div> */}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Mobile Table View (Fallback) */}
        {resumes.length > 0 && (
          <div className="lg:hidden mt-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                All Resumes (List View)
              </h3>
              <div className="space-y-4">
                {resumes.map((resume, index) => (
                  <div
                    key={resume.id}
                    className="border border-gray-200 rounded-xl p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-800">
                        {resume.fullName}
                      </h4>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        #{index + 1}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{resume.email}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewClick(resume)}
                        className="flex-1 bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
                        View
                      </button>
                      <button
                        onClick={() => handleEditClick(resume)}
                        className="flex-1 bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(resume.id)}
                        className="flex-1 bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-medium">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
