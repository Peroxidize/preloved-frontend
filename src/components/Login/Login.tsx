import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import logo from "../../assets/preloved-logo.jpg";
import styles from "./login.module.css";
import signUpClass from "../SignUp/SignUp.module.css";
import { login } from "../../utils/auth";

import { useAtom } from "jotai";
import { userAtom } from "../../App";

function errorMessage(isLoggedIn: boolean) {
  document.getElementById("error")!.style.opacity = isLoggedIn ? "0" : "100";
}

function displaySpinner(isActive: boolean) {
  document.getElementById("spinner")!.style.opacity = isActive ? "100" : "0";
}

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [storedUser, setUser] = useAtom(userAtom);

  async function handlePostRequest(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    displaySpinner(true);

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    let user = await login(formData);

    if (user !== undefined) {
      setUser(user);
    }

    displaySpinner(false);
    errorMessage(user !== undefined ? true : false);
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
        </form>
      </div>
    </div>
  );
}
