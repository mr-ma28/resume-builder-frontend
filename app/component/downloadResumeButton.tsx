"use client";

import { pdf } from "@react-pdf/renderer";
import { Download } from "lucide-react";
import ResumePDF from "./resumePDF"; // 👈 your component

interface DownloadPDFButtonProps {
  resume: any; // your resume data
}

export default function DownloadPDFButton({ resume }: DownloadPDFButtonProps) {
  const generatePDF = async () => {
    try {
      // Generate PDF from ResumePDF component
      const blob = await pdf(<ResumePDF resume={resume} />).toBlob();

      // Create a downloadable link
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${resume.fullName || "resume"}.pdf`;
      link.click();

      // Cleanup
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("❌ PDF generation failed:", error);
    }
  };

  return (
    <button
      onClick={generatePDF}
      className="flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
      <Download className="w-5 h-5" />
      Download PDF
    </button>
  );
}
