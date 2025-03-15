export const theme = {
  colors: {
    white: "#fff",
    black: "#000",
    grayBG: "#e5e5e5",
    neutral: (opacity: any) => `rgba(245,245,245, ${opacity})`,
  },
  fontWeights: {
    medium: "500" as const,
    semibold: "600" as const,
    bold: "700" as const,
  },
  radius: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
  },
};
