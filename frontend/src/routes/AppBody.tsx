import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import Login from "../components/authManagement/Login";
import Signup from "../components/authManagement/Signup";
import Calendar from "../components/calendar/Calendar";
import Menu from "../components/menu/Menu";
import Message from "../components/message/Message";
import PrivateRoute from "./PrivateRoute";
import LoggedOutRoute from "./LoggedOutRoute";

const AppBody = () => {
  const message: string | null = useAppSelector(
    (state) => state.message.content
  );

  return (
    <div className="App-body">
      <Menu />
      {message && <Message content={message} />}
      <Routes>
        <Route
          path="/calendar"
          element={
            <PrivateRoute>
              <Calendar />
            </PrivateRoute>
          }
        />
        <Route
          path="/login"
          element={
            <LoggedOutRoute>
              <Login />
            </LoggedOutRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <LoggedOutRoute>
              <Signup />
            </LoggedOutRoute>
          }
        />
        <Route path="*" element={<Navigate to="/calendar" />} />
      </Routes>
    </div>
  );
};

export default AppBody;
