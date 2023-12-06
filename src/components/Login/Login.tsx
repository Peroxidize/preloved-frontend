import { useEffect, useState } from "react";
import axios from "axios";
import { Link, Navigate } from "react-router-dom";
import { User, UserType } from "../user";

import logo from "../../assets/preloved-logo.jpg";
import styles from "./login.module.css";
import signUpClass from "../SignUp/SignUp.module.css";

const domain = "https://prelovedbackends.azurewebsites.net/";
let authenticate: boolean;
let user: User;

function errorMessage(isLoggedIn: boolean) {
  document.getElementById("error")!.style.opacity = isLoggedIn ? "0" : "100";
}

function displaySpinner(isActive: boolean) {
  document.getElementById("spinner")!.style.opacity = isActive ? "100" : "0";
}

function evaluatePostRequest(response: string): boolean {
  return /"status":"OK!"/.test(response);
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");

    if (userInfo !== null) {
      window.location.replace("/frontpage");
    }
  }, []);

  async function handlePostRequest(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    displaySpinner(true);

    if (
      (email === "" && email.length === 0) ||
      (password === "" && password.length === 0)
    ) {
      errorMessage(isLoggedIn);
      displaySpinner(false);
      return;
    }

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    await axios
      .post(domain + "auth/login", formData, {
        withCredentials: true,
        withXSRFToken: true,
      })
      .then((response) => {
        authenticate = evaluatePostRequest(JSON.stringify(response));
        if (authenticate === false) {
          return;
        }
        user = {
          email: email,
          type: UserType.User,
          loggedIn: authenticate,
        };
        localStorage.setItem("userInfo", JSON.stringify(user));
        setIsLoggedIn(true);
      })
      .catch((error) => {
        console.log(error);
      });

    displaySpinner(false);
    errorMessage(isLoggedIn);
  }

  return (
    <div className={styles.backgroundPhoto}>
      <div className={styles.container}>
        <img src={logo} alt="Preloved Logo" className={styles.logo} />
        <div className={styles.text}>
          <h1>Log in</h1>
          <p>
            No account yet?{" "}
            <Link to="signup" className={signUpClass.link}>
              Click Here
            </Link>
          </p>
        </div>
        <form onSubmit={handlePostRequest} method="post">
          <div className={styles.form_input}>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              name="email"
              id="email"
              className={signUpClass.textInput}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <p id="error" className={styles.error_message}>
              Incorrect username or password
            </p>
          </div>
          <div className={styles.form_input}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              className={signUpClass.textInput}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className={signUpClass.signupButton}>
            Log In
          </button>
          <div id="spinner" className={styles.multiple1}>
            <div className={styles.ball1}></div>
            <div className={styles.ball2}></div>
            <div className={styles.ball3}></div>
          </div>
          {isLoggedIn && <Navigate to="/frontpage" replace={true} />}
        </form>
      </div>
    </div>
  );
}
