import { ErrorMessage, Field, Form, Formik } from "formik";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useSignup from "../../hooks/useSignup";
import { useAppDispatch } from "../../store/hooks";
import { clearMessage } from "../../store/slices/messageSlice";
import SignupRequest from "../../types/requests/SignupRequest";
import * as Yup from 'yup';
import "./signupStyles.css";

const Signup = () => {
  const [inputs, setInputs] = useState<SignupRequest>({
    username: "",
    email: "",
    password: "",
    rePassword: "",
  });
  const [signupState, signup] = useSignup();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleInputs = (e: React.ChangeEvent<HTMLInputElement>) => {
    const key = e.target.name;
    const value = e.target.value;
    setInputs((prev) => ({ ...prev, [key]: value }));
  };
  const handleSubmit = (values: SignupRequest) => {
    signup(values);
  };
  useEffect(() => {
    if (signupState.data && signupState.data.email) {
      navigate("/login?new_user");
    }
  }, [signupState]);

  useEffect(() => {
    const calendar = document.getElementById("signup-page");

    if (calendar) {
      calendar.classList.add("is-visible");
    }

    dispatch(clearMessage());
  }, []);

  const SignupSchema = Yup.object().shape({

    username: Yup.string()

      .min(2, 'Too short!')

      .max(50, 'Too long!')

      .required('Required'),

    email: Yup.string().email('Invalid email').required('Required'),

    password: Yup.string()
          .required("Required")
          .min(8, "Must be 8 characters or more")
          .matches(/[a-z]+/, "Must have at least one lowercase character")
          .matches(/[A-Z]+/, "Must have at least one uppercase character")
          .matches(/[!"$%&/()=?¿.]+/, "Must have at least one special character")
          .matches(/\d+/, "Must have at least one number"),

    rePassword: Yup.string()
          .required("Required")
          .oneOf([Yup.ref('password'), null], "Passwords don't match!")
 });

  return (
    <div id="signup-page">
      {signupState.loading && "Loading..."}
      {!signupState.loading && (
        <Formik
          initialValues={
            { username: "",
              email: "",
              password: "",
              rePassword: ""
            }
          }
          validationSchema={SignupSchema}
          onSubmit={(values, { setSubmitting }) => {
            setTimeout(() => {
              handleSubmit(values);
              setSubmitting(false);
            }, 400);
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="signup-title">Create an account</div>
              <div className="username">
                <span>Username</span>
                <Field type="text" name="username" className="form-input" />
                <ErrorMessage name="username">
                  { msg => <div style={{ fontSize: '14px', color: 'red', textAlign: 'center' }}>{msg}</div> }
                </ErrorMessage>
              </div>
              <div className="email">
                <span>Email</span>
                <Field type="email" name="email" className="form-input" />
                <ErrorMessage name="email" className="error">
                  { msg => <div style={{ fontSize: '14px', color: 'red', textAlign: 'center' }}>{msg}</div> }
                </ErrorMessage>
              </div>
              <div className="password">
                <span>Password</span>
                <Field type="password" name="password" className="form-input" />
                <ErrorMessage name="password" className="error">
                  { msg => <div style={{ fontSize: '14px', color: 'red', textAlign: 'center' }}>{msg}</div> }
                </ErrorMessage>
              </div>
              <div className="password">
                <span>Repeat password</span>
                <Field type="password" name="rePassword" className="form-input" />
                <ErrorMessage name="rePassword" className="error">
                  { msg => <div style={{ fontSize: '14px', color: 'red', textAlign: 'center' }}>{msg}</div> }
                </ErrorMessage>
              </div>          
              <button type="submit" disabled={isSubmitting} className="submit-btn">
                Sign up
              </button>
            </Form>
          )}
        </Formik>
      )}
      <div className="new-user">
        Already have an account? <Link to="/login">Log in. </Link>
      </div>
    </div>
  );
};

export default Signup;
