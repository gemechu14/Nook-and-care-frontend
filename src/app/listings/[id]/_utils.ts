import { MONTH_NAMES } from "./_constants";

/** Format a Date as "Month DayOrdinal, Year" (e.g., "March 13th, 2026") */
export function formatDate(date: Date): string {
  const day = date.getDate();
  const month = MONTH_NAMES[date.getMonth()];
  const year = date.getFullYear();
  const suffix =
    day === 1 || day === 21 || day === 31 ? "st" :
    day === 2 || day === 22 ? "nd" :
    day === 3 || day === 23 ? "rd" : "th";
  return `${month} ${day}${suffix}, ${year}`;
}

/**
 * Parse date string (e.g. "March 13th, 2026") and time string (e.g. "2:00 PM") to ISO datetime.
 */
export function parseDateTime(dateStr: string, timeStr: string): string | null {
  try {
    const dateMatch = dateStr.match(/(\w+)\s+(\d+)(?:st|nd|rd|th)?,\s+(\d+)/);
    if (!dateMatch) return null;

    const [, monthName, day, year] = dateMatch;
    const monthIndex = MONTH_NAMES.indexOf(monthName);
    if (monthIndex === -1) return null;

    const timeMatch = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!timeMatch) return null;

    let [, hours, minutes, ampm] = timeMatch;
    let hour24 = parseInt(hours, 10);
    if (ampm.toUpperCase() === "PM" && hour24 !== 12) hour24 += 12;
    if (ampm.toUpperCase() === "AM" && hour24 === 12) hour24 = 0;

    const date = new Date(
      parseInt(year, 10),
      monthIndex,
      parseInt(day, 10),
      hour24,
      parseInt(minutes, 10)
    );
    return date.toISOString();
  } catch {
    return null;
  }
}
