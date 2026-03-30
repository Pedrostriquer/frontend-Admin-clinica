import React from "react";
import styles from "./BlogGemCapitalStyle";

const BlogGemCapitalContainer = ({ children }) => {

  return (
    <div style={styles.container}>
      {/* Content */}
      <div style={styles.contentArea}>{children}</div>
    </div>
  );
};

export default BlogGemCapitalContainer;
