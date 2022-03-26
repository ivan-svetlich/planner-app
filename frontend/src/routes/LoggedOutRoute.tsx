import React from "react";
import { Navigate, RouteProps } from "react-router-dom";
import { useAppSelector } from "../store/hooks";

export type ProtectedRouteProps = Record<string, unknown> & RouteProps;

function LoggedOutRoute({ children }: ProtectedRouteProps) {
  const isLoggedIn = !!useAppSelector((state) => state.user.data);

  return <> {!isLoggedIn ? children : <Navigate to={`/calendar`} />} </>;
}

export default LoggedOutRoute;
