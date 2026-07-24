/**
 * Idotte Design Tokens
 *
 * Non-CSS values that can be reused throughout the application.
 */

export const theme = {
  radius: {
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "20px",
  },

  layout: {
    pageWidth: "max-w-7xl",
    contentWidth: "max-w-5xl",
  },

  spacing: {
    section: "py-12",
    page: "py-16",
  },

  animation: {
    fast: 150,
    normal: 250,
  },

  upload: {
    maxFileSize: "25MB",
    supportedExcel: [".xlsx", ".xls"],
    supportedPdf: [".pdf"],
  },
} as const;