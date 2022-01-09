export default async function parshToc(book) {
  const { toc } = book.navigation;
  // debugger;
  const { spine } = book;
  const validateHref = (href) => {
    if (href.startsWith("..")) {
      href = href.substring(2);
    }
    if (href.startsWith("/")) {
      href = href.substring(1);
    }
    return href;
  };
  const getSpineComponent = (href) => {
    return href.split("#")[0];
  };
  const getPositonComponent = (href) => {
    return href.split("#")[1];
  };

  const tocTree = [];

  /**
   * recursively go through toc and parsh it
   * @param {toc} toc
   * @param {parrent} parrent
   */
  const createTree = async (toc, parrent) => {
    for (let i = 0; i < toc.length; i += 1) {
      // get clean href
      const href = validateHref(toc[i].href);

      // get spin and elementId part from href
      const spineComponent = getSpineComponent(href);
      const positonComponent = getPositonComponent(href);

      // get spinItem from href
      const spineItem = spine.get(spineComponent);

      // load spin item
      await spineItem.load(book.load.bind(book)).then(() => {
        // debugger;
        // get element by positionComponent which is basically elementId
        const el = spineItem.document.getElementById(positonComponent);
        // get cfi from element
        const cfi = spineItem.cfiFromElement(el);
        // get percent from cfi
        const percentage = book.locations.percentageFromCfi(cfi);
        // toc item which has
        parrent[i] = {
          label: toc[i].label.trim(),
          children: [],
          href,
          cfi,
          percentage,
          toc: toc[i],
        };

        // if toc has subitems recursively parsh it
        if (toc[i].subitems) {
          createTree(toc[i].subitems, parrent[i].children);
        }
      });
    }
  };

  await createTree(toc, tocTree);
  return tocTree;
}
