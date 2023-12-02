import React, { useState } from 'react';
import axios from 'axios';
import { Link, Navigate, redirect, useNavigate } from 'react-router-dom';

import logo from '../assets/preloved-logo.jpg';
import styles from './login.module.css';
import frontpagestyles from '../FrontPage/frontpage.module.css';
import signUpClass from '../SignUp/SignUp.module.css';

import FrontPage from '../FrontPage/FrontPage';

const domain = 'https://prelovedbackends.azurewebsites.net/';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handlePostRequest = async () => {
    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);

      const response = await axios
        .post(domain + 'auth/login/', formData)
        .then((response) => {
          const responseAsString = JSON.stringify(response);
          // console.log(responseAsString);
          const pattern = /"status":200/;
          const result = pattern.test(responseAsString);
          console.log(result);
          if (result) {
            setIsLoggedIn(true);
            console.log("Username and password is correct");
          } else {
            console.log("Invalid username/password!");
          }
        })
        .catch((error) => {
          // alert('Error:', error);
        });
      // alert(response);
    } catch (error) {
      // alert(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await handlePostRequest();
  };

  const removeStyle = () => {
    body.classList.remove(styles);
  };

  const body = document.body;
  body.classList.add(styles.body);
  body.classList.add(styles.backgroundPhoto);

  return (
    <div className={styles.backgroundPhoto}>
      <div className={styles.container}>
        <img src={logo} alt="Preloved Logo" className={styles.logo} />
        <div className={styles.text}>
          <h1>Log in</h1>
          <p>
            No account yet?{' '}
            <Link to="signup/" 
              className={signUpClass.link}
              onClick={removeStyle}
            >
              Click Here
            </Link>
          </p>
        </div>
        <form onSubmit={handleSubmit} method="post">
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
          {isLoggedIn && (<Navigate to="frontpage/" replace={true}/>)}
        </form>
      </div>
    </div>
  );
}
