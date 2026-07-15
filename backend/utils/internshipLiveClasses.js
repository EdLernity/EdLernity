/** Default: 3 live classes per internship week */
const DEFAULT_CLASSES_PER_WEEK = 3;

const DEFAULT_CLASS_SLOTS = [
  { day: "Monday", time: "7:00 PM - 8:30 PM IST" },
  { day: "Wednesday", time: "7:00 PM - 8:30 PM IST" },
  { day: "Friday", time: "7:00 PM - 8:30 PM IST" },
];

function emptyClassAssignment() {
  return {
    title: "",
    dueLabel: "",
    instructions: "",
    passingScore: 8,
    questions: [],
  };
}

function normalizePassingScore(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 8;
  return Math.min(50, Math.max(1, Math.round(n)));
}

function isAssignmentPassed(mcqScore, mcqTotal, passingScore) {
  const total = Number(mcqTotal) || 0;
  const score = Number(mcqScore) || 0;
  const passAt = normalizePassingScore(passingScore);
  if (total <= 0) return true;
  return score >= Math.min(passAt, total);
}

function normalizeClassAssignment(raw) {
  const row = raw || {};
  const questions = Array.isArray(row.questions)
    ? row.questions.map((q, index) => ({
        id: q.id || `q-${index + 1}`,
        type: q.type === "text" ? "text" : "mcq",
        prompt: q.prompt || "",
        options: Array.isArray(q.options) ? q.options.map(String) : [],
        correctOptionIndex:
          typeof q.correctOptionIndex === "number" ? q.correctOptionIndex : 0,
      }))
    : [];
  return {
    title: row.title || "",
    dueLabel: row.dueLabel || "",
    instructions: row.instructions || "",
    passingScore: normalizePassingScore(row.passingScore),
    questions,
  };
}

function createLiveClass({
  weekLabel,
  classIndex = 0,
  title,
  scheduleDay,
  scheduleTime,
  meetingLink,
  recordingUrl,
  noteTitle,
  noteUrl,
  assignment,
} = {}) {
  const slot = DEFAULT_CLASS_SLOTS[classIndex % DEFAULT_CLASS_SLOTS.length];
  return {
    id: `class-${Date.now()}-${classIndex}-${Math.random().toString(36).slice(2, 7)}`,
    title: title || `${weekLabel || "Week"} · Class ${classIndex + 1}`,
    meetingLink: meetingLink || "",
    recordingUrl: recordingUrl || "",
    noteTitle: noteTitle || "",
    noteUrl: noteUrl || "",
    scheduleDay: scheduleDay || slot.day,
    scheduleTime: scheduleTime || slot.time,
    assignment: normalizeClassAssignment(assignment || emptyClassAssignment()),
  };
}

function createDefaultLiveClasses(weekLabel, count = DEFAULT_CLASSES_PER_WEEK) {
  return Array.from({ length: count }, (_, index) =>
    createLiveClass({ weekLabel, classIndex: index })
  );
}

function mapClassRow(row, index, weekLabel, legacyNotes) {
  const legacyNote = legacyNotes[index] || {};
  return {
    id: row.id || `class-${index + 1}`,
    title: row.title || `${weekLabel} · Class ${index + 1}`,
    meetingLink: row.meetingLink || "",
    recordingUrl: row.recordingUrl || "",
    noteTitle: row.noteTitle || legacyNote.title || "",
    noteUrl: row.noteUrl || legacyNote.url || "",
    scheduleDay: row.scheduleDay || "",
    scheduleTime: row.scheduleTime || "",
    assignment: normalizeClassAssignment(row.assignment || emptyClassAssignment()),
  };
}

/**
 * Prefer liveClasses[]. Fall back to legacy single liveClass.
 * Migrates week-level recording.url, notes[], and non-project assignment onto classes.
 */
function normalizeLiveClasses(module, { minCount = 0, padDefaults = false } = {}) {
  const weekLabel = module?.week || "Week";
  const legacyRecordingUrl = module?.recording?.url || "";
  const legacyNotes = Array.isArray(module?.notes) ? module.notes : [];
  const isProjectWeek = Boolean(module?.isCapstone);
  const legacyAssignment =
    !isProjectWeek && module?.assignment && (module.assignment.title || module.assignment.instructions)
      ? normalizeClassAssignment({
          title: module.assignment.title || "",
          dueLabel: module.assignment.dueLabel || "",
          instructions: module.assignment.instructions || "",
          questions: module.assignment.questions || [],
        })
      : null;

  let classes = Array.isArray(module?.liveClasses)
    ? module.liveClasses.map((row, index) => mapClassRow(row, index, weekLabel, legacyNotes))
    : [];

  if (!classes.length && module?.liveClass) {
    classes = [mapClassRow(module.liveClass, 0, weekLabel, legacyNotes)];
    if (!classes[0].recordingUrl && legacyRecordingUrl) {
      classes[0].recordingUrl = legacyRecordingUrl;
    }
  }

  if (legacyRecordingUrl && classes.length && !classes.some((row) => row.recordingUrl)) {
    classes = classes.map((row, index) =>
      index === 0 ? { ...row, recordingUrl: legacyRecordingUrl } : row
    );
  }

  if (legacyNotes.length && classes.length) {
    classes = classes.map((row, index) => {
      if (row.noteTitle || row.noteUrl) return row;
      const legacyNote = legacyNotes[index];
      if (!legacyNote) return row;
      return {
        ...row,
        noteTitle: legacyNote.title || "",
        noteUrl: legacyNote.url || "",
      };
    });
  }

  // Migrate old week-level practice assignment onto Class 1 when no class has questions yet.
  if (
    legacyAssignment &&
    classes.length &&
    !classes.some((row) => (row.assignment?.questions || []).length || row.assignment?.title)
  ) {
    classes = classes.map((row, index) =>
      index === 0 ? { ...row, assignment: legacyAssignment } : row
    );
  }

  if (padDefaults && classes.length < minCount) {
    while (classes.length < minCount) {
      classes.push(createLiveClass({ weekLabel, classIndex: classes.length }));
    }
  }

  return classes;
}

/** Keep legacy liveClass + recording + notes in sync with liveClasses for older UIs. */
function syncLegacyLiveClass(module) {
  const classes = normalizeLiveClasses(module);
  const primary = classes[0] || createLiveClass({ weekLabel: module?.week, classIndex: 0 });
  const firstRecordingUrl = classes.find((row) => row.recordingUrl)?.recordingUrl || "";
  const notesFromClasses = classes
    .filter((row) => row.noteTitle || row.noteUrl)
    .map((row) => ({
      title: row.noteTitle || "Class notes",
      url: row.noteUrl || "",
      type: "pdf",
      available: Boolean(row.noteUrl),
    }));

  const isProjectWeek = Boolean(module?.isCapstone);
  let weekAssignment = module.assignment || {};
  if (isProjectWeek) {
    weekAssignment = {
      title: weekAssignment.title || "",
      dueLabel: weekAssignment.dueLabel || "",
      instructions: weekAssignment.instructions || "",
      type: "project",
      githubRequired: true,
    };
  }

  return {
    ...module,
    liveClasses: classes,
    liveClass: {
      id: primary.id,
      title: primary.title,
      meetingLink: primary.meetingLink || "",
      recordingUrl: primary.recordingUrl || "",
      noteTitle: primary.noteTitle || "",
      noteUrl: primary.noteUrl || "",
      scheduleDay: primary.scheduleDay || "",
      scheduleTime: primary.scheduleTime || "",
      assignment: primary.assignment || emptyClassAssignment(),
    },
    recording: {
      ...(module.recording || {}),
      title: module.recording?.title || `${module.week || "Week"} Recording`,
      url: firstRecordingUrl,
      duration: module.recording?.duration || "1h 45m",
      available: Boolean(firstRecordingUrl),
    },
    notes: notesFromClasses.length ? notesFromClasses : module.notes || [],
    assignment: weekAssignment,
  };
}

function normalizeModulesForSave(modules = []) {
  return modules.map((mod, index) =>
    syncLegacyLiveClass({
      ...mod,
      weekIndex: mod.weekIndex ?? index,
    })
  );
}

function normalizeModulesForEdit(modules = []) {
  return modules.map((mod, index) => {
    const withClasses = syncLegacyLiveClass({
      ...mod,
      weekIndex: mod.weekIndex ?? index,
    });
    const weekLabel = withClasses.week || `Week ${index + 1}`;
    let liveClasses = withClasses.liveClasses || [];

    if (liveClasses.length < DEFAULT_CLASSES_PER_WEEK) {
      while (liveClasses.length < DEFAULT_CLASSES_PER_WEEK) {
        liveClasses.push(createLiveClass({ weekLabel, classIndex: liveClasses.length }));
      }
    }

    return {
      ...withClasses,
      liveClasses,
      liveClass: {
        id: liveClasses[0].id,
        title: liveClasses[0].title,
        meetingLink: liveClasses[0].meetingLink || "",
        recordingUrl: liveClasses[0].recordingUrl || "",
        noteTitle: liveClasses[0].noteTitle || "",
        noteUrl: liveClasses[0].noteUrl || "",
        scheduleDay: liveClasses[0].scheduleDay || "",
        scheduleTime: liveClasses[0].scheduleTime || "",
        assignment: liveClasses[0].assignment || emptyClassAssignment(),
      },
    };
  });
}

module.exports = {
  DEFAULT_CLASSES_PER_WEEK,
  DEFAULT_CLASS_SLOTS,
  emptyClassAssignment,
  normalizeClassAssignment,
  normalizePassingScore,
  isAssignmentPassed,
  createLiveClass,
  createDefaultLiveClasses,
  normalizeLiveClasses,
  syncLegacyLiveClass,
  normalizeModulesForSave,
  normalizeModulesForEdit,
};
