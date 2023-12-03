import beigeJacket from '../../assets/clothes/beige-jacket.jpg';
import blueBoxer from '../../assets/clothes/blue-boxer-shorts.jpg';
import checkeredSweater from '../../assets/clothes/checkered-sweater.jpg';
import greySlacks from '../../assets/clothes/grey-slacks.jpg';
import khakiJacket from '../../assets/clothes/khaki-jacket.jpg';
import greenSweater from '../../assets/clothes/green-sweater.jpg';

import leftArrow from '../../assets/icons/leftArrow.svg';
import rightArrow from '../../assets/icons/rightArrow.svg';
import visaLogo from '../../assets/logos/visaLogo.png';
import mastercardLogo from '../../assets/logos/mastercardLogo.png';
import amexLogo from '../../assets/logos/amexLogo.png';
import jcbLogo from '../../assets/logos/jcbLogo.png';

import { useState } from 'react';

import classes from './Ordering.module.css';

export default function Ordering() {
  const [selectedOption, setSelectedOption] = useState('');

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div className={classes.container}>
      <div className={classes.backAndTitle}>
        <img src={leftArrow} alt="Back to home icon" />
        <h1>Ordering</h1>
      </div>
      <div className={classes.clothesContainer}>
        <div className={classes.clothesDetails}>
          <img
            src={beigeJacket}
            alt="Item you bought"
            className={classes.clothes}
          />
          <div className={classes.textDetails}>
            <h3>Beige Jacket</h3>
            <p>₱200</p>
          </div>
        </div>
        <div className={classes.clothesDetails}>
          <img
            src={blueBoxer}
            alt="Item you bought"
            className={classes.clothes}
          />
          <div className={classes.textDetails}>
            <h3>Blue boxers</h3>
            <p>₱200</p>
          </div>
        </div>
        <div className={classes.clothesDetails}>
          <img
            src={checkeredSweater}
            alt="Item you bought"
            className={classes.clothes}
          />
          <div className={classes.textDetails}>
            <h3>Checkered Sweater</h3>
            <p>₱200</p>
          </div>
        </div>
        <div className={classes.clothesDetails}>
          <img
            src={greySlacks}
            alt="Item you bought"
            className={classes.clothes}
          />
          <div className={classes.textDetails}>
            <h3>Grey Slacks</h3>
            <p>₱200</p>
          </div>
        </div>
        <div className={classes.clothesDetails}>
          <img
            src={khakiJacket}
            alt="Item you bought"
            className={classes.clothes}
          />
          <div className={classes.textDetails}>
            <h3>Khaki Jacket</h3>
            <p>₱200</p>
          </div>
        </div>
        <div className={classes.clothesDetails}>
          <img
            src={greenSweater}
            alt="Item you bought"
            className={classes.clothes}
          />
          <div className={classes.textDetails}>
            <h3>Green Sweater</h3>
            <p>₱200</p>
          </div>
        </div>
      </div>
      <div>
        <p className={classes.totalPayment}>
          <strong>Total: </strong>₱1200
        </p>
        <form action="" method="post" className={classes.payMethods}>
          <h4>Payment Methods:</h4>
          <div className={classes.radioContainer}>
            <input
              type="radio"
              name="payMethod"
              id="card"
              value="card"
              onChange={handleOptionChange}
              checked={selectedOption === 'card'}
              required
            />
            <label htmlFor="card">Credit Card</label>
            <img src={visaLogo} alt="" className={classes.cardLogo} />
            <img src={mastercardLogo} alt="" className={classes.cardLogo} />
            <img src={jcbLogo} alt="" className={classes.cardLogo} />
            <img src={amexLogo} alt="" className={classes.cardLogo} />
          </div>
          <div className={classes.radioContainer}>
            <input
              type="radio"
              name="payMethod"
              id="onHand"
              value="onHand"
              onChange={handleOptionChange}
              checked={selectedOption === 'onHand'}
              required
            />
            <label htmlFor="onHand">Cash On-Hand</label>
          </div>
          <button className={classes.payButton}>
            PROCEED TO PAYMENT{' '}
            <img src={rightArrow} alt="" className={classes.rightArrow} />
          </button>
        </form>
      </div>
    </div>
  );
}
