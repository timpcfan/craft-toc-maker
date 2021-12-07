import { CraftTextBlock, ListStyleType } from "@craftdocs/craft-extension-api";
import * as React from "react";
import * as ReactDOM from "react-dom";
import Switch from "./components/switch";

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
            checked={true}
            disable={false}
          />
          <Switch
            id="switch-include-page"
            info="Include page blocks"
            checked={false}
            disable={true}
          />
          <Switch
            id="switch-include-starters"
            info="Include paragraph starters"
            checked={false}
            disable={true}
          />
          <hr />
          <label className="fw-bold">ToC style (Comming soon!)</label>
          <select
            id="select-toc-style"
            className="form-select"
            aria-label="Generate list type select"
            defaultValue="list"
            disabled={true}
          >
            <option value="list">list</option>
            <option value="tight">tight</option>
            <option value="table">table</option>
          </select>
          <hr />
          <label className="fw-bold">Generate list type</label>
          <select
            id="select-list-type"
            className="form-select"
            aria-label="Generate list type select"
            defaultValue="bullet"
          >
            <option value="bullet">bullet</option>
            <option value="toggle">toggle</option>
            <option value="numbered">numbered</option>
            <option value="todo">todo</option>
            <option value="none">none</option>
          </select>
          <hr />
          <label className="fw-bold">Insert position</label>
          <select
            id="select-insert-position"
            className="form-select"
            aria-label="Insert porsition select"
            defaultValue="top"
          >
            <option value="top">top</option>
            <option value="bottom">bottom</option>
          </select>
          <hr />
        </div>
        <button className={"btn btn-primary mt-3"} onClick={handleGenerate}>
          Generate!
        </button>
      </div>
    </>
  );
};

function getSettings() {
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

function useCraftDarkMode() {
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  React.useEffect(() => {
    craft.env.setListener((env) => setIsDarkMode(env.colorScheme === "dark"));
  }, []);

  return isDarkMode;
}

async function handleGenerate() {
  const result = await craft.dataApi.getCurrentPage();
  if (result.status !== "success") {
    throw new Error(result.message);
  }
  const settings = getSettings();
  const pageBlock = result.data;
  const titleBlocks = pageBlock.subblocks.filter((x) => {
    return (
      x.type === "textBlock" &&
      (x.style.textStyle === "title" ||
        x.style.textStyle === "subtitle" ||
        x.style.textStyle === "heading" ||
        x.style.textStyle === "strong")
    );
  });
  const s2ind = {
    title: 0,
    subtitle: 1,
    heading: 2,
    strong: 3,
    body: 4,
    caption: 0,
    card: 0,
    page: 0,
  };
  const startLevel = titleBlocks
    .map((x) => {
      let b = x as CraftTextBlock;
      return s2ind[b.style.textStyle];
    })
    .reduce((pre, cur, _) => Math.min(pre, cur));

  const blocksToAdd = [];

  let collapsibleOffset = 0;
  if (settings.collapsible) {
    collapsibleOffset = 1;
    const toggle = craft.blockFactory.textBlock({
      content: "Table of Contents",
    });
    toggle.listStyle = craft.blockFactory.defaultListStyle("toggle");
    blocksToAdd.push(toggle);
  }

  for (let i = 0; i < titleBlocks.length; i++) {
    let b = titleBlocks[i] as CraftTextBlock;
    const newBlock = craft.blockFactory.textBlock({ content: [] });
    newBlock.content = [
      {
        text: b.content.map((x) => x.text).join(),
        link: {
          type: "blockLink",
          spaceId: b.spaceId as string,
          blockId: b.id,
        },
      },
    ];
    newBlock.listStyle = craft.blockFactory.defaultListStyle(
      settings.listType as ListStyleType
    );
    newBlock.indentationLevel =
      s2ind[b.style.textStyle] - startLevel + collapsibleOffset;
    blocksToAdd.push(newBlock);
  }
  const location =
    settings.insertPosition == "top"
      ? craft.location.indexLocation(pageBlock.id, 0)
      : undefined;
  craft.dataApi.addBlocks(blocksToAdd, location);
}

export function initApp() {
  ReactDOM.render(<App />, document.getElementById("react-root"));
}
