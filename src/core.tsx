import {
  CraftTextBlock,
  CraftTextBlockInsert,
  CraftTextRun,
  ListStyleType,
} from "@craftdocs/craft-extension-api";
import { getSettings, Settings } from "./utils";

export default async function handleGenerate() {
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
  }) as CraftTextBlock[];

  const blocksToAdd: CraftTextBlockInsert[] = [];

  if (settings.collapsible) {
    addCollapsibleHeader(blocksToAdd);
  }

  if (settings.tocStyle === "tight") {
    addTightToC(blocksToAdd, titleBlocks, settings);
  } else {
    addListToC(blocksToAdd, titleBlocks, settings);
  }

  const location =
    settings.insertPosition === "top"
      ? craft.location.indexLocation(pageBlock.id, 0)
      : undefined;
  craft.dataApi.addBlocks(blocksToAdd, location);
}

function addCollapsibleHeader(blocksToAdd: CraftTextBlockInsert[]) {
  const header = craft.blockFactory.textBlock({
    content: "Table of Contents",
    style: { textStyle: "title" },
    listStyle: craft.blockFactory.defaultListStyle("toggle"),
  });
  blocksToAdd.push(header);
}

function addListToC(
  blocksToAdd: CraftTextBlockInsert[],
  titleBlocks: CraftTextBlock[],
  settings: Settings
) {
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
    .map((x) => s2ind[x.style.textStyle])
    .reduce((pre, cur, _) => Math.min(pre, cur));

  for (let i = 0; i < titleBlocks.length; i++) {
    let b = titleBlocks[i];
    const newBlock = craft.blockFactory.textBlock({
      content: [
        {
          text: b.content.map((x) => x.text).join(),
          link: {
            type: "blockLink",
            spaceId: b.spaceId as string,
            blockId: b.id,
          },
        },
      ],
      listStyle: craft.blockFactory.defaultListStyle(
        settings.listType as ListStyleType
      ),
      indentationLevel:
        s2ind[b.style.textStyle] - startLevel + (settings.collapsible ? 1 : 0),
    });
    blocksToAdd.push(newBlock);
  }
}

function addTightToC(
  blocksToAdd: CraftTextBlockInsert[],
  titleBlocks: CraftTextBlock[],
  settings: Settings
) {
  const content: CraftTextRun[] = [];
  for (let i = 0; i < titleBlocks.length; i++) {
    let b = titleBlocks[i];
    content.push({
      text: b.content.map((x) => x.text).join(),
      link: {
        type: "blockLink",
        spaceId: b.spaceId as string,
        blockId: b.id,
      },
    });
    content.push({
      text: " | ",
    });
  }
  content.pop();
  const tightBlock = craft.blockFactory.textBlock({
    content: content,
    indentationLevel: settings.collapsible ? 1 : 0,
  });
  blocksToAdd.push(tightBlock);
}
