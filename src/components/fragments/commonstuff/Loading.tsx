import css from "../../../assets/componentCSS/commonStuff/Loading.module.css";
import utilcss from "../../../utils/utils.module.css";

const LoadingBigText: React.FC = () => {
  return <div className={`${css.loadingBigText} ${utilcss.skeleton}`}>{""}</div>;
};

const LoadingTag: React.FC = () => {
  return <div className={`${css.loadingTag} ${utilcss.skeleton}`}>{""}</div>;
};

const LoadingButton: React.FC = () => {
  return <div className={`${css.loadingButton} ${utilcss.skeleton}`}>{""}</div>;
};

const LoadingImg: React.FC = () => {
  return <div className={`${css.loadingImg} ${utilcss.skeleton}`}>{""}</div>;
};

const LoadingText: React.FC = () => {
  return <div className={`${css.loadingText} ${utilcss.skeleton}`}>{""}</div>;
};

const LoadingSmallText: React.FC = () => {
  return <div className={`${css.loadingSmallText} ${utilcss.skeleton}`}>{""}</div>;
};

export { LoadingBigText, LoadingTag, LoadingButton, LoadingImg, LoadingSmallText };
export default LoadingText;
