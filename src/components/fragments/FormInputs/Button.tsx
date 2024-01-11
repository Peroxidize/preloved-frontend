import classes from "../../../assets/componentCSS/formComponents/Button.module.css";

interface ButtonProps {
  text: string;
  handleClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  isPrimary?: boolean;
}

const Button: React.FC<ButtonProps> = ({ text, handleClick, isPrimary }) => {
  return (
    <button
      className={`${classes.button} ${!isPrimary && classes.secondary}`}
      onClick={handleClick}
    >
      {text}
    </button>
  );
};

export default Button;
