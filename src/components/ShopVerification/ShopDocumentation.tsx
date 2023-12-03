import classes from "./ShopDocumentation.module.css";

import leftArrow from "../../assets/icons/leftArrow.svg";

const ShopDocumentation: React.FC = () => {
  return (
    <div className={classes.container}>
      <div className={classes.backAndTitle}>
        <img src={leftArrow} alt="Back to home icon" />
        <h1>Shop Documentation</h1>
      </div>
    </div>
  );
};

export default ShopDocumentation;
