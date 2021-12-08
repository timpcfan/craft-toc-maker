import React = require("react");

export interface Settings {
  collapsible: boolean;
  includePages: boolean;
  includeParagraph: boolean;
  tocStyle: string;
  listType: string;
  insertPosition: string;
}

export function getSettings(): Settings {
  return {
    collapsible: (
      document.getElementById("switch-collapsible") as HTMLInputElement
    ).checked,
    includePages: (
      document.getElementById("switch-include-page") as HTMLInputElement
    ).checked,
    includeParagraph: (
      document.getElementById("switch-include-starters") as HTMLInputElement
    ).checked,
    tocStyle: (document.getElementById("select-toc-style") as HTMLInputElement)
      .value,
    listType: (document.getElementById("select-list-type") as HTMLInputElement)
      .value,
    insertPosition: (
      document.getElementById("select-insert-position") as HTMLInputElement
    ).value,
  };
}

export function useCraftDarkMode() {
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  React.useEffect(() => {
    craft.env.setListener((env) => setIsDarkMode(env.colorScheme === "dark"));
  }, []);

  return isDarkMode;
}
