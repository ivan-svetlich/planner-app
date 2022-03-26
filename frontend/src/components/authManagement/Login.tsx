import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { clearMessage } from "../../store/slices/messageSlice";
import { login, UserState } from "../../store/slices/userSlice";
import LoginRequest from "../../types/requests/LoginRequest";
import "./loginStyles.css";

const Login = () => {
  const [inputs, setInputs] = useState<LoginRequest>({
    username: "",
    password: "",
  });
  const userState: UserState = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleInputs = (e: React.ChangeEvent<HTMLInputElement>) => {
    const key = e.target.name;
    const value = e.target.value;
    setInputs((prev) => ({ ...prev, [key]: value }));
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(login(inputs));
  };
  useEffect(() => {
    if (userState.data && userState.data.email) {
      navigate("/calendar");
    }
  }, [userState.data]);

  useEffect(() => {
    const calendar = document.getElementById("login-page");

    if (calendar) {
      calendar.classList.add("is-visible");
    }

    dispatch(clearMessage());
  }, []);

  return (
    <div id="login-page">
      {userState.loading && "Loading..."}
      {!userState.loading && (
        <form onSubmit={(e) => handleSubmit(e)}>
          <div className="login-title">Log in to Planner</div>
          <div className="username">
            <span>Username</span>
            <input
              type="text"
              className="form-input"
              name="username"
              required
              onChange={(e) => handleInputs(e)}
            />
          </div>
          <div className="password">
            <span>Password</span>
            <input
              type="password"
              className="form-input"
              name="password"
              required
              onChange={(e) => handleInputs(e)}
            />
          </div>
          <button type="submit" className="submit-btn">
            Log in
          </button>
        </form>
      )}
      <div className="new-user">
        New to PLANNER? <Link to="/signup">Create an account. </Link>
      </div>
    </div>
  );
};

export default Login;
