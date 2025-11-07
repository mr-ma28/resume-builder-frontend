import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Svg,
  Path,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#F9FAFB",
    padding: 0,
    fontSize: 10,
    color: "#1F2937",
  },
  container: {
    margin: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 20,
    border: "1px solid #E5E7EB",
  },
  header: {
    textAlign: "center",
    marginBottom: 15,
    paddingBottom: 15,
    borderBottom: "1px solid #E5E7EB",
  },
  headerIcon: {
    width: 50,
    height: 50,
    backgroundColor: "#4F46E5",
    borderRadius: 10,
    marginLeft: "auto",
    marginRight: "auto",
    marginBottom: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid #3B82F6",
  },
  name: {
    fontSize: 22,
    fontWeight: "600",
    color: "#4F46E5",
    marginBottom: 6,
  },
  contactContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    gap: 12,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  contactText: {
    fontSize: 9,
    color: "#333",
  },
  section: {
    marginBottom: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 12,
    border: "1px solid #E5E7EB",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 8,
  },
  sectionIcon: {
    width: 24,
    height: 24,
    borderRadius: 6,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#111827",
  },
  sectionCount: {
    fontSize: 12,
    color: "#6B7280",
    marginLeft: 4,
  },
  itemEdu: {
    marginBottom: 10,
    paddingLeft: 8,
    borderLeft: "2px solid #bddbff",
  },
  itemExp: {
    marginBottom: 10,
    paddingLeft: 8,
    borderLeft: "2px solid #b8f8cf",
  },
  itemPro: {
    marginBottom: 10,
    paddingLeft: 8,
    borderLeft: "2px solid #fccee7",
  },
  itemContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 2,
  },
  itemMain: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 1,
  },
  itemSubtitle: {
    fontSize: 9,
    color: "#6B7280",
    marginBottom: 2,
  },
  itemDescription: {
    fontSize: 8,
    color: "#374151",
    lineHeight: 1.3,
    marginTop: 2,
  },
  dateBadge: {
    backgroundColor: "#F3F4F6",
    color: "#6B7280",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    fontSize: 7,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    marginTop: 6,
  },
  skillTag: {
    backgroundColor: "#8B5CF6",
    color: "#FFFFFF",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 12,
    fontSize: 7,
  },
  techStackContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 3,
    marginTop: 4,
    marginBottom: 4,
  },
  techTag: {
    backgroundColor: "#F3F4F6",
    color: "#374151",
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
    fontSize: 6,
  },
  emptyState: {
    textAlign: "center",
    padding: 20,
    backgroundColor: "#F9FAFB",
    borderRadius: 6,
    border: "1px dashed #D1D5DB",
  },
  emptyIcon: {
    width: 30,
    height: 30,
    backgroundColor: "#E5E7EB",
    borderRadius: 15,
    marginLeft: "auto",
    marginRight: "auto",
    marginBottom: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});

interface ResumePDFProps {
  resume: any;
}

const ResumePDF: React.FC<ResumePDFProps> = ({ resume }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Svg
              viewBox="0 0 24 24"
              width="22"
              height="22"
              stroke="#FFFFFF"
              strokeWidth="2"
              fill="#4F46E5"
              strokeLinecap="round"
              strokeLinejoin="round">
              <Path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <Path d="M14 2v6h6" />
              <Path d="M16 13H8" />
              <Path d="M16 17H8" />
              <Path d="M10 9H8" />
            </Svg>
          </View>
          <Text style={styles.name}>{resume.fullName}</Text>

          <View style={styles.contactContainer}>
            {/* Email */}
            <View style={styles.contactItem}>
              <Svg
                viewBox="0 0 24 24"
                width={10}
                height={10}
                stroke="#333"
                fill="white"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round">
                <Path d="M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z" />
              </Svg>
              <Text style={styles.contactText}>{resume.email}</Text>
            </View>

            {resume.phone && (
              <>
                <Text>•</Text>
                {/* Phone */}
                <View style={styles.contactItem}>
                  <Svg
                    viewBox="0 0 24 24"
                    width={10}
                    height={10}
                    stroke="#333"
                    fill="white"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round">
                    <Path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" />
                  </Svg>
                  <Text style={styles.contactText}>{resume.phone}</Text>
                </View>
              </>
            )}
          </View>
        </View>

        {/* Summary */}
        {resume.summary && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View
                style={[styles.sectionIcon, { backgroundColor: "#DBEAFE" }]}>
                <Svg
                  viewBox="0 0 24 24"
                  width={12}
                  height={12}
                  stroke="#3B82F6"
                  fill="#DBEAFE"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <Path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <Path d="M12 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
                </Svg>
              </View>
              <Text style={styles.sectionTitle}>Professional Summary</Text>
            </View>
            <Text style={styles.itemDescription}>{resume.summary}</Text>
          </View>
        )}

        {/* Education */}
        {resume.education?.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View
                style={[styles.sectionIcon, { backgroundColor: "#DBEAFE" }]}>
                <Svg
                  viewBox="0 0 24 24"
                  width={12}
                  height={12}
                  stroke="#3B82F6"
                  fill="#DBEAFE"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <Path d="M12 7v14" />
                  <Path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
                </Svg>
              </View>
              <Text style={styles.sectionTitle}>
                Education
                <Text style={styles.sectionCount}>
                  {" "}
                  ({resume.education.length})
                </Text>
              </Text>
            </View>
            {resume.education.map((edu: any, i: number) => (
              <View key={i} style={styles.itemEdu}>
                <View style={styles.itemContent}>
                  <View style={styles.itemMain}>
                    <Text style={styles.itemTitle}>{edu.degree}</Text>
                    <Text style={styles.itemSubtitle}>{edu.school}</Text>
                    {edu.description && (
                      <Text style={styles.itemDescription}>
                        {edu.description}
                      </Text>
                    )}
                  </View>
                  {(edu.startDate || edu.endDate) && (
                    <View style={styles.dateBadge}>
                      <Text>
                        {edu.startDate} - {edu.endDate || "Present"}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Experience */}
        {resume.experience?.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View
                style={[styles.sectionIcon, { backgroundColor: "#D1FAE5" }]}>
                <Svg
                  viewBox="0 0 24 24"
                  width={12}
                  height={12}
                  stroke="#10B981"
                  fill="#D1FAE5"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <Path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                  <Path d="M2 6h20v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z" />
                </Svg>
              </View>
              <Text style={styles.sectionTitle}>
                Experience
                <Text style={styles.sectionCount}>
                  {" "}
                  ({resume.experience.length})
                </Text>
              </Text>
            </View>
            {resume.experience.map((exp: any, i: number) => (
              <View key={i} style={styles.itemExp}>
                <View style={styles.itemContent}>
                  <View style={styles.itemMain}>
                    <Text style={styles.itemTitle}>{exp.position}</Text>
                    <Text style={styles.itemSubtitle}>{exp.company}</Text>
                    {exp.description && (
                      <Text style={styles.itemDescription}>
                        {exp.description}
                      </Text>
                    )}
                  </View>
                  {(exp.startDate || exp.endDate) && (
                    <View style={styles.dateBadge}>
                      <Text>
                        {exp.startDate} - {exp.endDate || "Present"}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {resume.skills?.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View
                style={[styles.sectionIcon, { backgroundColor: "#EDE9FE" }]}>
                <Svg
                  viewBox="0 0 24 24"
                  width={12}
                  height={12}
                  stroke="#8B5CF6"
                  fill="#EDE9FE"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <Path d="M12 20v2" />
                  <Path d="M12 2v2" />
                  <Path d="M17 20v2" />
                  <Path d="M17 2v2" />
                  <Path d="M2 12h2" />
                  <Path d="M2 17h2" />
                  <Path d="M2 7h2" />
                  <Path d="M20 12h2" />
                  <Path d="M20 17h2" />
                  <Path d="M20 7h2" />
                  <Path d="M7 20v2" />
                  <Path d="M7 2v2" />
                  <Path d="M4 4h16v16H4z" />
                  <Path d="M8 8h8v8H8z" />
                </Svg>
              </View>
              <Text style={styles.sectionTitle}>
                Skills
                <Text style={styles.sectionCount}>
                  {" "}
                  ({resume.skills.length})
                </Text>
              </Text>
            </View>
            <View style={styles.skillsContainer}>
              {resume.skills.map((s: any, i: number) => (
                <Text key={i} style={styles.skillTag}>
                  {s.name}
                  {s.description && ` - ${s.description}`}
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* Projects */}
        {resume.projects?.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View
                style={[styles.sectionIcon, { backgroundColor: "#FCE7F3" }]}>
                <Svg
                  viewBox="0 0 24 24"
                  width={12}
                  height={12}
                  stroke="#EC4899"
                  fill="#FCE7F3"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <Path d="M9 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v5" />
                  <Path d="M13 12a2 2 0 1 1 0-4 2 2 0 0 1 0 4" />
                  <Path d="M18 19c-2.8 0-5-2.2-5-5v8" />
                  <Path d="M20 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4" />
                </Svg>
              </View>
              <Text style={styles.sectionTitle}>
                Projects
                <Text style={styles.sectionCount}>
                  {" "}
                  ({resume.projects.length})
                </Text>
              </Text>
            </View>
            {resume.projects.map((proj: any, i: number) => (
              <View key={i} style={styles.itemPro}>
                <View style={styles.itemContent}>
                  <View style={styles.itemMain}>
                    <Text style={styles.itemTitle}>{proj.title}</Text>
                    {proj.techstack && (
                      <View style={styles.techStackContainer}>
                        {proj.techstack
                          .split(",")
                          .map((tech: string, techIndex: number) => (
                            <Text key={techIndex} style={styles.techTag}>
                              {tech.trim()}
                            </Text>
                          ))}
                      </View>
                    )}
                    {proj.description && (
                      <Text style={styles.itemDescription}>
                        {proj.description}
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Empty State */}
        {!resume.summary &&
          !resume.education?.length &&
          !resume.experience?.length &&
          !resume.skills?.length &&
          !resume.projects?.length && (
            <View style={[styles.section, styles.emptyState]}>
              <View style={styles.emptyIcon}>
                <Svg
                  viewBox="0 0 24 24"
                  width={16}
                  height={16}
                  stroke="#9CA3AF"
                  fill="none"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <Path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <Path d="M14 2v6h6" />
                  <Path d="M16 13H8" />
                  <Path d="M16 17H8" />
                  <Path d="M10 9H8" />
                </Svg>
              </View>
              <Text style={{ fontSize: 10, color: "#6B7280", marginBottom: 4 }}>
                Minimal Resume
              </Text>
              <Text style={{ fontSize: 8, color: "#9CA3AF" }}>
                This resume contains only basic contact information.
              </Text>
            </View>
          )}
      </View>
    </Page>
  </Document>
);

export default ResumePDF;
