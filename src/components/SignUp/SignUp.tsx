import { useEffect, useState } from "react";
import axios from "axios";
import { useMutation } from "react-query";

import logo from "../../assets/preloved-logo.jpg";
import classes from "./SignUp.module.css";
import { Navigate } from "react-router-dom";

const domain = "https://prelovedbackends.azurewebsites.net/";
const userNavText = "Want to create a seller account?";
const sellerNavText = "Want to create a user account?";
let endpoint = "auth/new_shop_user";

export default function SignUp() {
  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
  
    if (userInfo !== null) {
      window.location.replace("/frontpage");
    }
  }, []);

  const [isStore, setIsStore] = useState(false);
  const [formState, setFormState] = useState({
    email: "",
    password: "",
    confirmPass: "",
    fName: "",
    lName: "",
    phone: "",
    isFeminine: "Masculine",
    street: "",
    barangay: "",
    municipality: "",
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const [signUpSuccess, setSuccessful] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const mutation = useMutation(
    (data: FormData) => axios.post(domain + endpoint, data),
    {
      onSuccess: (data) => {
        console.log(data);
        setIsLoading(false);
        setSuccessful(true);
      },
    }
  );

  useEffect(() => {
    document.body.style.cursor = isLoading ? "wait" : "default";
  }, [isLoading]);

  useEffect(() => {
    endpoint = isStore ? "auth/new_shop_owner" : "auth/new_shop_user";
  }, [isStore]);

  let storeInput = null;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData();
    formData.append("email", formState.email);
    formData.append("password", formState.password);
    formData.append("first_name", formState.fName);
    formData.append("last_name", formState.lName);
    formData.append("phone_no", formState.phone);

    if (isStore)
      formData.append(
        "address",
        `${formState.street} ${formState.barangay} ${formState.municipality}`
      );
    else formData.append("isFeminine", formState.isFeminine);

    console.log(formData);
    console.log(formState);
    setIsLoading(true);
    mutation.mutate(formData);
  }

  if (isStore) {
    storeInput = (
      <>
        <div className={classes.inputContainer}>
          <label htmlFor="street">Shop Address</label>
          <input
            type="text"
            name="street"
            id="street"
            value={formState.street}
            onChange={handleChange}
            className={`${classes.textInput} ${classes.addressInput}`}
            placeholder="Street Name"
          />
          <div className={classes.oneRowResponsive}>
            <input
              type="text"
              name="barangay"
              id="barangay"
              value={formState.barangay}
              onChange={handleChange}
              className={`${classes.textInput} ${classes.addressInput}`}
              placeholder="Barangay"
            />
            <input
              type="text"
              name="municipality"
              id="municipality"
              value={formState.municipality}
              onChange={handleChange}
              className={`${classes.textInput} ${classes.addressInput}`}
              placeholder="City/Municipality"
            />
          </div>
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
              value="Masculine"
              checked={formState.isFeminine === "Masculine"}
              onChange={handleChange}
            />
            <label htmlFor="masculine">Masculine</label>
          </div>
          <div className={classes.radioContainer}>
            <input
              type="radio"
              name="isFeminine"
              id="Feminine"
              value="Feminine"
              checked={formState.isFeminine === "Feminine"}
              onChange={handleChange}
            />
            <label htmlFor="Feminine">Feminine</label>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={classes.backgroundPhoto}>
      {signUpSuccess && <Navigate to="/" replace={true} />}
      <div className={classes.container}>
        <img src={logo} alt="Preloved logo" className={classes.logo} />
        <form action="post" onSubmit={handleSubmit}>
          <legend className={classes.legend}>
            <h1>Create your account</h1>
            <p>
              {isStore ? sellerNavText : userNavText}{" "}
              <a
                href="#"
                onClick={() => setIsStore(!isStore)}
                className={classes.link}
              >
                Click Here
              </a>
            </p>
            <p>
              Already have an account?{" "}
              <a href="/" className={classes.link}>
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
              value={formState.email}
              onChange={handleChange}
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
                value={formState.password}
                onChange={handleChange}
              />
            </div>
            <div className={classes.inputContainer}>
              <label htmlFor="confirmPass">Confirm Password</label>
              <input
                type="password"
                name="confirmPass"
                id="confirmPass"
                className={classes.textInput}
                value={formState.confirmPass}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className={classes.oneRowResponsive}>
            <div className={classes.inputContainer}>
              <label htmlFor="fName">First Name</label>
              <input
                type="text"
                name="fName"
                id="fName"
                className={classes.textInput}
                value={formState.fName}
                onChange={handleChange}
              />
            </div>
            <div className={classes.inputContainer}>
              <label htmlFor="lName">Last Name</label>
              <input
                type="text"
                name="lName"
                id="lName"
                className={classes.textInput}
                value={formState.lName}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className={classes.oneRowResponsive}>
            <div className={classes.inputContainer}>
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                name="phone"
                id="phone"
                pattern="[0-9]{11}"
                placeholder="Ex. 09325469943"
                className={classes.textInput}
                value={formState.phone}
                onChange={handleChange}
              />
            </div>
          </div>
          {storeInput}
          <button
            type="submit"
            className={`${classes.signupButton} ${
              isLoading && classes.signupLoading
            }`}
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}
