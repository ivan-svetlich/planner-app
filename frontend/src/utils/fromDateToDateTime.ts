import { DateTime } from "luxon";

export default function fromDateToDateTime(date: Date) {
  return DateTime.fromISO(date.toUTCString(), { zone: "utc" });
}
