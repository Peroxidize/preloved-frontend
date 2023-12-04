import classes from "./ShopDocumentation.module.css";

import leftArrow from "../../assets/icons/leftArrow.svg";
import imageIcon from "../../assets/icons/imageIcon.svg";

const domain = "https://prelovedbackends.azurewebsites.net/";
let endpoint = "auth/shop_id_one";

const ShopDocumentation: React.FC = () => {
  return (
    <div className={classes.container}>
      <div className={classes.backAndTitle}>
        <img src={leftArrow} alt="Back to home icon" />
        <h1>Shop Documentation</h1>
      </div>
      <p className={classes.description}>
        To proceed to shop curation, we must verify your shop. Prepare two valid
        IDs and one selfie picture.
      </p>
      <form action="" method="post">
        <div className={classes.uploadContainer}>
          <label htmlFor="firstID">
            <p className={classes.fileLabel}>Upload first valid ID</p>
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
          />
        </div>
      </form>
    </div>
  );
};

export default ShopDocumentation;
