import css from "../../../assets/componentCSS/commonStuff/Loading.module.css";
import frontPageCSS from "../../FrontPage/frontpage.module.css";
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

const LoadingCard: React.FC = () => {
  return (
    <div className={frontPageCSS.item_container}>
      <div className={`${frontPageCSS.img} ${utilcss.skeleton}`} />
      <div className={frontPageCSS.information_container}>
        <div className={`${utilcss.skeleton} ${frontPageCSS.loadingTitle}`} />
        <div className={`${utilcss.skeleton} ${frontPageCSS.loadingStore}`} />
        <div className={`${utilcss.skeleton} ${frontPageCSS.loadingPrice}`} />
      </div>
    </div>
  );
};

export { LoadingBigText, LoadingTag, LoadingButton, LoadingImg, LoadingSmallText, LoadingCard };
export default LoadingText;
