import { useNavigate } from "react-router-dom";
import classes from "../../../assets/componentCSS/commonStuff/BackAndTitle.module.css";
import leftArrow from "../../../assets/icons/leftArrow.svg";

interface BackAndTitleProps {
  title: string;
  backTo: string;
}

const BackAndTitle: React.FC<BackAndTitleProps> = ({ title, backTo }) => {
  const navigate = useNavigate();
  return (
    <div className={classes.backAndTitle}>
      <img src={leftArrow} alt="Back to home icon" onClick={() => navigate(backTo)} />
      <h1>{title}</h1>
    </div>
  );
};

export default BackAndTitle;
