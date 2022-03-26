import Entry from "./Entry";

export default interface IntervalResponse {
  dueDate: Date;
  entries: Entry[];
}
