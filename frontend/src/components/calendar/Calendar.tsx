import "./calendarStyles.css";
import React, { useEffect, useState } from "react";
import useFetchItems from "../../hooks/useFetchItems";
import server from "../../api/calendarServer";
import WeekInterval from "../../types/TimeInterval";
import DatePicker from "./datePicker/DatePicker";
import CalendarEntries from "./calendarEntries/CalendarEntries";
import Header from "./calendarHeader/Header";
import { useDispatch } from "react-redux";
import { clearMessage } from "../../store/slices/messageSlice";
import Entry from "../../types/responses/Entry";

const Calendar = () => {
  const [week, setWeek] = useState<WeekInterval>();
  const [itemsState, updateState] = useFetchItems(week);
  const dispatch = useDispatch();

  const handleAddItem = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    dueDate: Date,
    inputs: string[],
    setInputs: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    const weekday = Number.parseInt(e.currentTarget.id);
    const description = inputs[weekday];
    if (description && description.length <= 255) {
      server
        .addItem({ description, completed: false, removed: false, dueDate })
        .then((response) => {
          updateState(response.data, weekday);
          setInputs((prev) =>
            prev.map((content, index) => {
              if (index === weekday) {
                return "";
              } else {
                return content;
              }
            })
          );
        });
    } else if (description.length > 255) {
      const input = document.getElementById(`${weekday}-input`);
      if (input) {
        input.setAttribute("placeholder", "max length: 255 characters");
        input.setAttribute("value", "");
      }
    } else {
      const input = document.getElementById(`${weekday}-input`);
      if (input) {
        input.focus();
      }
    }
  };

  const handleMarkCompleted = (item: Entry, index: number) => {
    const id = item.id;
    const element = document.getElementById(`${id}-content`);

    server
      .updateItem(id, {
        description: item.description,
        completed: true,
        removed: item.removed,
        dueDate: item.dueDate,
      })
      .then((response) => {
        updateState(response.data, index, true);
        if (element) {
          element.classList.add("completed");
        }
      });
  };

  const handleRemoveItem = (id: number) => {
    const description = document.getElementById(`${id}-description`);
    const removeBtn = document.getElementById(`${id}-remove`);
    const completedBtn = document.getElementById(`${id}-completed`);
    server.removeItem(id).then(() => {
      if (description) {
        description.classList.add("removed");
      }
      if (removeBtn) {
        removeBtn.classList.add("disabled");
      }
      if (completedBtn) {
        completedBtn.classList.add("disabled");
      }
    });
  };

  useEffect(() => {
    const calendar = document.getElementById("calendar");

    if (calendar) {
      calendar.classList.add("is-visible");
    }

    dispatch(clearMessage());
  });

  return (
    <div id="calendar">
      <Header />
      <DatePicker setWeek={setWeek} />
      {itemsState.loading && "Loading..."}
      <CalendarEntries
        entries={itemsState.data}
        handleAddItem={handleAddItem}
        handleMarkCompleted={handleMarkCompleted}
        handleRemoveItem={handleRemoveItem}
      />
    </div>
  );
};

export default Calendar;
