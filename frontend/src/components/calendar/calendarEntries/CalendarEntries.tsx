import React from "react";
import $ from "jquery";
import { DateTime } from "luxon";
import { useState } from "react";
import Entry from "../../../types/responses/Entry";
import EntriesForTheDay from "../../../types/EntriesForTheDay";
import IntervalResponse from "../../../types/responses/IntervalResponse";

type CalendarEntriesProps = {
  entries: IntervalResponse[];
  handleAddItem: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    dueDate: Date,
    inputs: string[],
    setInputs: React.Dispatch<React.SetStateAction<string[]>>
  ) => void;
  handleMarkCompleted: (item: Entry, index: number) => void;
  handleRemoveItem: (id: number) => void;
};

const CalendarEntries = ({
  entries,
  handleAddItem,
  handleMarkCompleted,
  handleRemoveItem,
}: CalendarEntriesProps) => {
  const [inputs, setInputs] = useState<string[]>(["", "", "", "", "", "", ""]);

  const createRemainingLines = (weekday: number, dueDate: Date) => {
    const elements = [];

    elements.push(
      <div className="todo-line" key={`btn-${weekday}`}>
        <button
          name="button"
          id={`${weekday}`}
          type="button"
          className="add-btn"
          onClick={(e) => {
            handleAddItem(e, dueDate, inputs, setInputs);
            const input = document.getElementById(`${weekday}-input`);
            if (input) {
              input.classList.remove("max-length");
            }
          }}
        >
          <i className="fas fa-plus" />
        </button>
        <div className="todo-description">
          <input
            id={`${weekday}-input`}
            className="add-input"
            value={inputs[weekday]}
            placeholder="New entry..."
            maxLength={255}
            onChange={(e) =>
              setInputs((prev) =>
                prev.map((content, index) => {
                  if (index === weekday) {
                    const input = document.getElementById(`${weekday}-input`);
                    if (input) {
                      if (e.target.value.length === 255) {
                        input.classList.add("max-length");
                      } else {
                        input.classList.remove("max-length");
                      }
                    }
                    return e.target.value;
                  } else {
                    return content;
                  }
                })
              )
            }
          />
        </div>
        <div>
          <button
            className="remove-btn invisible"
            disabled={true}
            id={`${weekday}-remove`}
          >
            <i className="icon fas fa-trash" />
          </button>
        </div>
      </div>
    );
    return elements;
  };
  const isPreviousMonth = (date: Date) => {
    const currentMonth = DateTime.fromISO(date.toString(), {
      zone: "utc",
    }).month;
    const selectedMonth = DateTime.fromISO(
      entries[entries.length - 1].dueDate.toString(),
      { zone: "utc" }
    ).month;

    return currentMonth !== selectedMonth;
  };

  return (
    <div className="calendar-entries">
      {entries !== null &&
        entries.map((day, dayIndex) => (
          <div className={"day-container"} key={dayIndex}>
            <div className="day">
              <span className={!isPreviousMonth(day.dueDate) ? "bold" : ""}>
                {`${
                  DateTime.fromISO(day.dueDate.toString(), { zone: "utc" })
                    .weekdayLong
                } ${
                  DateTime.fromISO(day.dueDate.toString(), { zone: "utc" }).day
                }`}
              </span>
            </div>
            <div className="daily-entries">
              {day.entries &&
                day.entries.map((item, index) => (
                  <div className="todo-line" key={`${index}-${dayIndex}`}>
                    <div className="line-controls">
                      {item.completed ? (
                        <span className="todo-completed">✓</span>
                      ) : (
                        <button
                          id={`${item.id}-completed`}
                          className="done-btn"
                          onClick={(e) => handleMarkCompleted(item, dayIndex)}
                        >
                          ✓
                        </button>
                      )}
                    </div>
                    <div
                      className={`todo-description`}
                      id={`${item.id}-description`}
                    >
                      <span
                        id={`${item.id}-content`}
                        className={item.completed ? `completed` : ``}
                      >
                        {item.description}
                      </span>
                    </div>
                    <div>
                      <button
                        className="remove-btn"
                        disabled={false}
                        onClick={(e) => handleRemoveItem(item.id)}
                        id={`${item.id}-remove`}
                      >
                        <i className="icon fas fa-trash" />
                      </button>
                    </div>
                  </div>
                ))}
              {day.entries && createRemainingLines(dayIndex, day.dueDate)}
            </div>
          </div>
        ))}
    </div>
  );
};

export default CalendarEntries;
