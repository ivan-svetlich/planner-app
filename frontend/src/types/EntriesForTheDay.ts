import Entry from "./responses/Entry";

export default interface EntriesForTheDay {
  dueDate: Date;
  entries: Entry[];
}
