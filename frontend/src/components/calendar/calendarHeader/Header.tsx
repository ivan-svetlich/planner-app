import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { logout } from "../../../store/slices/userSlice";
import User from "../../../types/responses/LoginResponse";
import "./headerStyles.css";

const Header = () => {
  const user: User | null = useAppSelector((state) => state.user.data);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div>
      {user && (
        <div className="app-header">
          <div className="logout">
            <button className="logout-btn" onClick={(e) => handleLogout()}>
              Log out
            </button>
          </div>
          <div className="user">
            {`This notebook belongs to: `}
            <span className="username">{`${user.username}`}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
