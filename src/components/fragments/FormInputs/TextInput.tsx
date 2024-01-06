import { UseFormRegister } from "react-hook-form";
import classes from "../../../assets/componentCSS/formComponents/TextInput.module.css";

interface TextInputProps {
  label: string;
  placeholder?: string;
  name: string;
  type: "text" | "email" | "password";
  required: boolean;
  register: UseFormRegister<any>;
}

const TextInput: React.FC<TextInputProps> = ({ ...props }) => {
  return (
    <div className={classes.inputContainer}>
      <label htmlFor={props.label}>{props.label}</label>
      <input
        type={props.type}
        id={props.label}
        className={classes.textInput}
        placeholder={props.placeholder}
        {...props.register(props.name, { required: props.required })}
      />
    </div>
  );
};

export default TextInput;
