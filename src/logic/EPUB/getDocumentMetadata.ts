import { type Book } from 'epubjs';

const getDocumentMetadata = (document: Book) => {
  const metadata = document.packaging.metadata;
  return {
    ...metadata,
  };
};

export default getDocumentMetadata;
