import React from "react";
import css from "../../../assets/componentCSS/commonStuff/Dialogs.module.css";
import loading from "../../../assets/loading.gif";

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

export { IconTextDialog };
export default LoadingDialog;
