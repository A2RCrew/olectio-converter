
import { useEffect, useState } from 'react';
import { getCurrentPDFDocument } from '~/logic/pdf/currentDocument';
import getDocumentPagesInfo from '~/logic/pdf/getDocumentPagesInfo';

type InfoType = Awaited<ReturnType<typeof getDocumentPagesInfo>>;
let memoPagesInfo: InfoType | undefined;
let lastDocument: ReturnType<typeof getCurrentPDFDocument>;

const useDocumentPagesInfo = () => {
  const document = getCurrentPDFDocument();
  if (document !== lastDocument) {
    memoPagesInfo = undefined;
  }
  const [pagesInfo, setPagesInfo] = useState<InfoType | undefined>(memoPagesInfo);
  useEffect(() => {
    if (!memoPagesInfo && document) {
      lastDocument = document;
      getDocumentPagesInfo(document)
        .then((newPagesInfo) => {
          memoPagesInfo = newPagesInfo;
          setPagesInfo(newPagesInfo);
        })
        .catch((err) => console.error(err));
    }
  }, [document]);
  return pagesInfo;
}

export default useDocumentPagesInfo;