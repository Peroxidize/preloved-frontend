import logo from '../assets/preloved-logo.jpg';
import styles from './login.module.css';

export default function Login() {
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
            <form action="post">
                <div className={styles.form_input}>
                <label htmlFor="username">Username</label>
                <input
                    type="text"
                    name="username"
                    id="username"
                    className="text-input"
                />
                </div>
                <div className={styles.form_input}>
                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    name="password"
                    id="password"
                    className="text-input"
                />
                </div>
                <button type="submit" className="signup-button">
                    Log In
                </button>
            </form>
        </div>
    );
}