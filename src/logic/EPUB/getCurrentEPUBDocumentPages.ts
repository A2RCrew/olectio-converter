import { getCurrentEPUBDocument } from "./currentDocument";

const getCurrentEPUBDocumentPages = (): number => {
  const document = getCurrentEPUBDocument();
  if (!document) {
    return 0;
  }
  return document.navigation.toc.length;
}

export default getCurrentEPUBDocumentPages;