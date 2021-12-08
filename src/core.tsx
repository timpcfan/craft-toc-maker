import { CraftTextBlock, ListStyleType } from "@craftdocs/craft-extension-api";
import { getSettings } from "./utils";

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
