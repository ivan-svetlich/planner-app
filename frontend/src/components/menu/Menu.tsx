import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./sideMenuStyles.css";
import Offcanvas from "react-bootstrap/esm/Offcanvas";
import Navbar from "react-bootstrap/esm/Navbar";
import Nav from "react-bootstrap/esm/Nav";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import User from "../../types/responses/LoginResponse";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../store/slices/userSlice";
import Dropdown from "react-bootstrap/esm/Dropdown";
import DropdownButton from "react-bootstrap/esm/DropdownButton";

const AppNavbar = () => {
  const user: User | null = useAppSelector((state) => state.user.data);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const openNav = () => {
    const menu = document.getElementById("mySidenav");
    if (menu) {
      menu.style.width = "150px";
      menu.style.cursor = "default";
    }
  };

  const closeNav = () => {
    const menu = document.getElementById("mySidenav");
    if (menu) {
      menu.style.width = "0";
      menu.style.cursor = "pointer";
    }
  };

  return (
    <div className="menu">
      <div id="mySidenav" className="sidenav">
        <div className="closebtn" onClick={() => closeNav()}>
          &times;
        </div>
        {user && (
          <>
            <Link
              className="menu-link"
              to="/calendar"
              onClick={() => closeNav()}
            >
              Calendar
            </Link>
            <Link
              className="menu-link"
              to="/login"
              onClick={() => {
                handleLogout();
                closeNav();
              }}
            >
              Log out
            </Link>
          </>
        )}
        {!user && (
          <>
            <Link className="menu-link" to="/login" onClick={() => closeNav()}>
              Log in
            </Link>
            <Link className="menu-link" to="/Signup" onClick={() => closeNav()}>
              Sign up
            </Link>
          </>
        )}
      </div>
      <span onClick={() => openNav()}>
        <i className="fas fa-chevron-right" />
      </span>
    </div>
  );
};

export default AppNavbar;
