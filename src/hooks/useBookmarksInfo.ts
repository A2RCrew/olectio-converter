import { type NavItem } from 'epubjs/types/navigation';
import { useEffect, useState } from 'react';
import { getCurrentEPUBDocument } from '~/logic/EPUB/currentDocument';
import { getCurrentPDFDocument } from '~/logic/pdf/currentDocument';
import getDocumentBookmarks from '~/logic/pdf/getDocumentBookmarks';

type InfoType = Awaited<ReturnType<typeof getDocumentBookmarks>>;
let documentBookmarks: InfoType | undefined;
let lastDocument:
  | ReturnType<typeof getCurrentPDFDocument>
  | ReturnType<typeof getCurrentEPUBDocument>;

const useBookmarksInfo = () => {
  const pdfDocument = getCurrentPDFDocument();
  const epubDocument = getCurrentEPUBDocument();
  const document = pdfDocument || epubDocument;
  if (document !== lastDocument) {
    documentBookmarks = undefined;
  }
  const [bookmarksInfo, setBookmarksInfo] = useState<InfoType | undefined | NavItem[]>(
    documentBookmarks,
  );
  useEffect(() => {
    if (!documentBookmarks && document) {
      lastDocument = document;
      if (pdfDocument) {
        getDocumentBookmarks(pdfDocument)
          .then((newPagesInfo) => {
            documentBookmarks = newPagesInfo;
            setBookmarksInfo(newPagesInfo);
          })
          .catch((err) => console.error(err));
      } else if (epubDocument) {
        setBookmarksInfo(epubDocument.navigation.toc);
      }
    }
  }, [document, pdfDocument, epubDocument]);
  return bookmarksInfo;
};

export default useBookmarksInfo;
