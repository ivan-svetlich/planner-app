import React from "react";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import useCalendar from "../../../hooks/useCalendar";
import WeekInterval from "../../../types/TimeInterval";
import { useNavigate } from "react-router-dom";
import useQuery from "../../../hooks/useQuery";

type DatePickerProps = {
  setWeek: React.Dispatch<React.SetStateAction<WeekInterval | undefined>>;
};
const DatePicker = ({ setWeek }: DatePickerProps) => {
  type SelectedDate = {
    year: number;
    month: number;
    week: number;
  };
  const query = useQuery();
  const [selectedDate, setSelectedDate] = useState<SelectedDate>(() => {
    return {
      year: query.get("year")
        ? Number.parseInt(query.get("year") as string)
        : DateTime.now().year,
      month: query.get("month")
        ? Number.parseInt(query.get("month") as string)
        : (DateTime.now().month as number),
      week: query.get("week")
        ? Number.parseInt(query.get("week") as string)
        : -1,
    };
  });
  const weeks = useCalendar(selectedDate.month, selectedDate.year);
  const [today, setToday] = useState(!query.get("week"));
  const navigate = useNavigate();
  const audio = new Audio(
    "https://www.soundjay.com/misc/sounds/page-flip-01a.mp3"
  );

  const handlePreviousYear = () => {
    if (selectedDate.year > 0) {
      audio.play();
      setSelectedDate((prev) => ({ ...prev, year: prev.year - 1 }));
    }
  };

  const handleNextYear = () => {
    audio.play();
    setSelectedDate((prev) => ({ ...prev, year: prev.year + 1 }));
  };

  const handleSelectMonth = (e: React.ChangeEvent<HTMLSelectElement>) => {
    audio.play();
    setSelectedDate((prev) => ({
      ...prev,
      month: Number.parseInt(e.target.value),
      week: 0,
    }));
  };

  const handlePreviousWeek = () => {
    audio.play();
    if (selectedDate.week > 0) {
      setSelectedDate((prev) => ({ ...prev, week: prev.week - 1 }));
    } else if (selectedDate.month > 1) {
      setSelectedDate((prev) => ({ ...prev, month: prev.month - 1, week: -1 }));
    } else {
      setSelectedDate((prev) => ({
        ...prev,
        year: prev.year - 1,
        month: 12,
        week: -1,
      }));
    }
  };

  const handleNextWeek = () => {
    audio.play();
    if (selectedDate.week < weeks.length - 1) {
      setSelectedDate((prev) => ({ ...prev, week: prev.week + 1 }));
    } else if (selectedDate.month < 12) {
      setSelectedDate((prev) => ({ ...prev, month: prev.month + 1, week: 0 }));
    } else {
      setSelectedDate((prev) => ({
        ...prev,
        year: prev.year + 1,
        month: 1,
        week: 0,
      }));
    }
  };

  useEffect(() => {
    if (today) {
      const now = DateTime.now();
      if (now.year === selectedDate.year || now.year === weeks[0].start.year) {
        if (
          now.month === selectedDate.month ||
          now.month === weeks[0].start.month
        ) {
          if (currentWeek(now) !== -1) {
            setToday(false);
            setSelectedDate((prev) => ({ ...prev, week: currentWeek(now) }));
          } else {
            if (now.month === weeks[0].end.month) {
              if (now.month < 12) {
                setToday(false);
                console.log(2);
                setSelectedDate((prev) => ({
                  ...prev,
                  month: now.month + 1,
                  week: 0,
                }));
              } else {
                setSelectedDate((prev) => ({
                  ...prev,
                  year: now.year + 1,
                  month: 1,
                  week: 0,
                }));
              }
            } else {
              setSelectedDate({ year: now.year, month: now.month, week: -1 });
            }
          }
        } else {
          setSelectedDate((prev) => ({ ...prev, month: now.month, week: -1 }));
        }
      } else {
        setSelectedDate((prev) => ({
          ...prev,
          year: now.year,
          month: now.month,
          week: -1,
        }));
      }
    }

    function currentWeek(now: DateTime) {
      const index = weeks.findIndex(
        (interval) => interval.start < now && interval.end > now
      );
      return index;
    }
  }),
    [today, selectedDate];

  useEffect(() => {
    if (
      selectedDate.year === weeks[0].end.year &&
      selectedDate.month === weeks[0].end.month
    ) {
      if (
        !today &&
        (selectedDate.week === -1 || selectedDate.week >= weeks.length)
      ) {
        setSelectedDate((prev) => ({ ...prev, week: weeks.length - 1 }));
      } else {
        setWeek(weeks[selectedDate.week]);
        if (today) {
          setToday(false);
        }
        navigate(
          `?year=${selectedDate.year}&month=${selectedDate.month}&week=${selectedDate.week}`,
          { replace: true }
        );
      }
    } else if (
      selectedDate.year === weeks[0].start.year &&
      selectedDate.month === weeks[0].start.month &&
      selectedDate.week !== -1
    ) {
      setToday(false);
      setWeek(weeks[selectedDate.week]);
    }
  }, [selectedDate, setWeek, weeks]);

  const months = [
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
  ];

  return (
    <div className="list-date">
      <div className="month">
        <select
          value={selectedDate.month}
          onChange={(e) => handleSelectMonth(e)}
        >
          {months.map((month, index) => (
            <option value={index + 1} key={index + 1}>
              {month}
            </option>
          ))}
        </select>
      </div>
      <div className="week">
        <button className="add-btn">
          <i
            className="fas fa-chevron-left"
            onClick={() => handlePreviousWeek()}
          ></i>
        </button>
        {weeks.length > selectedDate.week && selectedDate.week >= 0 && (
          <div className="current-week">
            <span
              className={
                weeks[selectedDate.week].start.month === selectedDate.month
                  ? "week-start text-bold"
                  : "week-start"
              }
            >
              {`${weeks[selectedDate.week].start.weekdayLong} ${
                weeks[selectedDate.week].start.day
              }`}
            </span>
            <span className="week-divider">{` - `}</span>
            <span
              className={
                weeks[selectedDate.week].end.month === selectedDate.month
                  ? "week-end text-bold"
                  : "week-end"
              }
            >
              {`${weeks[selectedDate.week].end.weekdayLong} ${
                weeks[selectedDate.week].end.day
              }`}
            </span>
          </div>
        )}
        <button className="add-btn" onClick={() => handleNextWeek()}>
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>
      <div className="today-btn-container">
        <button onClick={() => navigate("calendar")} className="today-btn">
          Today
        </button>
      </div>
      <div className="year">
        <button className="add-btn">
          <i
            className="fas fa-chevron-left"
            onClick={() => handlePreviousYear()}
          ></i>
        </button>
        <div className="current-year">
          <span className="week-start">{selectedDate.year}</span>
        </div>
        <button className="add-btn" onClick={() => handleNextYear()}>
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
  );
};

export default DatePicker;
