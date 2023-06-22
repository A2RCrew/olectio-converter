import Cover from './Cover';
import DocumentBookmarks from './DocumentBookmarks';
import DocumentData from './DocumentData';
import DocumentMetadata from './DocumentMetadata';
import PaginatedRender from './PaginatedRender';
import PaginatedRenderWithProps from './PaginatedRenderWithProps';
import VerticalRender from './VerticalRender';

const epubSections: {
  title: string;
  hash: string;
  render?: (currentPage: number) => React.ReactElement;
}[] = [
  {
    title: `Display Document Metadata`,
    hash: `metadata`,
    render: () => <DocumentMetadata />,
  },
  {
    title: `Document Bookmarks Tree`,
    hash: `bookmarks`,
    render: () => <DocumentBookmarks />,
  },
  {
    title: `Document Object Data`,
    hash: `document`,
    render: () => <DocumentData />,
  },
  {
    title: `EPUB Cover`,
    hash: `cover`,
    render: () => <Cover />,
  },
  {
    title: `EPUB Vertical Scroll Render`,
    hash: `verticalRender`,
    render: () => <VerticalRender />,
  },
  {
    title: `EPUB Paginated Render`,
    hash: `paginatedRender`,
    render: () => <PaginatedRender />,
  },
  
  {
    title: `EPUB Paginated Render With Props`,
    hash: `paginatedRenderProps`,
    render: () => <PaginatedRenderWithProps />,
  },
  
];

export default epubSections;