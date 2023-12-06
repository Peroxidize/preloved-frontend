import { useState } from "react";

import Button from "../fragments/FormInputs/Button";
import NavBar from "../fragments/nav-bar/nav-bar";
import classes from "./AddBalance.module.css";

import visaLogo from "../../assets/logos/visaLogo.png";
import mastercardLogo from "../../assets/logos/mastercardLogo.png";
import amexLogo from "../../assets/logos/amexLogo.png";
import jcbLogo from "../../assets/logos/jcbLogo.png";
import mayaLogo from "../../assets/logos/mayaLogo.jpg";
import gcashLogo from "../../assets/logos/gcashLogo.png";

const AddBalance: React.FC = () => {
  const [amount, setAmount] = useState(0.0);
  const [selectedMethod, setSelectedMethod] = useState("card");
  const handleMethodChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedMethod(event.target.value);
  };
  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(+event.target.value);
  };
  return (
    <>
      <NavBar />
      <div className={classes.container}>
        <h1>Add Balance</h1>
        <form action="" method="post" className={classes.formContainer}>
          <div className={classes.inputContainer}>
            <label htmlFor="addBalance">Amount</label>
            <input
              type="text"
              name="addBalance"
              id="addBalance"
              inputMode="numeric"
              value={amount}
              onChange={handleAmountChange}
              className={classes.numberInput}
            />
          </div>
          <div className={classes.payMethods}>
            <p>Payment Method:</p>
            <div className={classes.radioContainer}>
              <input
                type="radio"
                name="payMethod"
                id="card"
                value="card"
                onChange={handleMethodChange}
                checked={selectedMethod === "card"}
                required
              />
              <label htmlFor="card">Credit Card</label>
              <div className={classes.logoContainer}>
                <img src={visaLogo} alt="" className={classes.cardLogo} />
                <img src={mastercardLogo} alt="" className={classes.cardLogo} />
                <img src={jcbLogo} alt="" className={classes.cardLogo} />
                <img src={amexLogo} alt="" className={classes.cardLogo} />
              </div>
            </div>
            <div className={classes.radioContainer}>
              <input
                type="radio"
                name="payMethod"
                id="eWallets"
                value="eWallets"
                onChange={handleMethodChange}
                checked={selectedMethod === "eWallets"}
                required
              />
              <label htmlFor="onHand">eWallets</label>
              <div className={classes.logoContainer}>
                <img src={mayaLogo} alt="" className={classes.eWalletLogo} />
                <img src={gcashLogo} alt="" className={classes.eWalletLogo} />
              </div>
            </div>
          </div>
          <Button text="ADD BALANCE" />
        </form>
      </div>
    </>
  );
};

export default AddBalance;
