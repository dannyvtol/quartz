import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import { FileNode } from "./quartz/components/ExplorerNode";

function sortByWeight(fileNodeA: FileNode, fileNodeB: FileNode) {
  // Prioritize files before folders in listing
  if (fileNodeA.children.length === 0 && fileNodeB.children.length > 0) {
    return -1;
  }

  if (fileNodeA.children.length > 0 && fileNodeB.children.length === 0) {
    return 1;
  }

  if (fileNodeA.file !== null && fileNodeB.file !== null) {
    const frontmatterWeightA: number = (fileNodeA.file.frontmatter?.weight ?? 999) as number;
    const frontmatterWeightB = (fileNodeB.file.frontmatter?.weight ?? 999) as number;
  
    if (frontmatterWeightA < frontmatterWeightB) {
      return -1;
    }
  
    return 1;
  }

  // Sort folders by physical name instead of display name
  return fileNodeA.name.localeCompare(fileNodeB.name, undefined, {
    numeric: true,
    sensitivity: "base",
  });
}

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [],
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/jackyzha0/quartz",
      "Discord Community": "https://discord.gg/cRFFHYye7t",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs(),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(),
    Component.DesktopOnly(Component.Explorer({ sortFn: sortByWeight })),
  ],
  right: [
    Component.Graph(),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(),
    Component.DesktopOnly(Component.Explorer({ sortFn: sortByWeight })),
  ],
  right: [],
}
