import React from "react";
import css from "../../../assets/componentCSS/commonStuff/Dialogs.module.css";
import loading from "../../../assets/loading.gif";
import success from "../../../assets/icons/success.svg";
import error from "../../../assets/icons/error.svg";

const handleCloseDialogOutside = (
  event: React.MouseEvent<HTMLDialogElement>,
  id: string
) => {
  const dialog = document.querySelector(`#${id}`) as HTMLDialogElement;
  const dialogDimensions = dialog.getBoundingClientRect();
  if (
    event.clientX < dialogDimensions.left ||
    event.clientX > dialogDimensions.right ||
    event.clientY < dialogDimensions.top ||
    event.clientY > dialogDimensions.bottom
  ) {
    dialog.close();
  }
};

interface IconTextProps {
  text: string;
  icon: string;
  id: string;
}

const IconTextDialog: React.FC<IconTextProps> = ({ text, icon, id }) => {
  return (
    <>
      <dialog
        id={id}
        className={css.dialog}
        onClick={(e) => handleCloseDialogOutside(e, id)}
      >
        <div className={css.iconContainer}>
          <img src={icon} alt="" className={css.icon} />
          <p>{text}</p>
        </div>
      </dialog>
    </>
  );
};

const LoadingDialog: React.FC = () => {
  return (
    <>
      <dialog id="loadingDialog" className={css.dialog}>
        <img src={loading} alt="" className={css.loading} />
      </dialog>
    </>
  );
};

const SuccessDialog: React.FC<{ text: string }> = ({ text }) => {
  return <IconTextDialog text={text} icon={success} id="successDialog" />;
};

const ErrorDialog: React.FC<{ text: string }> = ({ text }) => {
  return <IconTextDialog text={text} icon={error} id="errorDialog" />;
};

export { IconTextDialog, SuccessDialog, ErrorDialog };
export default LoadingDialog;
