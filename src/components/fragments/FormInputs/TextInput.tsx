import { UseFormRegister } from "react-hook-form";
import classes from "../../../assets/componentCSS/formComponents/TextInput.module.css";

interface TextInputProps {
  label?: string;
  placeholder?: string;
  name: string;
  type: "text" | "email" | "password" | "number";
  required: boolean;
  register: UseFormRegister<any>;
  containerClasses?: string;
}

const TextInput: React.FC<TextInputProps> = ({ ...props }) => {
  return (
    <div className={`${classes.inputContainer} ${props.containerClasses}`}>
      {props.label && <label htmlFor={props.label}>{props.label}</label>}
      <input
        type={props.type}
        id={props.name}
        className={classes.textInput}
        placeholder={props.placeholder}
        step={props.type === "number" ? "any" : undefined}
        {...props.register(props.name, { required: props.required })}
      />
    </div>
  );
};

export default TextInput;
