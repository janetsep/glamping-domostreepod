
import React from "react";

/**
 * Helper function to create icon elements more safely
 */
export const createIcon = (Icon: React.ElementType) => {
  return React.createElement(Icon, { size: 18 });
};
