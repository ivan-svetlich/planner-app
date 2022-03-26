import { DateTime } from "luxon";
import { useEffect, useReducer } from "react";
import EntriesForTheDay from "../types/EntriesForTheDay";
import server from "../api/calendarServer";
import WeekInterval from "../types/TimeInterval";
import { useNavigate } from "react-router-dom";
import Entry from "../types/responses/Entry";
import IntervalResponse from "../types/responses/IntervalResponse";

export type ItemsState = {
  loading: boolean;
  data: IntervalResponse[];
  error: string | null;
};

type ACTION =
  | { type: "LOAD"; payload: null }
  | { type: "SUCCESS"; payload: IntervalResponse[] }
  | { type: "FAILURE"; payload: string };

const initialState: ItemsState = { loading: false, data: [], error: null };

function fetchItemsReducer<ItemsState>(state: ItemsState, action: ACTION) {
  const { type, payload } = action;

  switch (type) {
    case "LOAD":
      return { ...state, loading: true, data: null, error: null };
    case "SUCCESS":
      return { ...state, loading: false, data: payload, error: null };
    case "FAILURE":
      return { ...state, loading: false, data: null, error: payload };
    default:
      return state;
  }
}

export const useFetchItems = (
  week: WeekInterval | undefined
): [ItemsState, (entry: Entry, index: number, replace?: boolean) => void] => {
  const [state, dispatch] = useReducer(fetchItemsReducer, initialState);
  let navigate = useNavigate();

  useEffect(() => {
    if (week) {
      fetchItems(week.start, week.end, dispatch);
    }
  }, [week]);

  const updateState = (
    entry: Entry,
    index: number,
    replace: boolean = false
  ) => {
    let updatedState = { ...(state as ItemsState) };
    if (replace) {
      updatedState.data[index].entries = updatedState.data[index].entries.map(
        (current) => {
          if (current.id === entry.id) {
            return entry;
          } else {
            return current;
          }
        }
      );
    } else {
      updatedState.data[index].entries.push(entry);
    }
    dispatch({ type: "SUCCESS", payload: [...updatedState.data] });
  };

  return [state as ItemsState, updateState];
};

async function fetchItems(
  startDate: DateTime,
  endDate: DateTime,
  dispatch: React.Dispatch<ACTION>
) {
  dispatch({ type: "LOAD", payload: null });
  try {
    await server.getItemsByInterval(startDate, endDate).then((response) => {
      console.log(response.data);
      dispatch({ type: "SUCCESS", payload: response.data });
    });
  } catch (error: any) {
    dispatch({ type: "FAILURE", payload: error });
  }
}

export default useFetchItems;
