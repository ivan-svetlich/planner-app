import { useReducer } from "react";
import server from "../api/calendarServer";
import SignupRequest from "../types/requests/SignupRequest";
import User from "../types/responses/LoginResponse";

export type SignupState = {
  loading: boolean;
  data: User | null;
  error: string | null;
};

type ACTION =
  | { type: "LOAD"; payload: null }
  | { type: "SUCCESS"; payload: User }
  | { type: "FAILURE"; payload: string };

const initialState: SignupState = { loading: false, data: null, error: null };

function fetchItemsReducer<SignupState>(state: SignupState, action: ACTION) {
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

export const useSignup = (): [
  SignupState,
  (signupRequest: SignupRequest) => Promise<void>
] => {
  const [state, dispatch] = useReducer(fetchItemsReducer, initialState);

  const signup = (signupRequest: SignupRequest) =>
    signupAsync(dispatch, signupRequest);

  return [state as SignupState, signup];
};

async function signupAsync(
  dispatch: React.Dispatch<ACTION>,
  signupRequest: SignupRequest
) {
  dispatch({ type: "LOAD", payload: null });
  try {
    await server.signup(signupRequest).then((response) => {
      dispatch({ type: "SUCCESS", payload: response.data });
    });
  } catch (error: any) {
    dispatch({ type: "FAILURE", payload: error.response.data });
  }
}

export default useSignup;
