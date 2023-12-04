import classes from "../../../assets/componentCSS/formComponents/Button.module.css";

interface ButtonProps {
  text: string;
  handleClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const Button: React.FC<ButtonProps> = ({ text, handleClick }) => {
  return (
    <button className={classes.button} onClick={handleClick}>
      {text}
    </button>
  );
};

export default Button;
