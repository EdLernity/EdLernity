import * as XLSX from "xlsx";

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function studentName(student) {
  if (!student) return "";
  return `${student.firstName || ""} ${student.lastName || ""}`.trim();
}

export function exportInternshipEnrollmentsToXlsx(enrollments, filename = "internship-enrollments.xlsx") {
  const rows = enrollments.map((row, index) => ({
    "#": index + 1,
    "Student Name": studentName(row.student),
    Email: row.student?.email || "",
    Phone: row.student?.phone || "",
    Program: row.programTitle || row.internshipSlug,
    "Program Slug": row.internshipSlug,
    Trainer: row.trainer?.email || "Unassigned",
    "Enrolled On": formatDate(row.enrolledAt),
    Source: row.enrollmentSource || "",
    "Certificate Status": row.certificate?.issued ? "Issued" : "Pending",
    "Certificate UUID": row.certificate?.uuid || "",
    "Certificate Name": row.certificate?.studentName || "",
    "Issued On": formatDate(row.certificate?.issuedAt),
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  worksheet["!cols"] = [
    { wch: 4 },
    { wch: 22 },
    { wch: 28 },
    { wch: 14 },
    { wch: 32 },
    { wch: 24 },
    { wch: 28 },
    { wch: 14 },
    { wch: 12 },
    { wch: 16 },
    { wch: 38 },
    { wch: 22 },
    { wch: 14 },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Internship Users");
  XLSX.writeFile(workbook, filename);
}
