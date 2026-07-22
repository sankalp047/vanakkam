const WEEKDAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
export const WEEKDAY_LABELS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/**
 * Parses free-text day ranges like "Monday to Thursday", "Saturday and Sunday",
 * or a single "Friday" into an array of weekday indices (0=Sunday). Returns
 * null if the text doesn't look like real day-of-week data (e.g. a genre
 * label such as "Devotional & Classical") so callers can skip it gracefully.
 */
export function parseDays(daysText) {
  if (!daysText) return null;
  const text = daysText.toLowerCase();
  const found = WEEKDAYS.filter((day) => text.includes(day));
  if (found.length === 0) return null;

  if (text.includes(' to ') && found.length === 2) {
    const start = WEEKDAYS.indexOf(found[0]);
    const end = WEEKDAYS.indexOf(found[1]);
    const range = [];
    let i = start;
    while (true) {
      range.push(i);
      if (i === end) break;
      i = (i + 1) % 7;
    }
    return range;
  }

  return found.map((day) => WEEKDAYS.indexOf(day));
}

function parseClockTime(text) {
  const match = text.trim().match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i);
  if (!match) return null;
  let hour = parseInt(match[1], 10);
  const minute = match[2] ? parseInt(match[2], 10) : 0;
  const meridiem = match[3].toLowerCase();
  if (meridiem === 'pm' && hour !== 12) hour += 12;
  if (meridiem === 'am' && hour === 12) hour = 0;
  return hour * 60 + minute;
}

/**
 * Parses one or more "X to Y" time ranges (joined by "&") into
 * [{ startMinutes, endMinutes }] in minutes-since-midnight.
 */
export function parseTimeRanges(timeText) {
  if (!timeText) return [];
  return timeText
    .split('&')
    .map((part) => {
      const [startText, endText] = part.split(/\bto\b/i);
      const start = parseClockTime(startText || '');
      const end = parseClockTime(endText || '');
      if (start === null || end === null) return null;
      return { startMinutes: start, endMinutes: end };
    })
    .filter(Boolean);
}

/**
 * Groups the roster into a Sunday–Saturday weekly schedule for a grid
 * view, sorted by start time within each day. Entries whose `days` text
 * doesn't parse to real weekdays (e.g. a genre label) are returned
 * separately under `unscheduled` rather than guessed at.
 */
export function buildWeeklySchedule(roster) {
  const byDay = WEEKDAY_LABELS.map(() => []);
  const unscheduled = [];

  roster.forEach((rj) => {
    const days = parseDays(rj.days);
    const ranges = parseTimeRanges(rj.time);
    if (!days || ranges.length === 0) {
      unscheduled.push(rj);
      return;
    }
    days.forEach((dayIndex) => {
      byDay[dayIndex].push({ ...rj, startMinutes: ranges[0].startMinutes });
    });
  });

  byDay.forEach((entries) => entries.sort((a, b) => a.startMinutes - b.startMinutes));

  return { byDay, unscheduled };
}

export function isOnAirNow(rj, now = new Date()) {
  const days = parseDays(rj.days);
  if (!days || !days.includes(now.getDay())) return false;

  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const ranges = parseTimeRanges(rj.time);
  return ranges.some(({ startMinutes, endMinutes }) => {
    if (endMinutes >= startMinutes) {
      return nowMinutes >= startMinutes && nowMinutes < endMinutes;
    }
    // range crosses midnight
    return nowMinutes >= startMinutes || nowMinutes < endMinutes;
  });
}
