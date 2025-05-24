const getTransparentColor = (color: string | undefined) => {
  switch (color) {
    case "red": return "rgba(255, 0, 0, 0.4)";
    case "green": return "rgba(0, 255, 0, 0.4)";
    case "blue": return "rgba(0, 0, 255, 0.4)";
    case "purple": return "rgba(128, 0, 128, 0.4)";
    default: return "rgba(255, 255, 0, 0.4)";
  }
};

export default getTransparentColor;