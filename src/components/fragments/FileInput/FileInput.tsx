import classes from "./FileInput.module.css";
import imageIcon from "../../../assets/icons/imageIcon.svg";

interface FileInputProps {
  name: string;
  onChange: (files: FileList) => void;
  label?: string;
}

const FileInput: React.FC<FileInputProps> = ({ name, onChange, label }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(event.target.files!);
    }
  };

  return (
    <div className={classes.uploadContainer}>
      <label htmlFor={name}>
        <p className={classes.fileLabel}>{label}</p>
        <div className={classes.uploadHere}>
          <img src={imageIcon} alt="" className={classes.imageIcon} />
          <p>Upload here</p>
        </div>
      </label>
      <input
        type="file"
        name="firstID"
        id="firstID"
        className={classes.fileInput}
        onChange={handleChange}
      />
    </div>
  );
};

export default FileInput;
