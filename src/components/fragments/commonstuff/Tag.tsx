import React from "react";
import css from "../../../assets/componentCSS/commonStuff/Tag.module.css";

const Tag: React.FC<{ children: React.ReactNode; isPrimary?: boolean }> = ({
  children,
  isPrimary,
}) => {
  // Rest of the code...
  return <div className={`${css.tags} ${!isPrimary && css.secondary}`}>{children}</div>;
};

export default Tag;
