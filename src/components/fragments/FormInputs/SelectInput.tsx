import css from "../../../assets/componentCSS/formComponents/SelectInput.module.css";

interface SelectInputProps {
  label?: string;
  name: string;
  options: string[];
  register: any;
  required: boolean;
  placeholder?: string;
  containerClasses?: string;
}

const SelectInput: React.FC<SelectInputProps> = ({
  label,
  name,
  options,
  register,
  required,
  placeholder,
  containerClasses,
}) => {
  return (
    <div className={`${css.container} ${containerClasses}`}>
      <label htmlFor={name}>{label}</label>
      <select
        id={name}
        {...register(name, { required: required })}
        className={css.selectInput}
        placeholder={placeholder}
      >
        {options.map((option, index) => (
          <option value={option} key={index}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectInput;
