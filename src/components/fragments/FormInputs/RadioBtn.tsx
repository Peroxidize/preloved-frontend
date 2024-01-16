import css from "../../../assets/componentCSS/formComponents/RadioBtn.module.css";
interface RadioBtnProps {
  register: any;
  value: string | number;
  group: string;
  required: boolean;
  label: string;
  id: string;
}
const RadioBtn: React.FC<RadioBtnProps> = ({ register, value, group, required, label, id }) => {
  return (
    <div className={css.radioContainer}>
      <input
        {...register(group, { required: required && "This field is required." })}
        type="radio"
        value={value}
        id={id}
        className={css.radioInput}
      />
      <label htmlFor={id} className={css.radioBtn}>
        <div className={css.whiteCircle}>
          <div className={css.blackCircle}>{""}</div>
        </div>
        {label}
      </label>
    </div>
  );
};

export default RadioBtn;
