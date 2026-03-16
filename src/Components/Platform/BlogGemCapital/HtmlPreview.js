import React from "react";
import styles from "./HtmlPreviewStyle";

const HtmlPreview = ({ html }) => {
  return (
    <div style={styles.previewContainer}>
      <div style={styles.previewHeader}>
        <h3 style={styles.previewTitle}>👁️ Preview do HTML</h3>
      </div>
      <div
        style={styles.previewContent}
        dangerouslySetInnerHTML={{
          __html: html || "<p style='color:#999;'>Nada para visualizar</p>",
        }}
      />
    </div>
  );
};

export default HtmlPreview;
