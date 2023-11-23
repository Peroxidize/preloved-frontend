import { useState } from 'react';

import logo from '../assets/preloved-logo.jpg';
import imageIcon from '../assets/icons/imageIcon.svg';
import classes from './SignUp.module.css';

export default function SignUp() {
  const [isStore, setIsStore] = useState(false);

  let storeInput = null;

  function handleUserStatus() {
    setIsStore(!isStore);
  }

  if (isStore) {
    storeInput = (
      <>
        <div className={classes.inputContainer}>
          <label htmlFor="streetName">Shop Address</label>
          <input
            type="text"
            name="streetName"
            id="streetName"
            className={`${classes.textInput} ${classes.addressInput}`}
            placeholder='Street Name'
          />
          <div className={classes.oneRowResponsive}>
            <input
              type="text"
              name="barangay"
              id="barangay"
              className={`${classes.textInput} ${classes.addressInput}`}
              placeholder='Barangay'
            />
            <input
              type="text"
              name="cityOrMunicipal"
              id="cityOrMunicipal"
              className={`${classes.textInput} ${classes.addressInput}`}
              placeholder='City/Municipal'
            />
          </div>
        </div>
        <div className={classes.inputContainer}>
          <p>Verification</p>
          <label htmlFor="proof" className={classes.proofInput}>
            <img src={imageIcon} alt="image icon" className='image-icon'/>
            Upload photo of primary ID and store exterior
          </label>
          <input type="file" name="proof" id="proof" accept="image/*" className={classes.fileInput}/>
        </div>
      </>
    );
  } else {
    storeInput = null;
  }

  return (
    <div className={classes.backgroundPhoto}>
      <div className={classes.container}>
        <img src={logo} alt="Preloved logo" className={classes.logo} />
        <form action="post">
          <legend className={classes.legend}>
            <h1>Create your account</h1>
            <p>
              Want to create a seller account?{' '}
              <a href="#" onClick={handleUserStatus} className={classes.link}>
                Click Here
              </a>
            </p>
          </legend>
          <div className={classes.inputContainer}>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              name="username"
              id="username"
              className={classes.textInput}
            />
          </div>
          <div className={classes.oneRowResponsive}>
            <div className={classes.inputContainer}>
              <label htmlFor="username">Password</label>
              <input
                type="password"
                name="password"
                id="password"
                className={classes.textInput}
              />
            </div>
            <div className={classes.inputContainer}>
              <label htmlFor="username">Confirm Password</label>
              <input
                type="password"
                name="confirmPass"
                id="confirmPass"
                className={classes.textInput}
              />
            </div>
          </div>
          <div className={classes.oneRowResponsive}>
            <div className={classes.inputContainer}>
              <label htmlFor="username">E-mail</label>
              <input type="email" name="email" id="email" className={classes.textInput} />
            </div>
            <div className={classes.inputContainer}>
              <label htmlFor="username">Date of Birth</label>
              <input
                type="date"
                name="birthdate"
                id="birthdate"
                className={`${classes.textInput} ${classes.dateInput}`}
              />
            </div>
          </div>
          {storeInput}
          <button type="submit" className={classes.signupButton}>
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}
