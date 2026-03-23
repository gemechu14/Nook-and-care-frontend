const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

export function formatListingDate(date: Date): string {
  const day = date.getDate();
  const month = MONTH_NAMES[date.getMonth()];
  const year = date.getFullYear();
  const suffix =
    day === 1 || day === 21 || day === 31
      ? "st"
      : day === 2 || day === 22
        ? "nd"
        : day === 3 || day === 23
          ? "rd"
          : "th";
  return `${month} ${day}${suffix}, ${year}`;
}

export function parseTourDateTime(
  dateStr: string,
  timeStr: string
): string | null {
  try {
    const dateMatch = dateStr.match(/(\w+)\s+(\d+)(?:st|nd|rd|th)?,\s+(\d+)/);
    if (!dateMatch) return null;

    const [, monthName, day, year] = dateMatch;
    const monthIndex = MONTH_NAMES.indexOf(
      monthName as (typeof MONTH_NAMES)[number]
    );
    if (monthIndex === -1) return null;

    const timeMatch = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!timeMatch) return null;

    const [, hours, minutes, ampm] = timeMatch;
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
