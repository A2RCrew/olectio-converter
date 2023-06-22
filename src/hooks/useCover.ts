import { type Book } from "epubjs";
import { useEffect, useState } from "react";
import { getCurrentEPUBDocument } from "~/logic/EPUB/currentDocument";

const useCover = () => {
  const epubDocument = getCurrentEPUBDocument();
  
  const [coverUrl, setCoverUrl] = useState<string>('');

  const getCoverUrl = async (document: Book): Promise<void> => {    
    const url = await document.coverUrl();
    setCoverUrl(url || '');
  }
  useEffect(() => {
    if (epubDocument) {
      getCoverUrl(epubDocument)
        .catch(console.error);
    }
  }, [epubDocument]);
  return coverUrl;
};

export default useCover;
