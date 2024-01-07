import classes from "../../../assets/componentCSS/formComponents/ImageInput.module.css";
import imageIcon from "../../../assets/icons/imageIcon.svg";

interface ImageInputProps {
  name: string;
  onChange: (files: FileList) => void;
  label?: string;
  fileName?: string;
  photo?: string | null;
  required?: boolean;
}

const ImageInput: React.FC<ImageInputProps> = ({
  name,
  onChange,
  label,
  fileName,
  photo,
  required,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.files!);
  };

  return (
    <div className={classes.uploadContainer}>
      <label htmlFor={name}>
        <p className={classes.fileLabel}>{label}</p>
        <div className={classes.uploadHere}>
          <img
            src={photo ? photo : imageIcon}
            alt={photo ? "Photo uploaded" : "Upload here"}
            className={classes.imageIcon}
          />
          <p>{fileName ? `Uploaded ${fileName}` : "Upload here"}</p>
        </div>
      </label>
      <input
        type="file"
        name={name}
        id={name}
        className={classes.fileInput}
        onChange={handleChange}
        accept="image/*"
        multiple={false}
        required={required}
      />
    </div>
  );
};

export default ImageInput;
