import { DateTime } from "luxon";

export default interface TimeInterval {
  start: DateTime;
  end: DateTime;
}
