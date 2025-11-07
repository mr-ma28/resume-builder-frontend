"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Save,
  ArrowLeft,
  User,
  Mail,
  Phone,
  FileText,
  BookOpen,
  Briefcase,
  Code,
  FolderGit2,
  Plus,
  Trash2,
  Eye,
  Cpu, // Added Cpu import
} from "lucide-react";
import axiosClient from "./../../../lib/axiosClient";

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
  techStack: string;
}

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  summary: string;
  education: Education[];
  experience: Experience[];
  skills: Skill[];
  projects: Project[];
}

export default function EditResumePage() {
  const { id } = useParams();
  const router = useRouter();

  const [resumeId, setResumeId] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    summary: "",
    education: [
      { school: "", degree: "", startDate: "", endDate: "", description: "" },
    ],
    experience: [
      {
        company: "",
        position: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ],
    skills: [{ name: "", description: "" }],
    projects: [{ title: "", description: "", techStack: "" }],
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const res = await axiosClient.get(
          `/resumes?filters[documentId][$eq]=${id}&populate=*`
        );

        const data = res.data?.data?.[0];
        if (!data) {
          setMessage("❌ Resume not found");
          return;
        }

        setResumeId(data.id);

        const resumeData: FormData = {
          fullName: data.fullName || "",
          email: data.email || "",
          phone: data.phone || "",
          summary: data.summary || "",
          education:
            data.education?.length > 0
              ? data.education
              : [
                  {
                    school: "",
                    degree: "",
                    startDate: "",
                    endDate: "",
                    description: "",
                  },
                ],
          experience:
            data.experience?.length > 0
              ? data.experience
              : [
                  {
                    company: "",
                    position: "",
                    startDate: "",
                    endDate: "",
                    description: "",
                  },
                ],
          skills:
            data.skills?.length > 0
              ? data.skills
              : [{ name: "", description: "" }],
          projects:
            data.projects?.length > 0
              ? data.projects
              : [{ title: "", description: "", techStack: "" }],
        };

        setFormData(resumeData);
      } catch (err: any) {
        console.error("Error fetching resume:", err);
        setMessage("❌ Failed to load resume data");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchResume();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleArrayChange = (
    section: keyof FormData,
    index: number,
    field: string,
    value: string
  ) => {
    const updatedArray = [...(formData[section] as any[])];
    updatedArray[index][field] = value;
    setFormData({ ...formData, [section]: updatedArray });
  };

  const handleAdd = (section: keyof FormData) => {
    const newItem =
      section === "education"
        ? {
            school: "",
            degree: "",
            startDate: "",
            endDate: "",
            description: "",
          }
        : section === "experience"
        ? {
            company: "",
            position: "",
            startDate: "",
            endDate: "",
            description: "",
          }
        : section === "projects"
        ? { title: "", description: "", techStack: "" }
        : { name: "", description: "" };

    setFormData({
      ...formData,
      [section]: [...(formData[section] as any[]), newItem],
    });
  };

  const handleDelete = (section: keyof FormData, index: number) => {
    if (formData[section].length <= 1) return;
    const updatedArray = [...(formData[section] as any[])];
    updatedArray.splice(index, 1);
    setFormData({ ...formData, [section]: updatedArray });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      if (!resumeId) throw new Error("Resume ID not found");

      const payload = {
        data: {
          fullName: formData.fullName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          summary: formData.summary.trim(),
          education: formData.education,
          experience: formData.experience,
          skills: formData.skills,
          projects: formData.projects.map((proj) => ({
            title: proj.title,
            description: proj.description,
            techStack: proj.techStack,
          })),
        },
      };

      await axiosClient.put(`/api/resumes/${resumeId}`, payload);
      setMessage("✅ Resume updated successfully!");
      setTimeout(() => router.push(`/resumes/${id}`), 1500);
    } catch (err: any) {
      console.error("Error updating resume:", err);
      setMessage("❌ Failed to update resume");
    } finally {
      setSaving(false);
    }
  };

  const hasData = Object.values(formData).some((val) => {
    if (Array.isArray(val)) {
      return val.some((item) => Object.values(item).some((v) => v !== ""));
    }
    return val !== "";
  });

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-84px)] flex justify-center items-center bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-700 text-lg font-medium">
            Loading resume data...
          </p>
        </div>
      </div>
    );
  }

  if (message && message.includes("❌") && !formData.fullName) {
    return (
      <div className="min-h-[calc(100vh-84px)] flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 p-6 text-center">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 bg-red-600 rounded-full"></div>
          </div>
          <p className="text-red-600 text-xl font-semibold mb-4">{message}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-84px)] bg-gradient-to-br from-gray-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-2xl shadow-lg">
                <FileText className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
              Edit Professional Resume
            </h1>
            <p className="text-gray-600 text-lg">
              Update and refine your resume with our easy-to-use form
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Form Section */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8 border border-gray-100">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Information */}
                <section className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      Basic Information
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        name="fullName"
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone
                      </label>
                      <input
                        name="phone"
                        placeholder="Enter your phone number"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Professional Summary
                    </label>
                    <textarea
                      name="summary"
                      placeholder="Briefly describe your professional background and career objectives..."
                      value={formData.summary}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 resize-none"
                    />
                  </div>
                </section>

                {/* Education */}
                <DynamicSection
                  title="Education"
                  icon={<BookOpen className="w-5 h-5 text-blue-600" />}
                  items={formData.education}
                  fields={[
                    {
                      name: "school",
                      label: "School/University",
                      type: "text",
                    },
                    {
                      name: "degree",
                      label: "Degree/Certificate",
                      type: "text",
                    },
                    { name: "startDate", label: "Start Date", type: "date" },
                    { name: "endDate", label: "End Date", type: "date" },
                    {
                      name: "description",
                      label: "Description",
                      type: "textarea",
                    },
                  ]}
                  onAdd={() => handleAdd("education")}
                  onDelete={(index) => handleDelete("education", index)}
                  onChange={(index, field, value) =>
                    handleArrayChange("education", index, field, value)
                  }
                />

                {/* Experience */}
                <DynamicSection
                  title="Experience"
                  icon={<Briefcase className="w-5 h-5 text-green-600" />}
                  items={formData.experience}
                  fields={[
                    { name: "company", label: "Company", type: "text" },
                    { name: "position", label: "Position", type: "text" },
                    { name: "startDate", label: "Start Date", type: "date" },
                    { name: "endDate", label: "End Date", type: "date" },
                    {
                      name: "description",
                      label: "Description",
                      type: "textarea",
                    },
                  ]}
                  onAdd={() => handleAdd("experience")}
                  onDelete={(index) => handleDelete("experience", index)}
                  onChange={(index, field, value) =>
                    handleArrayChange("experience", index, field, value)
                  }
                />

                {/* Skills */}
                <DynamicSection
                  title="Skills"
                  icon={<Code className="w-5 h-5 text-purple-600" />}
                  items={formData.skills}
                  fields={[
                    { name: "name", label: "Skill Name", type: "text" },
                    {
                      name: "description",
                      label: "Description/Proficiency",
                      type: "text",
                    },
                  ]}
                  onAdd={() => handleAdd("skills")}
                  onDelete={(index) => handleDelete("skills", index)}
                  onChange={(index, field, value) =>
                    handleArrayChange("skills", index, field, value)
                  }
                />

                {/* Projects */}
                <DynamicSection
                  title="Projects"
                  icon={<FolderGit2 className="w-5 h-5 text-pink-600" />}
                  items={formData.projects}
                  fields={[
                    { name: "title", label: "Project Title", type: "text" },
                    {
                      name: "description",
                      label: "Project Description",
                      type: "textarea",
                    },
                    {
                      name: "techStack",
                      label: "Technologies Used",
                      type: "text",
                    },
                  ]}
                  onAdd={() => handleAdd("projects")}
                  onDelete={(index) => handleDelete("projects", index)}
                  onChange={(index, field, value) =>
                    handleArrayChange("projects", index, field, value)
                  }
                />

                {/* Submit Button */}
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => router.push(`/resumes/${id}`)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 w-full sm:w-auto">
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 w-full sm:w-auto justify-center">
                    {saving ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Updating Resume...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        <span>Update Resume</span>
                      </>
                    )}
                  </button>
                </div>

                {message && (
                  <div
                    className={`p-4 rounded-xl border ${
                      message.includes("❌")
                        ? "bg-red-50 border-red-200 text-red-700"
                        : "bg-green-50 border-green-200 text-green-700"
                    }`}>
                    <p className="font-medium">{message}</p>
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Preview Section */}
          <div className="lg:w-96 xl:w-[500px]">
            <div className=" top-6 bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              {/* Header - Same as View Resume Page */}
              <div className="text-center mb-6">
                <div className="flex justify-center mb-4">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-2xl shadow-lg">
                    <FileText className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
                  Live Preview
                </h2>
                <p className="text-gray-600 text-sm">
                  Real-time resume preview as you type
                </p>
              </div>

              {hasData ? (
                <div className="space-y-6">
                  {/* Basic Info - Same as View Resume */}
                  <div className="text-center border-b border-gray-200 pb-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-3">
                      {formData.fullName || "Your Name"}
                    </h1>
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-gray-600">
                      {formData.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          <span className="text-sm lg:text-base">
                            {formData.email}
                          </span>
                        </div>
                      )}
                      {formData.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          <span className="text-sm lg:text-base">
                            {formData.phone}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Summary */}
                  {formData.summary && (
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
                        {formData.summary}
                      </p>
                    </section>
                  )}

                  {/* Education */}
                  {formData.education &&
                    formData.education.some(
                      (edu) => edu.school || edu.degree
                    ) && (
                      <section className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="bg-blue-100 p-2 rounded-lg">
                            <BookOpen className="w-5 h-5 text-blue-600" />
                          </div>
                          <h2 className="text-2xl font-bold text-gray-800">
                            Education (
                            {
                              formData.education.filter(
                                (edu) => edu.school || edu.degree
                              ).length
                            }
                            )
                          </h2>
                        </div>
                        <div className="space-y-4">
                          {formData.education
                            .filter((edu) => edu.school || edu.degree)
                            .map((edu, i) => (
                              <div
                                key={i}
                                className="border-l-4 border-blue-200 pl-4 py-2">
                                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-2">
                                  <div className="flex-1">
                                    <h3 className="font-semibold text-gray-800 text-lg">
                                      {edu.degree}
                                    </h3>
                                    <p className="text-gray-600">
                                      {edu.school}
                                    </p>
                                    {edu.description && (
                                      <p className="text-gray-700 mt-2 text-sm">
                                        {edu.description}
                                      </p>
                                    )}
                                  </div>
                                  {(edu.startDate || edu.endDate) && (
                                    <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full whitespace-nowrap">
                                      <span>
                                        {edu.startDate} -{" "}
                                        {edu.endDate || "Present"}
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
                  {formData.experience &&
                    formData.experience.some(
                      (exp) => exp.company || exp.position
                    ) && (
                      <section className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="bg-green-100 p-2 rounded-lg">
                            <Briefcase className="w-5 h-5 text-green-600" />
                          </div>
                          <h2 className="text-2xl font-bold text-gray-800">
                            Experience (
                            {
                              formData.experience.filter(
                                (exp) => exp.company || exp.position
                              ).length
                            }
                            )
                          </h2>
                        </div>
                        <div className="space-y-4">
                          {formData.experience
                            .filter((exp) => exp.company || exp.position)
                            .map((exp, i) => (
                              <div
                                key={i}
                                className="border-l-4 border-green-200 pl-4 py-2">
                                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-2">
                                  <div className="flex-1">
                                    <h3 className="font-semibold text-gray-800 text-lg">
                                      {exp.position}
                                    </h3>
                                    <p className="text-gray-600">
                                      {exp.company}
                                    </p>
                                    {exp.description && (
                                      <p className="text-gray-700 mt-2 text-sm">
                                        {exp.description}
                                      </p>
                                    )}
                                  </div>
                                  {(exp.startDate || exp.endDate) && (
                                    <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full whitespace-nowrap">
                                      <span>
                                        {exp.startDate} -{" "}
                                        {exp.endDate || "Present"}
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
                  {formData.skills &&
                    formData.skills.some((skill) => skill.name) && (
                      <section className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="bg-purple-100 p-2 rounded-lg">
                            <Cpu className="w-5 h-5 text-purple-600" />
                          </div>
                          <h2 className="text-2xl font-bold text-gray-800">
                            Skills (
                            {
                              formData.skills.filter((skill) => skill.name)
                                .length
                            }
                            )
                          </h2>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {formData.skills
                            .filter((skill) => skill.name)
                            .map((skill, i) => (
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
                  {formData.projects &&
                    formData.projects.some((proj) => proj.title) && (
                      <section className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="bg-pink-100 p-2 rounded-lg">
                            <FolderGit2 className="w-5 h-5 text-pink-600" />
                          </div>
                          <h2 className="text-2xl font-bold text-gray-800">
                            Projects (
                            {
                              formData.projects.filter((proj) => proj.title)
                                .length
                            }
                            )
                          </h2>
                        </div>
                        <div className="space-y-4">
                          {formData.projects
                            .filter((proj) => proj.title)
                            .map((proj, i) => (
                              <div
                                key={i}
                                className="border-l-4 border-pink-200 pl-4 py-2">
                                <div className="space-y-2">
                                  <h3 className="font-semibold text-gray-800 text-lg">
                                    {proj.title}
                                  </h3>
                                  {proj.techStack && (
                                    <div className="flex flex-wrap gap-1">
                                      {proj.techStack
                                        .split(",")
                                        .map((tech, techIndex) => (
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
                  {!formData.summary &&
                    !formData.education.some(
                      (edu) => edu.school || edu.degree
                    ) &&
                    !formData.experience.some(
                      (exp) => exp.company || exp.position
                    ) &&
                    !formData.skills.some((skill) => skill.name) &&
                    !formData.projects.some((proj) => proj.title) && (
                      <div className="bg-white rounded-2xl shadow-lg p-8 text-center border border-gray-100">
                        <div className="bg-gray-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                          <FileText className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">
                          Minimal Resume
                        </h3>
                        <p className="text-gray-500 text-sm">
                          This resume contains only basic contact information.
                        </p>
                      </div>
                    )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="bg-gray-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <FileText className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Preview
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Start filling the form to see your resume preview here
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Dynamic Section Component (Same as Create Page)
interface DynamicSectionProps {
  title: string;
  icon: React.ReactNode;
  items: any[];
  fields: { name: string; label: string; type: string }[];
  onAdd: () => void;
  onDelete: (index: number) => void;
  onChange: (index: number, field: string, value: string) => void;
}

function DynamicSection({
  title,
  icon,
  items,
  fields,
  onAdd,
  onDelete,
  onChange,
}: DynamicSectionProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gray-100 p-2 rounded-lg">{icon}</div>
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-xl font-semibold hover:bg-blue-200 transition-colors duration-200">
          <Plus className="w-4 h-4" />
          Add
        </button>
      </div>

      <div className="space-y-4">
        {items.map((item, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-xl p-4 bg-gray-50 relative">
            {items.length > 1 && (
              <button
                type="button"
                onClick={() => onDelete(index)}
                className="absolute top-3 right-3 text-red-500 hover:text-red-700 transition-colors duration-200">
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {fields.map((field) => (
                <div
                  key={field.name}
                  className={field.type === "textarea" ? "md:col-span-2" : ""}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {field.label}
                  </label>
                  {field.type === "textarea" ? (
                    <textarea
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                      value={item[field.name]}
                      onChange={(e) =>
                        onChange(index, field.name, e.target.value)
                      }
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 resize-none"
                    />
                  ) : (
                    <input
                      type={field.type}
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                      value={item[field.name]}
                      onChange={(e) =>
                        onChange(index, field.name, e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// Resume Preview Component (Same as Create Page)
interface ResumePreviewProps {
  data: FormData;
}

function ResumePreview({ data }: ResumePreviewProps) {
  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <div className="text-center border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          {data.fullName || "Your Name"}
        </h1>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 text-gray-600 text-sm">
          {data.email && (
            <div className="flex items-center gap-1">
              <Mail className="w-4 h-4" />
              <span>{data.email}</span>
            </div>
          )}
          {data.phone && (
            <div className="flex items-center gap-1">
              <Phone className="w-4 h-4" />
              <span>{data.phone}</span>
            </div>
          )}
        </div>
        {data.summary && (
          <p className="text-gray-700 text-sm mt-3 text-left">{data.summary}</p>
        )}
      </div>

      {/* Education */}
      {data.education.some((edu) =>
        Object.values(edu).some((v) => v !== "")
      ) && (
        <div>
          <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-600" />
            Education
          </h3>
          <div className="space-y-2">
            {data.education
              .filter((edu) => Object.values(edu).some((v) => v !== ""))
              .map((edu, i) => (
                <div key={i} className="text-sm">
                  <div className="font-medium text-gray-800">
                    {edu.school} {edu.degree && `- ${edu.degree}`}
                  </div>
                  {(edu.startDate || edu.endDate) && (
                    <div className="text-gray-600 text-xs">
                      {edu.startDate} - {edu.endDate || "Present"}
                    </div>
                  )}
                  {edu.description && (
                    <div className="text-gray-700 mt-1">{edu.description}</div>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {data.experience.some((exp) =>
        Object.values(exp).some((v) => v !== "")
      ) && (
        <div>
          <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-green-600" />
            Experience
          </h3>
          <div className="space-y-2">
            {data.experience
              .filter((exp) => Object.values(exp).some((v) => v !== ""))
              .map((exp, i) => (
                <div key={i} className="text-sm">
                  <div className="font-medium text-gray-800">
                    {exp.position} at {exp.company}
                  </div>
                  {(exp.startDate || exp.endDate) && (
                    <div className="text-gray-600 text-xs">
                      {exp.startDate} - {exp.endDate || "Present"}
                    </div>
                  )}
                  {exp.description && (
                    <div className="text-gray-700 mt-1">{exp.description}</div>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {data.skills.some((s) => s.name) && (
        <div>
          <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
            <Code className="w-4 h-4 text-purple-600" />
            Skills
          </h3>
          <div className="flex flex-wrap gap-1">
            {data.skills
              .filter((s) => s.name)
              .map((s, i) => (
                <span
                  key={i}
                  className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                  {s.name}
                </span>
              ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {data.projects.some((p) => p.title) && (
        <div>
          <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
            <FolderGit2 className="w-4 h-4 text-pink-600" />
            Projects
          </h3>
          <div className="space-y-2">
            {data.projects
              .filter((p) => p.title)
              .map((p, i) => (
                <div key={i} className="text-sm">
                  <div className="font-medium text-gray-800">{p.title}</div>
                  {p.techStack && (
                    <div className="text-gray-600 text-xs">{p.techStack}</div>
                  )}
                  {p.description && (
                    <div className="text-gray-700 mt-1">{p.description}</div>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
