import * as React from "react";
import * as ReactDOM from "react-dom";
import Selector from "./components/selector";
import Switch from "./components/switch";
import handleGenerate from "./core";
import { useCraftDarkMode } from "./utils";

const App: React.FC<{}> = () => {
  const isDarkMode = useCraftDarkMode();
  React.useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <span className="mt-2 fw-bolder">ToC Maker</span>
        <div>
          <hr className="mt-2" />
          <label className="fw-bold">Advance Settings</label>
          <Switch
            id="switch-collapsible"
            info="Make collapsible ToC"
            checked={false}
            disabled={false}
          />
          <Switch
            id="switch-include-page"
            info="Include page blocks"
            checked={false}
            disabled={true}
          />
          <Switch
            id="switch-include-starters"
            info="Include paragraph starters"
            checked={false}
            disabled={true}
          />
          <hr />
          <Selector
            id={"select-include-header-level"}
            title={"Include header level"}
            items={["1", "2", "3", "4"]}
            defaultValue={"2"}
            disabled={false}
          />
          <Selector
            id={"select-toc-style"}
            title={"ToC Style"}
            items={["list", "tight", "table (Comming Soon!)"]}
            defaultValue={"list"}
            disabled={false}
          />
          <Selector
            id={"select-list-type"}
            title={"Generate list type"}
            items={["bullet", "toggle", "numbered", "todo", "none"]}
            defaultValue={"bullet"}
            disabled={false}
          />
          <Selector
            id={"select-insert-position"}
            title={"Insert position"}
            items={["top", "bottom"]}
            defaultValue={"top"}
            disabled={false}
          />
          <hr />
        </div>
        <button className={"btn btn-primary mt-3"} onClick={handleGenerate}>
          Generate!
        </button>
      </div>
    </>
  );
};

export function initApp() {
  ReactDOM.render(<App />, document.getElementById("react-root"));
}
