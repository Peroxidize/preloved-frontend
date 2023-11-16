import { useState } from 'react';

import logo from '../assets/preloved-logo.jpg';
import imageIcon from '../assets/imageIcon.svg';
import './SignUp.css';

export default function SignUp() {
  const [isStore, setIsStore] = useState(false);

  let storeInput = null;

  function handleUserStatus() {
    setIsStore(!isStore);
  }

  if (isStore) {
    storeInput = (
      <>
        <div className="input-container">
          <label htmlFor="streetName">Shop Address</label>
          <input
            type="text"
            name="streetName"
            id="streetName"
            className="text-input address-input"
            placeholder='Street Name'
          />
          <div className="one-row-responsive">
            <input
              type="text"
              name="barangay"
              id="barangay"
              className="text-input address-input"
              placeholder='Barangay'
            />
            <input
              type="text"
              name="cityOrMunicipal"
              id="cityOrMunicipal"
              className="text-input address-input"
              placeholder='City/Municipal'
            />
          </div>
        </div>
        <div className="input-container">
          <p>Verification</p>
          <label htmlFor="proof" className="proof-input">
            <img src={imageIcon} alt="image icon" className='image-icon'/>
            Upload photo of primary ID and store exterior
          </label>
          <input type="file" name="proof" id="proof" accept="image/*" />
        </div>
      </>
    );
  } else {
    storeInput = null;
  }

  return (
    <div className="container">
      <img src={logo} alt="Preloved logo" className="logo" />
      <form action="post">
        <legend>
          <h1>Create your account</h1>
          <p>
            Want to create a seller account?{' '}
            <a href="#" onClick={handleUserStatus}>
              Click Here
            </a>
          </p>
        </legend>
        <div className="input-container">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            id="username"
            className="text-input"
          />
        </div>
        <div className="one-row-responsive">
          <div className="input-container">
            <label htmlFor="username">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              className="text-input"
            />
          </div>
          <div className="input-container">
            <label htmlFor="username">Confirm Password</label>
            <input
              type="password"
              name="confirmPass"
              id="confirmPass"
              className="text-input"
            />
          </div>
        </div>
        <div className="one-row-responsive">
          <div className="input-container">
            <label htmlFor="username">E-mail</label>
            <input type="email" name="email" id="email" className="text-input" />
          </div>
          <div className="input-container">
            <label htmlFor="username">Date of Birth</label>
            <input
              type="date"
              name="birthdate"
              id="birthdate"
              className="text-input date-input"
            />
          </div>
        </div>
        {storeInput}
        <button type="submit" className="signup-button">
          Sign Up
        </button>
      </form>
    </div>
  );
}
