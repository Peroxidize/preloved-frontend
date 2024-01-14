import { useEffect, useState } from "react";
import axios from "axios";
import { useMutation } from "react-query";

import logo from "../../assets/preloved-logo.jpg";
import classes from "./SignUp.module.css";
import { Link, Navigate, useNavigate } from "react-router-dom";
import LoadingDialog, {
  ErrorDialog,
  IconTextDialog,
  SuccessDialog,
} from "../fragments/commonstuff/Dialogs";
import error from "../../assets/icons/error.svg"

const domain = "https://prelovedbackend.azurewebsites.net/";
const userNavText = "Want to create a seller account?";
const sellerNavText = "Want to create a user account?";
let endpoint = "auth/new_shop_user";

export default function SignUp() {
  const navigate = useNavigate();

  const [isStore, setIsStore] = useState(false);
  const [formState, setFormState] = useState({
    email: "",
    password: "",
    confirmPass: "",
    fName: "",
    lName: "",
    phone: "",
    isFeminine: 0,
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
    (data: FormData) => axios.post(domain + endpoint, data, { withCredentials: true }),
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

    if (formState.password !== formState.confirmPass) {
      alert("Passwords do not match!");
      return;
    }

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
    else formData.append("isFeminine", formState.isFeminine.toString());

    console.log(formData);
    console.log(formState);
    setIsLoading(true);
    mutation.mutate(formData);
  }

  if (isStore) {
    storeInput = (
      <>
        <div className={classes.inputContainer}>
          <label htmlFor="street">Address</label>
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
              value={0}
              checked={formState.isFeminine == 0}
              onChange={handleChange}
            />
            <label htmlFor="masculine">Masculine</label>
          </div>
          <div className={classes.radioContainer}>
            <input
              type="radio"
              name="isFeminine"
              id="Feminine"
              value={1}
              checked={formState.isFeminine == 1}
              onChange={handleChange}
            />
            <label htmlFor="Feminine">Feminine</label>
          </div>
        </div>
      </div>
    );
  }

  useEffect(() => {
    const loadingDialog = document.querySelector("#loadingDialog") as HTMLDialogElement;
    if (mutation.isLoading) {
      loadingDialog.showModal();
    }
    if (mutation.isError) {
      loadingDialog.close();
      const errorDialog = document.querySelector("#errorDialog") as HTMLDialogElement;
      errorDialog.showModal();
      setTimeout(() => errorDialog.close());
    }
    if (mutation.isSuccess) {
      loadingDialog.close();
      const successDialog = document.querySelector("#successDialog") as HTMLDialogElement;
      successDialog.showModal();
      setTimeout(() => {
        successDialog.close();
        navigate("/");
      }, 3000);
    }
  }, [mutation.isLoading, mutation.isError, mutation.isSuccess]);

  return (
    <div className={classes.backgroundPhoto}>
      <LoadingDialog />
      <SuccessDialog text="Sign up successful!" />
      <ErrorDialog text="Sign up failed!" />
      <IconTextDialog text=""
      <div className={classes.container}>
        <img src={logo} alt="Preloved logo" className={classes.logo} />
        <form action="post" onSubmit={handleSubmit}>
          <legend className={classes.legend}>
            <h1>Create your account</h1>
            <p>
              {isStore ? sellerNavText : userNavText}{" "}
              <a href="#" onClick={() => setIsStore(!isStore)} className={classes.link}>
                Click Here
              </a>
            </p>
            <p>
              Already have an account?{" "}
              <Link to="/" className={classes.link}>
                Click Here
              </Link>
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
            className={`${classes.signupButton} ${isLoading && classes.signupLoading}`}
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}
