import { useState } from 'react';
import axios from 'axios';

import logo from '../assets/preloved-logo.jpg';
import imageIcon from '../assets/icons/imageIcon.svg';
import classes from './SignUp.module.css';

const domain = 'https://prelovedbackends.azurewebsites.net/';
const userNavText = 'Want to create a seller account?';
const sellerNavText = 'Want to create a user account?';


export default function SignUp() {
  const [isStore, setIsStore] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [fName, setFName] = useState('');
  const [lName, setLName] = useState('');
  const [phone, setPhone] = useState('');
  const [isFeminine, setIsFeminine] = useState('Masculine');

  let storeInput = null;

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);
      formData.append('first_name', fName);
      formData.append('last_name', lName);
      formData.append('phone_no', phone);
      formData.append('isFeminine', isFeminine);

      const response = await axios
        .post(domain + 'auth/new_shop_user/', formData)
        .then((response) => {
          console.log(response.data)
        })
        .catch((error) => {
          alert('Error:', error);
        });
      // alert(response);
    } catch (error) {
      // alert(error);
    }
    // axios
    //   .post(domain + 'auth/new_shop_user/', {
    //     email: email,
    //     password: password,
    //     first_name: fName,
    //     last_name: lName,
    //     phone_no: phone,
    //     isFeminine: isFeminine,
    //   })
    //   .then((response) => {
    //     console.log(response.data)
    //   })
    //   .catch((error) => {
    //     alert('Error:', error);
    //   });
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
            placeholder="Street Name"
          />
          <div className={classes.oneRowResponsive}>
            <input
              type="text"
              name="barangay"
              id="barangay"
              className={`${classes.textInput} ${classes.addressInput}`}
              placeholder="Barangay"
            />
            <input
              type="text"
              name="cityOrMunicipal"
              id="cityOrMunicipal"
              className={`${classes.textInput} ${classes.addressInput}`}
              placeholder="City/Municipal"
            />
          </div>
        </div>
        <div className={classes.inputContainer}>
          <p>Verification</p>
          <label htmlFor="proof" className={classes.proofInput}>
            <img src={imageIcon} alt="image icon" className="image-icon" />
            Upload photo of primary ID and store exterior
          </label>
          <input
            type="file"
            name="proof"
            id="proof"
            accept="image/*"
            className={classes.fileInput}
          />
        </div>
      </>
    );
  } else {
    storeInput = (
      <div className={classes.inputContainer}>
        <p>Which type of clothes do you want to wear?</p>
        <div className={classes.radioGroupContainer}>
          <div className={classes.radioContainer}>
            <input
              type="radio"
              name="isFeminine"
              id="masculine"
              checked={isFeminine === 'Masculine'}
              onChange={() => setIsFeminine('Masculine')}
            />
            <label htmlFor="masculine">Masculine</label>
          </div>
          <div className={classes.radioContainer}>
            <input
              type="radio"
              name="isFeminine"
              id="Feminine"
              value={true}
              checked={isFeminine === 'Feminine'}
              onChange={() => setIsFeminine('Feminine')}
            />
            <label htmlFor="Feminine">Feminine</label>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={classes.backgroundPhoto}>
      <div className={classes.container}>
        <img src={logo} alt="Preloved logo" className={classes.logo} />
        <form action="post" onSubmit={handleSubmit}>
          <legend className={classes.legend}>
            <h1>Create your account</h1>
            <p>
              {isStore ? sellerNavText : userNavText}{' '}
              <a
                href="#"
                onClick={() => setIsStore(!isStore)}
                className={classes.link}
              >
                Click Here
              </a>
            </p>
            <p>
              Already have an account?{' '}
              <a
                href="/"
                className={classes.link}
              >
                Click Here
              </a>
            </p>
          </legend>
          <div className={classes.inputContainer}>
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              name="email"
              id="email"
              className={classes.textInput}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className={classes.oneRowResponsive}>
            <div className={classes.inputContainer}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                id="password"
                className={classes.textInput}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className={classes.inputContainer}>
              <label htmlFor="confirmPass">Confirm Password</label>
              <input
                type="password"
                name="confirmPass"
                id="confirmPass"
                className={classes.textInput}
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
              />
            </div>
          </div>
          <div className={classes.oneRowResponsive}>
            <div className={classes.inputContainer}>
              <label htmlFor="fname">First Name</label>
              <input
                type="text"
                name="fname"
                id="fname"
                className={classes.textInput}
                value={fName}
                onChange={(e) => setFName(e.target.value)}
              />
            </div>
            <div className={classes.inputContainer}>
              <label htmlFor="lname">Last Name</label>
              <input
                type="text"
                name="lname"
                id="lname"
                className={classes.textInput}
                value={lName}
                onChange={(e) => setLName(e.target.value)}
              />
            </div>
          </div>
          <div className={classes.oneRowResponsive}>
            <div className={classes.inputContainer}>
              <label htmlFor="email">Phone Number</label>
              <input
                type="tel"
                name="phone"
                id="phone"
                pattern="[0-9]{11}"
                placeholder="Ex. 09325469943"
                className={classes.textInput}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
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
