import React, { useState } from 'react';
import axios from 'axios';

import logo from '../assets/preloved-logo.jpg';
import styles from './login.module.css';

const domain = 'http://192.168.137.1:8000/';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handlePostRequest = async () => {
      try {
        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);

        const response = await axios.post(
          (domain + "auth/login/"),
          form,
        ).then(response => {
            alert('Response:', response.data);
        }).catch( error => {
            alert('Error:', error);
        });
        // alert(response);
      } catch (error) {
        // alert(error);
      }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        await handlePostRequest();
    }

    const navigateSignup = () => {
        // TODO
    };

    const body = document.body;
    body.classList.add(styles.body);

    return (
        <div className={styles.container}>
            <img src={logo} alt="Preloved Logo" className={styles.logo} />
            <div className={styles.text}>
                <h1>Log in</h1>
                <p>
                    No account yet?{' '}
                    <a href="" onClick={navigateSignup}>
                        Sign Up
                    </a>
                </p>
            </div>
            <form onSubmit={handleSubmit} method="post">
                <div className={styles.form_input}>
                <label htmlFor="username">Username</label>
                <input
                    type="text"
                    name="email"
                    id="email"
                    className="text-input"
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
                    className="text-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                </div>
                <button type="submit" className="signup-button">
                    Log In
                </button>
            </form>
        </div>
    );
}