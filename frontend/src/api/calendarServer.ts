import { DateTime } from "luxon";
import { getCookie } from "../services/cookies/cookies";
import Entry from "../types/responses/Entry";
import LoginRequest from "../types/requests/LoginRequest";
import User from "../types/responses/LoginResponse";
import apiClient from "./apiClient";
import SignupRequest from "../types/requests/SignupRequest";
import IntervalResponse from "../types/responses/IntervalResponse";

const getItemsByInterval = (startDate: DateTime, endDate: DateTime) => {
  return apiClient.get<IntervalResponse[]>(
    `http://localhost:8080/entries/?start_date=${startDate
      .toUTC()
      .toISODate()}&end_date=${endDate.toUTC().toISODate()}`,
    { headers: { authorization: `Bearer ${getCookie("id_token")}` } }
  );
};

type UpdateItemRequest = {
  description: string;
  completed: boolean;
  removed: boolean;
  dueDate: Date;
};
const addItem = (item: UpdateItemRequest) => {
  return apiClient.post(`http://localhost:8080/entries/`, item, {
    headers: { authorization: `Bearer ${getCookie("id_token")}` },
  });
};

const updateItem = (id: number, item: UpdateItemRequest) => {
  return apiClient.put(`http://localhost:8080/entries/${id}`, item, {
    headers: { authorization: `Bearer ${getCookie("id_token")}` },
  });
};

const removeItem = (id: number) => {
  return apiClient.delete(`http://localhost:8080/entries/${id}`, {
    headers: { authorization: `Bearer ${getCookie("id_token")}` },
  });
};

const login = (LoginRequest: LoginRequest) => {
  return apiClient.post<User>(`http://localhost:8080/auth/login`, LoginRequest);
};

const signup = (SignupRequest: SignupRequest) => {
  return apiClient.post(`http://localhost:8080/auth/signup`, SignupRequest);
};

const server = {
  addItem,
  getItemsByInterval,
  updateItem,
  login,
  signup,
  removeItem,
};

export default server;
