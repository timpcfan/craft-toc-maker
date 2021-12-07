import { CraftTextBlock } from "@craftdocs/craft-extension-api";
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
          <label className="fw-bold">Basic Contents</label>
          <Switch id="1" info="Include title" checked={true} />
          <Switch id="2" info="Include subtitle" checked={true} />
          <Switch id="3" info="Include heading" checked={true} />
          <Switch id="4" info="Include strong" checked={true} />
          <hr />
          <label className="fw-bold">Advance Contents</label>
          <Switch id="5" info="Include page blocks" checked={false} />
          <Switch id="6" info="Include paragraph starters" checked={false} />
          <hr />
          <label className="fw-bold">Generate list type</label>
          <select
            className="form-select"
            aria-label="Generate list type select"
          >
            <option value="bullet" selected>
              bullet
            </option>
            <option value="toggle">toggle</option>
            <option value="numbered">numbered</option>
            <option value="todo">todo</option>
            <option value="none">none</option>
          </select>
          <hr />
          <label className="fw-bold">Insert position</label>
          <select className="form-select" aria-label="Insert porsition select">
            <option value="beginning" selected>
              At the beginning
            </option>
            <option value="end">At the end</option>
          </select>
          <hr />
        </div>
        <button
          className={`btn btn-primary mt-3 ${isDarkMode ? "dark" : ""}`}
          onClick={handleGenerate}
        >
          Generate!
        </button>
      </div>
    </>
  );
};

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
  console.log(result.data);
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
    newBlock.listStyle = craft.blockFactory.defaultListStyle("bullet");
    newBlock.indentationLevel = s2ind[b.style.textStyle] - startLevel;
    blocksToAdd.push(newBlock);
  }
  craft.dataApi.addBlocks(
    blocksToAdd,
    craft.location.indexLocation(pageBlock.id, 0)
  );
}

export function initApp() {
  ReactDOM.render(<App />, document.getElementById("react-root"));
}
