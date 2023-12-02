import leftArrow from '../../assets/icons/leftArrow.svg';
import visaLogo from '../../assets/logos/visaLogo.png';
import mastercardLogo from '../../assets/logos/mastercardLogo.png';
import amexLogo from '../../assets/logos/amexLogo.png';
import jcbLogo from '../../assets/logos/jcbLogo.png';

import classes from './Invoice.module.css';

export default function Invoice() {
  return (
    <div className={classes.container}>
      <div className={classes.backAndTitle}>
        <img src={leftArrow} alt="Back to home icon" />
        <h1>Invoice</h1>
      </div>
      <div className={classes.desktopTwoColumns}>
        <div className={classes.cardContainer}>
          <img src={visaLogo} alt="" className={classes.cardLogo} />
          <img src={mastercardLogo} alt="" className={classes.cardLogo} />
          <img src={jcbLogo} alt="" className={classes.cardLogo} />
          <img src={amexLogo} alt="" className={classes.cardLogo} />
        </div>
        <form action="post" className={classes.formContainer}>
          <div className={classes.inputContainer}>
            <label htmlFor="cardNum">Card Number</label>
            <input
              type="text"
              name="cardNum"
              id="cardNum"
              className={classes.textInput}
              placeholder='Ex. 5343 0949 0425 8223'
            />
          </div>
          <div className={classes.inputContainer}>
            <label htmlFor="username">Name on card</label>
            <input
              type="text"
              name="cardName"
              id="cardName"
              className={classes.textInput}
            />
          </div>
          <div className={classes.inputContainer}>
            <label htmlFor="username">Address</label>
            <input
              type="text"
              name="address"
              id="address"
              className={classes.textInput}
            />
          </div>
          <div className={classes.twoInputRow}>
            <div className={`${classes.inputContainer} ${classes.expDate}`}>
              <label htmlFor="username">Expiry date</label>
              <input
                type="month"
                name="expDate"
                id="expDate"
                className={classes.textInput}
              />
            </div>
            <div className={`${classes.inputContainer} ${classes.secCode}`}>
              <label htmlFor="username">Security Code</label>
              <input
                type="text"
                name="secCode"
                id="secCode"
                className={classes.textInput}
              />
            </div>
          </div>
          <button className={classes.signupButton}>PROCESS PAYMENT</button>
        </form>
      </div>
    </div>
  );
}
