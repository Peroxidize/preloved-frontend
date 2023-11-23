import leftArrow from '../assets/icons/leftArrow.svg';
import visaLogo from '../assets/icons/visaLogo.png';
import mastercardLogo from '../assets/icons/mastercardLogo.png';
import amexLogo from '../assets/icons/amexLogo.png';
import jcbLogo from '../assets/icons/jcbLogo.png';

import classes from './Invoice.module.css';

export default function Invoice() {
  return (
    <div className={classes.container}>
      <div className={classes.backAndTitle}>
        <img src={leftArrow} alt="Back to home icon" />
        <h1>Invoice</h1>
      </div>
      <div className={classes.cardContainer}>
        <img src={visaLogo} alt="" className={classes.cardLogo} />
        <img src={mastercardLogo} alt="" className={classes.cardLogo} />
        <img src={jcbLogo} alt="" className={classes.cardLogo} />
        <img src={amexLogo} alt="" className={classes.cardLogo} />
      </div>
    </div>
  );
}
