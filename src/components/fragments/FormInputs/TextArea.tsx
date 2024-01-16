import css from "../../../assets/componentCSS/formComponents/TextArea.module.css";
import { capitalizeFirstLetter } from "../../misc";

interface TextAreaProps {
  rows: number;
  placeholder?: string;
  register: any;
  name: string;
  label?: string;
  required?: boolean;
  errors?: string;
}

const TextArea: React.FC<TextAreaProps> = ({
  rows,
  placeholder,
  register,
  name,
  label,
  required,
  errors,
}) => {
  return (
    <div className={css.textAreaContainer}>
      <label htmlFor={name}>{label}</label>
      <textarea
        id={name}
        rows={rows}
        placeholder={placeholder}
        {...register(name, { required: required && `${capitalizeFirstLetter(name)} is required` })}
        className={css.textArea}
      ></textarea>
      <div className={css.errors}>{errors}</div>
    </div>
  );
};

export default TextArea;
