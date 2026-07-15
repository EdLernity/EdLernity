/**
 * Attendance is only count-able during the scheduled class window.
 * Schedule uses weekday + time range strings (e.g. Monday, "7:00 PM - 8:30 PM IST").
 * All calculations use Asia/Kolkata (IST).
 */

const ATTENDANCE_TZ = "Asia/Kolkata";
const OPEN_BEFORE_MS = 15 * 60 * 1000; // 15 minutes before start
const CLOSE_AFTER_MS = 30 * 60 * 1000; // 30 minutes after end (or start+2h)

const WEEKDAY_ALIASES = {
  sun: 0,
  sunday: 0,
  mon: 1,
  monday: 1,
  tue: 2,
  tues: 2,
  tuesday: 2,
  wed: 3,
  wednesday: 3,
  thu: 4,
  thur: 4,
  thurs: 4,
  thursday: 4,
  fri: 5,
  friday: 5,
  sat: 6,
  saturday: 6,
};

function getIstParts(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: ATTENDANCE_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);

  const map = Object.fromEntries(parts.map((p) => [p.type, p.value]));
  const weekdayKey = String(map.weekday || "").toLowerCase();
  const weekday =
    WEEKDAY_ALIASES[weekdayKey] ??
    WEEKDAY_ALIASES[weekdayKey.slice(0, 3)] ??
    null;

  return {
    year: Number(map.year),
    month: Number(map.month),
    day: Number(map.day),
    hour: Number(map.hour === "24" ? "0" : map.hour),
    minute: Number(map.minute),
    weekday,
  };
}

/** Convert IST calendar + clock into a Date (absolute instant). */
function istLocalToDate(year, month, day, hour, minute) {
  const utcGuess = Date.UTC(year, month - 1, day, hour - 5, minute - 30);
  return new Date(utcGuess);
}

function parseWeekday(scheduleDay) {
  const key = String(scheduleDay || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z]/g, "");
  if (!key) return null;
  if (WEEKDAY_ALIASES[key] != null) return WEEKDAY_ALIASES[key];
  if (WEEKDAY_ALIASES[key.slice(0, 3)] != null) return WEEKDAY_ALIASES[key.slice(0, 3)];
  return null;
}

function parseClockToken(token) {
  const raw = String(token || "").trim();
  if (!raw) return null;

  const ampm = raw.match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b/i);
  if (ampm) {
    let hour = Number(ampm[1]);
    const minute = Number(ampm[2] || "0");
    const meridiem = ampm[3].toLowerCase();
    if (hour === 12) hour = 0;
    if (meridiem === "pm") hour += 12;
    if (hour > 23 || minute > 59) return null;
    return { hour, minute };
  }

  const twentyFour = raw.match(/^(\d{1,2}):(\d{2})\b/);
  if (twentyFour) {
    const hour = Number(twentyFour[1]);
    const minute = Number(twentyFour[2]);
    if (hour > 23 || minute > 59) return null;
    return { hour, minute };
  }

  return null;
}

/**
 * Accepts:
 * - "7:00 PM - 8:30 PM IST"
 * - "19:00-20:30"
 * - "7:00 PM"
 */
function parseScheduleTimeRange(scheduleTime) {
  const cleaned = String(scheduleTime || "")
    .replace(/\bIST\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();
  if (!cleaned) return null;

  const rangeParts = cleaned.split(/\s*[-–—to]+\s*/i).filter(Boolean);
  const start = parseClockToken(rangeParts[0]);
  if (!start) return null;
  const end = rangeParts[1] ? parseClockToken(rangeParts[1]) : null;

  return {
    start,
    end: end || {
      hour: Math.min(23, start.hour + 2),
      minute: start.minute,
    },
  };
}

function evaluateAttendanceWindow(liveClass, now = new Date()) {
  const weekday = parseWeekday(liveClass?.scheduleDay);
  const range = parseScheduleTimeRange(liveClass?.scheduleTime);

  if (weekday == null || !range) {
    return {
      canMark: false,
      reason:
        "Attendance needs a scheduled day and time. Link can still open, but attendance is not marked yet.",
      opensAt: null,
      closesAt: null,
      inWindow: false,
    };
  }

  const ist = getIstParts(now);
  if (ist.weekday !== weekday) {
    return {
      canMark: false,
      reason: `Attendance is only marked on ${liveClass.scheduleDay} during class hours (IST).`,
      opensAt: null,
      closesAt: null,
      inWindow: false,
      todayWeekdayMismatch: true,
    };
  }

  const classStart = istLocalToDate(
    ist.year,
    ist.month,
    ist.day,
    range.start.hour,
    range.start.minute
  );
  let classEnd = istLocalToDate(
    ist.year,
    ist.month,
    ist.day,
    range.end.hour,
    range.end.minute
  );
  if (classEnd.getTime() <= classStart.getTime()) {
    // overnight / bad range — treat as 2h session
    classEnd = new Date(classStart.getTime() + 2 * 60 * 60 * 1000);
  }

  const opensAt = new Date(classStart.getTime() - OPEN_BEFORE_MS);
  const closesAt = new Date(classEnd.getTime() + CLOSE_AFTER_MS);
  const t = now.getTime();
  const inWindow = t >= opensAt.getTime() && t <= closesAt.getTime();

  if (t < opensAt.getTime()) {
    return {
      canMark: false,
      reason: `Class has not started yet. Attendance opens 15 minutes before ${liveClass.scheduleTime || "start"} (IST).`,
      opensAt,
      closesAt,
      inWindow: false,
      tooEarly: true,
    };
  }

  if (t > closesAt.getTime()) {
    return {
      canMark: false,
      reason: "Attendance window for this class has closed.",
      opensAt,
      closesAt,
      inWindow: false,
      tooLate: true,
    };
  }

  return {
    canMark: true,
    reason: null,
    opensAt,
    closesAt,
    inWindow: true,
  };
}

module.exports = {
  ATTENDANCE_TZ,
  evaluateAttendanceWindow,
  parseScheduleTimeRange,
  parseWeekday,
};
