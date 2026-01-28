export const loadFont = (fontFamily: string) => {
  const id = `font-link-${fontFamily.replace(/\s+/g, "-")}`;
  if (!document.getElementById(id)) {
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/\s+/g, "+")}&display=swap`;
    document.head.appendChild(link);
  }
};
 